/**
 * Market-wide stock screener.
 *
 * Scans the ENTIRE US equity market using every Yahoo Finance screener category.
 * No curated list. No static universe. The market itself tells us what to analyze.
 *
 * Each screener pulls from the full market with different criteria:
 * - day_gainers / day_losers: biggest movers today
 * - most_actives: highest volume (where institutional money is flowing)
 * - most_shorted_stocks: squeeze candidates
 * - undervalued_growth_stocks / undervalued_large_caps: value opportunities
 * - growth_technology_stocks: tech growth
 * - aggressive_small_caps / small_cap_gainers: small-cap opportunities
 * - portfolio_anchors: stable blue chips
 * - And more (funds, bonds, etc.)
 *
 * Results are deduplicated and pre-ranked, then the top candidates go to Claude.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yahooFinance: any = null;

async function getYF() {
  if (!yahooFinance) {
    const YahooFinance = (await import("yahoo-finance2")).default;
    yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  }
  return yahooFinance;
}

export interface ScreenerResult {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  pe: number | null;
  epsGrowth: number | null;
  fiftyTwoWeekChangePercent: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sector?: string;
  analystRating?: string;
  sources: string[]; // which screeners found it — appearing in multiple = stronger signal
}

/**
 * Every equity-relevant screener available from Yahoo Finance.
 * We run ALL of them to cast the widest net across the market.
 */
const ALL_SCREENERS = [
  "day_gainers",
  "day_losers",
  "most_actives",
  "most_shorted_stocks",
  "undervalued_growth_stocks",
  "undervalued_large_caps",
  "growth_technology_stocks",
  "aggressive_small_caps",
  "small_cap_gainers",
  "portfolio_anchors",
] as const;

const SCREENER_TIMEOUT_MS = 15_000;
const RESULTS_PER_SCREENER = 100; // Yahoo typically caps at 250

/**
 * Scan the entire market using all Yahoo Finance screeners.
 *
 * @param maxCandidates - How many top candidates to return for Claude scoring (default 30)
 * @returns Deduplicated, pre-ranked candidates from the entire market
 */
export async function scanMarket(maxCandidates = 30): Promise<ScreenerResult[]> {
  const yf = await getYF();
  const seen = new Map<string, ScreenerResult>();

  // Run ALL screeners in parallel — cast the widest possible net
  const results = await Promise.allSettled(
    ALL_SCREENERS.map(async (scrId) => {
      try {
        const data = await Promise.race([
          yf.screener({ scrIds: scrId, count: RESULTS_PER_SCREENER }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Screener ${scrId} timed out`)), SCREENER_TIMEOUT_MS)
          ),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { scrId, quotes: (data as any)?.quotes || [] };
      } catch (e) {
        console.warn(`Screener ${scrId} failed:`, e instanceof Error ? e.message : e);
        return { scrId, quotes: [] };
      }
    })
  );

  let totalQuotes = 0;
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { scrId, quotes } = result.value;
    totalQuotes += quotes.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const q of quotes as any[]) {
      const ticker = q.symbol;
      if (!ticker) continue;

      // Only equities (skip warrants, rights, preferred, etc.)
      if (q.quoteType && q.quoteType !== "EQUITY") continue;

      // Skip OTC/pink sheets
      if (q.exchange && ["PNK", "OTC"].includes(q.exchange)) continue;

      // Skip penny stocks (unreliable, illiquid)
      const price = q.regularMarketPrice ?? 0;
      if (price < 2) continue;

      // Skip extremely low volume (illiquid)
      const volume = q.regularMarketVolume ?? 0;
      if (volume < 50_000) continue;

      if (seen.has(ticker)) {
        // Stock appeared in multiple screeners — that's a stronger signal
        seen.get(ticker)!.sources.push(scrId);
      } else {
        seen.set(ticker, {
          ticker,
          name: q.longName || q.shortName || ticker,
          price,
          changePercent: q.regularMarketChangePercent ?? 0,
          volume,
          avgVolume: q.averageDailyVolume3Month ?? volume,
          marketCap: q.marketCap ?? 0,
          pe: q.trailingPE ?? q.forwardPE ?? null,
          epsGrowth: q.epsCurrentYear && q.epsTrailingTwelveMonths
            ? (q.epsCurrentYear - q.epsTrailingTwelveMonths) / Math.abs(q.epsTrailingTwelveMonths)
            : null,
          fiftyTwoWeekChangePercent: q.fiftyTwoWeekChangePercent ?? 0,
          fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? price,
          fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? price,
          analystRating: q.averageAnalystRating || undefined,
          sources: [scrId],
        });
      }
    }
  }

  console.log(`Market scan: ${totalQuotes} total quotes from ${ALL_SCREENERS.length} screeners → ${seen.size} unique equities`);

  // Rank candidates using a composite interest score
  const candidates = Array.from(seen.values());
  for (const c of candidates) {
    (c as ScreenerResult & { _score: number })._score = computeInterestScore(c);
  }

  // Sort by interest score descending
  candidates.sort((a, b) =>
    ((b as ScreenerResult & { _score: number })._score) -
    ((a as ScreenerResult & { _score: number })._score)
  );

  return candidates.slice(0, maxCandidates);
}

/**
 * Composite "interest score" for pre-ranking.
 * This is NOT the AI score — it's a heuristic to decide which stocks are worth
 * sending to Claude for deep analysis. Higher = more interesting.
 */
function computeInterestScore(stock: ScreenerResult): number {
  let score = 0;

  // Multi-screener appearance: appearing in multiple screeners = strong signal
  score += stock.sources.length * 15;

  // Volume relative to average: unusual volume = something is happening
  if (stock.avgVolume > 0) {
    const volumeRatio = stock.volume / stock.avgVolume;
    if (volumeRatio > 2) score += 20;
    else if (volumeRatio > 1.5) score += 10;
  }

  // Price movement: bigger moves (up or down) = more interesting
  const absChange = Math.abs(stock.changePercent);
  if (absChange > 5) score += 15;
  else if (absChange > 2) score += 8;

  // Market cap bonus: larger companies have more reliable data
  if (stock.marketCap > 100e9) score += 10;      // Mega cap
  else if (stock.marketCap > 10e9) score += 7;    // Large cap
  else if (stock.marketCap > 2e9) score += 4;     // Mid cap
  // Small caps get no bonus but aren't penalized

  // Analyst coverage: rated stocks have more context for Claude
  if (stock.analystRating) score += 5;

  // 52-week context: near highs or lows = decision point
  if (stock.price > 0 && stock.fiftyTwoWeekHigh > 0) {
    const pctFromHigh = (stock.fiftyTwoWeekHigh - stock.price) / stock.fiftyTwoWeekHigh;
    if (pctFromHigh < 0.05) score += 8;   // Near 52-week high — breakout?
    if (pctFromHigh > 0.30) score += 8;   // 30%+ off high — value opportunity?
  }

  return score;
}

/**
 * Fallback when screeners are unavailable.
 * Uses the static universe file + trending symbols.
 */
export async function scanMarketFallback(tickers: string[]): Promise<ScreenerResult[]> {
  const yf = await getYF();

  // Try trending first
  let fallbackTickers = [...tickers];
  try {
    const trending = await Promise.race([
      yf.trendingSymbols("US", { count: 30 }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Trending timed out")), 10_000)
      ),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trendingSymbols = (trending as any)?.quotes?.map((q: any) => q.symbol).filter(Boolean) || [];
    fallbackTickers = [...new Set([...trendingSymbols, ...tickers])];
  } catch {
    console.warn("Trending symbols fallback also failed");
  }

  // Batch-fetch quotes for fallback tickers
  const results: ScreenerResult[] = [];
  const batchSize = 10;

  for (let i = 0; i < fallbackTickers.length; i += batchSize) {
    const batch = fallbackTickers.slice(i, i + batchSize);
    const quotes = await Promise.allSettled(
      batch.map((t) => yf.quote(t))
    );

    for (const q of quotes) {
      if (q.status !== "fulfilled" || !q.value) continue;
      const v = q.value;
      if (!v.regularMarketPrice || v.regularMarketPrice < 2) continue;

      results.push({
        ticker: v.symbol,
        name: v.longName || v.shortName || v.symbol,
        price: v.regularMarketPrice,
        changePercent: v.regularMarketChangePercent ?? 0,
        volume: v.regularMarketVolume ?? 0,
        avgVolume: v.averageDailyVolume3Month ?? 0,
        marketCap: v.marketCap ?? 0,
        pe: v.trailingPE ?? null,
        epsGrowth: null,
        fiftyTwoWeekChangePercent: v.fiftyTwoWeekChangePercent ?? 0,
        fiftyTwoWeekHigh: v.fiftyTwoWeekHigh ?? v.regularMarketPrice,
        fiftyTwoWeekLow: v.fiftyTwoWeekLow ?? v.regularMarketPrice,
        analystRating: v.averageAnalystRating || undefined,
        sources: ["fallback"],
      });
    }
  }

  return results;
}
