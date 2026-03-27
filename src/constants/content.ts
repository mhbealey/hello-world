export const NAV = {
  home: "Home",
  discover: "Discover",
  trade: "Trade",
  portfolio: "Portfolio",
  settings: "Settings",
} as const;

export const ONBOARDING = {
  step1Header: "What kind of investor are you?",
  step2Header: "How do you handle a downturn?",
  step2Subheader: "If your portfolio dropped 15% in a week, what would you do?",
  step3Header: "Tell us about your experience",
  step4Header: "What's your current portfolio value?",
  step4Helper: "This helps us size positions correctly. You can update it anytime in Settings.",
  step5Header: "Here's your investor DNA",
  step5CTA: "See Your First Recommendation →",
  styles: {
    growth: { label: "Growth Hunter", description: "Find the next big winner" },
    value: { label: "Value Seeker", description: "Buy great companies on sale" },
    momentum: { label: "Momentum Trader", description: "Ride trends and technical setups" },
    income: { label: "Income Builder", description: "Dividends and steady returns" },
  },
  riskOptions: [
    "Sell everything",
    "Trim the losers",
    "Hold steady",
    "Buy the dip",
  ],
  instruments: ["Stocks", "ETFs", "Options", "Crypto"],
  portfolioRanges: ["$10K–$25K", "$25K–$100K", "$100K–$500K", "$500K+"],
} as const;

export const RECOMMENDATIONS = {
  scoreLabel: "AI Score",
  confidenceLabel: "Confidence",
  scoreDeltaUp: (prev: number) => `↑ was ${prev}`,
  scoreDeltaDown: (prev: number) => `↓ was ${prev}`,
  existingPosition: (shares: number, price: string) =>
    `You hold ${shares} shares at ${price}`,
  expandPrompt: "View Analysis →",
  tradePrompt: "Start Trade →",
  watchPrompt: "Watch",
  skippedOutcome: (pct: string, days: number) =>
    `If you'd taken this: ${pct} in ${days} days`,
  disclaimer: "For informational purposes only. Not financial advice.",
  emptyFirst: "Generating your first recommendations… This takes about 30 seconds.",
  emptyNoData: "Markets are closed and we couldn't fetch data. Pull to refresh when markets open.",
} as const;

export const SEARCH = {
  placeholder: "Analyze any stock…",
  noResults: "Couldn't find that ticker. Check the symbol and try again.",
  loading: (ticker: string) => `Analyzing ${ticker}…`,
} as const;

export const TOOLTIPS = {
  step1: "This is the AI Score — 1 to 10, higher is stronger",
  step2: "Tap any card to see the full bull and bear case",
  step3: "Ready to act? Tap here to walk through the trade step by step",
} as const;

export const WIZARD = {
  step1Title: "Analysis",
  step2Title: "Order Type",
  step3Title: "Position Size",
  step4Title: "Review",
  step5Title: "Execute",
  orderTypes: {
    market: "Buy immediately at the current price. Fast but the price might shift.",
    limit: "Buy only at your target price or lower. You control the price, but it might not fill.",
    stopLimit: "Buy once the stock hits a trigger price, then only at your limit. Best for breakout entries.",
  },
  earningsWarning: (days: number) =>
    `Earnings in ${days} days — gap risk. Consider smaller position or waiting.`,
  copyButton: "Copy All Details",
  fidelityButton: "Open Fidelity",
  postTradePrompt: "After you've placed the trade, come back and confirm.",
  confirmPlaced: "I placed the trade",
  confirmNotYet: "Not yet",
  confirmDeclined: "Decided against it",
  fillPriceWarning: (pct: string) =>
    `Your fill price is ${pct} different from the limit. Is this correct?`,
  copyFormat: (ticker: string, company: string, type: string, price: string, shares: number, stopLoss: string, takeProfit: string) =>
    `BUY ${ticker} (${company})\nOrder: ${type} @ ${price}\nShares: ${shares}\nStop-Loss: ${stopLoss}\nTake-Profit: ${takeProfit}`,
} as const;

export const PORTFOLIO = {
  holdingsHeader: "Your Holdings",
  watchlistHeader: "Watchlist",
  activeRecsHeader: "Active Recommendations",
  benchmarkToggle: "Compare vs S&P 500",
  chartToggleLine: "Line",
  chartToggleCandlestick: "Candlestick",
  analyticsHeader: "Trade Analytics",
  weeklySummary: (pct: string, amount: string, trades: number, winRate: string, spComparison: string) =>
    `This week: ${pct} (${amount}). ${trades} trades closed. Win rate: ${winRate}. S&P comparison: ${spComparison}.`,
  emptyHoldings: "No trades logged yet. Complete your first trade to see it here.",
  emptyAnalytics: "Complete at least 3 trades to see your analytics.",
  emptyWatchlist: "Add stocks to your watchlist to track them here.",
  afterHours: "After Hours",
  closeTrade: "Close Trade",
  editTrade: "Edit",
  journal: "Journal",
  journalPrompt: "What was your thesis? What happened? What did you learn?",
  closeShares: (shares: number) => `Close ${shares} Shares`,
} as const;

export const SETTINGS = {
  profileSection: "Investor Profile",
  recalibrate: "Recalibrate Profile",
  balanceSection: "Portfolio Balance",
  updateBalance: "Update Balance",
  balanceLastUpdated: (date: string) => `Last updated ${date}`,
  displaySection: "Display",
  colorblindToggle: "Colorblind-friendly colors",
  costSection: "API Usage",
  costDisplay: (spent: string, budget: string) => `${spent} / ${budget} monthly budget`,
  dailyCalls: (used: number, cap: number) => `${used} of ${cap} daily analyses used`,
  exportCSV: "Export Trade History (CSV)",
  exportJSON: "Export Full Backup (JSON)",
  restore: "Restore from Backup",
  backupNow: "Backup Now",
  clearButton: "Clear All Data",
  clearConfirmation: "This will permanently delete all your trades, recommendations, and settings. Data will be recoverable for 7 days.",
  clearConfirm: "Delete Everything",
  clearCancel: "Keep My Data",
  undoClear: (days: number) => `Undo Clear Data (${days} days remaining)`,
  restoreFailed: "Couldn't restore backup. The file may be corrupted.",
} as const;

export const ALERTS = {
  stopLoss: (ticker: string, price: string, current: string) =>
    `${ticker} hit your stop-loss at ${price}. Current: ${current}. Consider closing.`,
  takeProfit: (ticker: string, price: string, current: string) =>
    `${ticker} reached your target at ${price}. Current: ${current}. Consider taking profit.`,
  expiringRec: (ticker: string) =>
    `Your ${ticker} recommendation expires today. Act now or dismiss.`,
  staleBalance: "It's been 30 days since you updated your portfolio balance. Update now?",
  unfinishedWizard: (ticker: string) =>
    `You have an unfinished trade setup for ${ticker}. Continue?`,
  stockSplit: (ticker: string) =>
    `${ticker} may have split. Verify your position details.`,
} as const;

export const TOASTS = {
  tradeSaved: "Trade logged! View in portfolio.",
  tradeClosed: (returnPct: string) => `Trade closed. Return: ${returnPct}`,
  copySuccess: "Copied to clipboard",
  copyFailed: "Couldn't copy to clipboard",
  exportSuccess: "Trade history exported",
  backupSuccess: "Backup saved",
  restoreSuccess: "Data restored successfully",
  profileUpdated: "Profile updated. Recommendations will refresh.",
  balanceUpdated: "Portfolio balance updated.",
  networkError: "No connection. Showing cached data.",
  aiError: "Couldn't generate recommendations. Pull to refresh.",
  rateLimit: "Daily analysis limit reached. Recommendations refresh tomorrow.",
  refreshCooldown: (minutes: number) =>
    `Recommendations were just refreshed. Try again in ${minutes} minutes.`,
  dataCleared: "All data cleared. You have 7 days to undo.",
} as const;

export const ERRORS = {
  generic: "Something went wrong. Please try again.",
  network: "Can't connect. Check your internet and try again.",
  dataStale: (timestamp: string) => `Prices as of ${timestamp}`,
  validationFailed: "Couldn't process the AI response. Showing cached recommendations.",
} as const;
