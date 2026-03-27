/**
 * Tradeable stock universe — the full canvas AlphaEdge scans.
 *
 * This covers the S&P 500 + notable mid-caps, growth names, and sector leaders.
 * The watchlist and any manually analyzed tickers are ALWAYS included on top of this.
 * On refresh, the pre-screener fetches quotes for ALL of these, ranks by
 * momentum/relevance, then sends the top candidates to Claude for deep scoring.
 */

export const STOCK_UNIVERSE: Record<string, string[]> = {
  // ─── Technology ───
  technology: [
    // Mega-cap
    "AAPL", "MSFT", "NVDA", "GOOGL", "META", "AVGO", "ORCL", "CRM", "AMD", "ADBE",
    "NOW", "INTU", "IBM", "TXN", "QCOM", "AMAT", "MU", "ADI", "LRCX", "KLAC",
    // Growth / Cloud / Cyber
    "SHOP", "SNOW", "PLTR", "NET", "CRWD", "PANW", "DDOG", "ZS", "MDB", "TEAM",
    "HUBS", "WDAY", "FTNT", "ANET", "MRVL", "SMCI", "CDNS", "SNPS", "ANSS", "KEYS",
    // Semis
    "ASML", "TSM", "ARM", "ON", "NXPI", "MCHP", "SWKS", "QRVO", "MPWR", "ENTG",
    // Mid-cap / Emerging
    "SOFI", "HOOD", "APP", "IONQ", "RGTI", "ASAN", "ZI", "CFLT", "S", "GTLB",
  ],

  // ─── Financials ───
  financials: [
    "JPM", "V", "MA", "BAC", "WFC", "GS", "MS", "BLK", "SCHW", "AXP",
    "SPGI", "ICE", "CME", "CB", "PGR", "MET", "AIG", "BRK-B", "C", "COIN",
    "USB", "PNC", "TFC", "FIS", "FISV", "GPN", "SQ", "PYPL", "MSTR", "AFRM",
    "MCO", "MSCI", "NDAQ", "TROW", "BEN", "IVZ", "RJF", "HBAN", "CFG", "KEY",
  ],

  // ─── Healthcare ───
  healthcare: [
    "UNH", "JNJ", "LLY", "PFE", "ABBV", "MRK", "TMO", "ABT", "AMGN", "BMY",
    "GILD", "ISRG", "VRTX", "REGN", "SYK", "MDT", "CI", "ELV", "HCA", "DXCM",
    "ZTS", "IQV", "IDXX", "BDX", "BSX", "EW", "A", "DHR", "BAX", "HOLX",
    "MRNA", "BIIB", "ILMN", "ALGN", "PODD", "INCY", "NBIX", "EXAS", "SRPT", "PCVX",
  ],

  // ─── Consumer Discretionary ───
  consumer_discretionary: [
    "AMZN", "TSLA", "HD", "MCD", "NKE", "LOW", "SBUX", "TJX", "BKNG", "CMG",
    "ABNB", "LULU", "ROST", "DHI", "GM", "F", "RIVN", "LCID", "DASH", "UBER",
    "LEN", "PHM", "MAR", "HLT", "YUM", "DPZ", "DKNG", "WYNN", "LVS", "MGM",
    "DECK", "CROX", "BIRK", "ETSY", "W", "CAVA", "TXRH", "WING", "SHAK", "DRI",
  ],

  // ─── Consumer Staples ───
  consumer_staples: [
    "PG", "KO", "PEP", "COST", "WMT", "PM", "MO", "CL", "KMB", "GIS",
    "MDLZ", "STZ", "KHC", "HSY", "SJM", "MKC", "CHD", "CLX", "K", "CAG",
    "SYY", "KR", "TGT", "DG", "DLTR", "EL", "MNST", "KDP", "HRL", "CPB",
  ],

  // ─── Industrials ───
  industrials: [
    "CAT", "DE", "UNP", "RTX", "HON", "BA", "LMT", "GE", "WM", "RSG",
    "UPS", "FDX", "CSX", "NSC", "EMR", "ITW", "PH", "ROK", "GD", "NOC",
    "TDG", "WM", "VRSK", "CPRT", "ODFL", "FAST", "SWK", "IR", "AME", "AXON",
    "TT", "CARR", "OTIS", "DOV", "GWW", "CMI", "PCAR", "WAB", "DAL", "UAL",
  ],

  // ─── Energy ───
  energy: [
    "XOM", "CVX", "COP", "SLB", "EOG", "PXD", "MPC", "PSX", "VLO", "OXY",
    "HAL", "DVN", "FANG", "HES", "KMI", "WMB", "OKE", "TRGP", "ET", "EPD",
    "BKR", "CTRA", "MRO", "APA", "RRC", "AR", "EQT", "CHK", "SM", "CNX",
  ],

  // ─── Materials ───
  materials: [
    "LIN", "APD", "SHW", "ECL", "FCX", "NEM", "NUE", "GOLD", "CF", "ALB",
    "VMC", "MLM", "PPG", "DOW", "DD", "EMN", "CE", "FMC", "IFF", "PKG",
    "STLD", "CLF", "AA", "X", "RIO", "BHP", "VALE", "SCCO", "MP", "LAC",
  ],

  // ─── Real Estate ───
  real_estate: [
    "AMT", "PLD", "CCI", "EQIX", "SPG", "O", "PSA", "DLR", "WELL", "AVB",
    "VICI", "IRM", "ARE", "MAA", "UDR", "ESS", "CPT", "EXR", "INVH", "GLPI",
    "SUI", "ELS", "PEAK", "KIM", "REG", "FRT", "BXP", "SLG", "VNO", "HIW",
  ],

  // ─── Utilities ───
  utilities: [
    "NEE", "DUK", "SO", "D", "AEP", "SRE", "XEL", "ED", "WEC", "ES",
    "EXC", "AWK", "DTE", "PPL", "FE", "CMS", "AES", "PEG", "ETR", "EVRG",
    "ATO", "NI", "LNT", "OGE", "PNW", "BKH", "NWE", "AVA", "SR", "UTL",
  ],

  // ─── Communication Services ───
  communication: [
    "NFLX", "DIS", "T", "VZ", "TMUS", "CMCSA", "CHTR", "RBLX", "TTWO", "EA",
    "WBD", "PARA", "MTCH", "PINS", "SNAP", "SPOT", "LYV", "IACI", "ZM", "ROKU",
  ],

  // ─── Crypto-adjacent / Digital Assets ───
  crypto_adjacent: [
    "COIN", "MSTR", "MARA", "RIOT", "CLSK", "HUT", "BITF", "WULF", "IREN", "CORZ",
  ],

  // ─── ETFs (broad exposure, always useful for context) ───
  etfs: [
    "SPY", "QQQ", "IWM", "DIA", "XLF", "XLE", "XLK", "XLV", "XLI", "XLP",
    "XLU", "XLRE", "XLB", "XLC", "XLY", "GLD", "SLV", "TLT", "HYG", "VNQ",
  ],
};

/** Flat list of all tickers in the universe */
export function getAllTickers(): string[] {
  const all = Object.values(STOCK_UNIVERSE).flat();
  return [...new Set(all)]; // deduplicate
}

/** Get tickers by sector */
export function getTickersBySector(sector: string): string[] {
  return STOCK_UNIVERSE[sector] || [];
}

/** Get all sector names */
export function getSectors(): string[] {
  return Object.keys(STOCK_UNIVERSE);
}

/** Total count of unique tickers */
export function getUniverseSize(): number {
  return getAllTickers().length;
}

/**
 * Profile-weighted sector relevance.
 * Higher weight = more candidates from that sector survive pre-screening.
 */
export function getSectorWeights(investingStyle: string): Record<string, number> {
  const base: Record<string, number> = {
    technology: 1, financials: 1, healthcare: 1, consumer_discretionary: 1,
    consumer_staples: 1, industrials: 1, energy: 1, materials: 1,
    real_estate: 1, utilities: 1, communication: 1, crypto_adjacent: 0.5,
    etfs: 0.3,
  };

  switch (investingStyle) {
    case "growth":
      return { ...base, technology: 3, consumer_discretionary: 2, healthcare: 2, communication: 1.5, crypto_adjacent: 1 };
    case "value":
      return { ...base, financials: 3, consumer_staples: 2, industrials: 2, energy: 1.5, utilities: 1.5, materials: 1.5 };
    case "momentum":
      return { ...base, technology: 2, consumer_discretionary: 2, energy: 1.5, communication: 1.5, crypto_adjacent: 1.5 };
    case "income":
      return { ...base, utilities: 3, real_estate: 3, consumer_staples: 2, energy: 2, financials: 1.5 };
    default:
      return base;
  }
}
