/**
 * FRED (Federal Reserve Economic Data) client
 *
 * Fetches key macro indicators from the St. Louis Fed's free API.
 * No auth required for basic access, but an API key improves rate limits.
 *
 * Key series tracked:
 * - DFF: Federal Funds Effective Rate
 * - DGS10: 10-Year Treasury Yield
 * - DGS2: 2-Year Treasury Yield
 * - T10Y2Y: 10Y-2Y Spread (yield curve)
 * - UNRATE: Unemployment Rate
 * - CPIAUCSL: CPI (All Urban Consumers)
 * - GDP: Gross Domestic Product
 * - VIXCLS: CBOE Volatility Index
 * - BAMLH0A0HYM2: ICE BofA High Yield Spread (credit stress)
 * - DCOILWTICO: WTI Crude Oil Price
 */

const FRED_BASE = "https://api.stlouisfed.org/fred";

export interface FredObservation {
  date: string;
  value: number;
}

export interface MacroSnapshot {
  fedFundsRate: number | null;
  treasury10y: number | null;
  treasury2y: number | null;
  yieldCurveSpread: number | null;
  unemployment: number | null;
  cpiYoY: number | null;
  gdpGrowth: number | null;
  vix: number | null;
  highYieldSpread: number | null;
  oilPrice: number | null;
  fetchedAt: string;
}

export interface MacroTrend {
  seriesId: string;
  name: string;
  observations: FredObservation[];
  latestValue: number | null;
  previousValue: number | null;
  change: number | null;
  direction: "improving" | "worsening" | "stable";
}

// Series IDs and their human-readable names
const MACRO_SERIES: Record<string, { name: string; inverted?: boolean }> = {
  DFF: { name: "Federal Funds Rate" },
  DGS10: { name: "10-Year Treasury Yield" },
  DGS2: { name: "2-Year Treasury Yield" },
  T10Y2Y: { name: "Yield Curve (10Y-2Y Spread)" },
  UNRATE: { name: "Unemployment Rate", inverted: true },
  CPIAUCSL: { name: "CPI (All Urban Consumers)" },
  A191RL1Q225SBEA: { name: "Real GDP Growth Rate" },
  VIXCLS: { name: "VIX Volatility Index", inverted: true },
  BAMLH0A0HYM2: { name: "High Yield Credit Spread", inverted: true },
  DCOILWTICO: { name: "WTI Crude Oil Price" },
};

// In-memory cache with TTLs
const cache = new Map<string, { data: FredObservation[]; expiresAt: number }>();
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours — macro data doesn't change frequently

function getFredApiKey(): string | null {
  return process.env.FRED_API_KEY || null;
}

/**
 * Fetch a FRED series. Returns recent observations (last 30 by default).
 */
export async function fetchFredSeries(
  seriesId: string,
  limit: number = 30
): Promise<FredObservation[]> {
  const cacheKey = `${seriesId}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const apiKey = getFredApiKey();
  if (!apiKey) {
    console.warn("FRED_API_KEY not set — macro data unavailable");
    return [];
  }

  try {
    const url = `${FRED_BASE}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000); // 8s timeout
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 14400 } }); // 4hr cache
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`FRED API error for ${seriesId}: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const observations: FredObservation[] = (data.observations || [])
      .filter((o: { value: string }) => o.value !== ".")
      .map((o: { date: string; value: string }) => ({
        date: o.date,
        value: parseFloat(o.value),
      }))
      .reverse(); // chronological order

    cache.set(cacheKey, { data: observations, expiresAt: Date.now() + CACHE_TTL_MS });
    return observations;
  } catch (e) {
    console.error(`FRED fetch failed for ${seriesId}:`, e);
    return [];
  }
}

/**
 * Get latest value for a series
 */
async function getLatestValue(seriesId: string): Promise<number | null> {
  const obs = await fetchFredSeries(seriesId, 2);
  if (obs.length === 0) return null;
  return obs[obs.length - 1].value;
}

/**
 * Fetch a full macro snapshot — all key indicators at once
 */
export async function getMacroSnapshot(): Promise<MacroSnapshot> {
  const [
    fedFunds,
    t10y,
    t2y,
    spread,
    unemployment,
    cpi,
    gdp,
    vix,
    hySpread,
    oil,
  ] = await Promise.all([
    getLatestValue("DFF"),
    getLatestValue("DGS10"),
    getLatestValue("DGS2"),
    getLatestValue("T10Y2Y"),
    getLatestValue("UNRATE"),
    getLatestValue("CPIAUCSL"),
    getLatestValue("A191RL1Q225SBEA"),
    getLatestValue("VIXCLS"),
    getLatestValue("BAMLH0A0HYM2"),
    getLatestValue("DCOILWTICO"),
  ]);

  return {
    fedFundsRate: fedFunds,
    treasury10y: t10y,
    treasury2y: t2y,
    yieldCurveSpread: spread,
    unemployment,
    cpiYoY: cpi,
    gdpGrowth: gdp,
    vix,
    highYieldSpread: hySpread,
    oilPrice: oil,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get trend data for a specific series (used for charting)
 */
export async function getMacroTrend(seriesId: string): Promise<MacroTrend | null> {
  const meta = MACRO_SERIES[seriesId];
  if (!meta) return null;

  const observations = await fetchFredSeries(seriesId, 90);
  if (observations.length === 0) return null;

  const latest = observations[observations.length - 1].value;
  const previous = observations.length > 1 ? observations[observations.length - 2].value : null;
  const change = previous !== null ? latest - previous : null;

  let direction: "improving" | "worsening" | "stable" = "stable";
  if (change !== null && Math.abs(change) > 0.01) {
    // For inverted series (unemployment, VIX, credit spread), down = improving
    if (meta.inverted) {
      direction = change < 0 ? "improving" : "worsening";
    } else {
      direction = change > 0 ? "improving" : "worsening";
    }
  }

  return {
    seriesId,
    name: meta.name,
    observations,
    latestValue: latest,
    previousValue: previous,
    change,
    direction,
  };
}

/**
 * Build a macro context string for injection into Claude prompts.
 * This gives the AI awareness of the current economic environment.
 */
export async function buildMacroContext(): Promise<string> {
  const snapshot = await getMacroSnapshot();

  const lines: string[] = ["## Current Macro Environment"];

  if (snapshot.fedFundsRate !== null)
    lines.push(`- Fed Funds Rate: ${snapshot.fedFundsRate.toFixed(2)}%`);
  if (snapshot.treasury10y !== null)
    lines.push(`- 10-Year Treasury: ${snapshot.treasury10y.toFixed(2)}%`);
  if (snapshot.treasury2y !== null)
    lines.push(`- 2-Year Treasury: ${snapshot.treasury2y.toFixed(2)}%`);
  if (snapshot.yieldCurveSpread !== null) {
    const inverted = snapshot.yieldCurveSpread < 0;
    lines.push(`- Yield Curve (10Y-2Y): ${snapshot.yieldCurveSpread.toFixed(2)}% ${inverted ? "⚠ INVERTED" : ""}`);
  }
  if (snapshot.unemployment !== null)
    lines.push(`- Unemployment: ${snapshot.unemployment.toFixed(1)}%`);
  if (snapshot.gdpGrowth !== null)
    lines.push(`- Real GDP Growth: ${snapshot.gdpGrowth.toFixed(1)}%`);
  if (snapshot.vix !== null) {
    const regime = snapshot.vix > 30 ? "HIGH VOLATILITY" : snapshot.vix > 20 ? "ELEVATED" : "NORMAL";
    lines.push(`- VIX: ${snapshot.vix.toFixed(1)} (${regime})`);
  }
  if (snapshot.highYieldSpread !== null) {
    const stress = snapshot.highYieldSpread > 6 ? "STRESSED" : snapshot.highYieldSpread > 4 ? "ELEVATED" : "NORMAL";
    lines.push(`- High Yield Spread: ${snapshot.highYieldSpread.toFixed(2)}% (${stress})`);
  }
  if (snapshot.oilPrice !== null)
    lines.push(`- WTI Crude: $${snapshot.oilPrice.toFixed(2)}`);

  // Derived signals
  const signals: string[] = [];
  if (snapshot.yieldCurveSpread !== null && snapshot.yieldCurveSpread < 0)
    signals.push("Yield curve inverted — historically precedes recession by 12-18 months");
  if (snapshot.vix !== null && snapshot.vix > 30)
    signals.push("VIX elevated — expect larger price swings, widen stop-losses");
  if (snapshot.highYieldSpread !== null && snapshot.highYieldSpread > 5)
    signals.push("Credit stress elevated — favor quality over speculative names");
  if (snapshot.fedFundsRate !== null && snapshot.fedFundsRate > 4)
    signals.push("Tight monetary policy — headwind for growth stocks, tailwind for cash-rich value");

  if (signals.length > 0) {
    lines.push("");
    lines.push("## Macro Signals");
    signals.forEach((s) => lines.push(`- ${s}`));
  }

  return lines.join("\n");
}

/**
 * List of available macro series for the UI
 */
export function getAvailableSeries(): { id: string; name: string }[] {
  return Object.entries(MACRO_SERIES).map(([id, meta]) => ({
    id,
    name: meta.name,
  }));
}
