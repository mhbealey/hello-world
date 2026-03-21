# AlphaEdge — UI Content

All UI copy verbatim from spec Section 4.8.

## Navigation Labels

- Tab 1: "Home"
- Tab 2: "Trade"
- Tab 3: "Portfolio"
- Tab 4: "Settings"

## Onboarding Copy

- Step 1 header: "What kind of investor are you?"
- Step 2 header: "How do you handle a downturn?"
- Step 3 header: "Tell us about your experience"
- Step 4 header: "What's your current portfolio value?"
- Step 4 helper: "This helps us size positions correctly. You can update it anytime in Settings."
- Step 5 header: "Here's your investor DNA"
- Step 5 CTA: "See Your First Recommendation →"

## Alert Card Copy

- Stop-loss breach: "[TICKER] hit your stop-loss at $[PRICE]. Current: $[CURRENT]. Consider closing."
- Take-profit breach: "[TICKER] reached your target at $[PRICE]. Current: $[CURRENT]. Consider taking profit."
- Expiring recommendation: "Your [TICKER] recommendation expires today. Act now or dismiss."
- Stale balance: "It's been 30 days since you updated your portfolio balance. Update now?"
- Unfinished wizard: "You have an unfinished trade setup for [TICKER]. Continue?"
- Stock split alert: "[TICKER] may have split. Verify your position details."

## Recommendation Card Labels

- Score label: "AI Score"
- Confidence label: "Confidence"
- Thesis label: (no label — italic text below rating)
- Score delta: "↑ was [X]" / "↓ was [X]"
- Existing position: "You hold [X] shares at $[PRICE]"
- Expand prompt: "View Analysis →"
- Trade prompt: "Start Trade →"
- Watch prompt: "Watch"
- Skipped outcome: "If you'd taken this: [+/-X.X]% in [N] days"
- Disclaimer: "For informational purposes only. Not financial advice."

## Search Bar

- Placeholder: "Analyze any stock…"
- No results: "Couldn't find that ticker. Check the symbol and try again."
- Loading: "Analyzing [TICKER]…"

## First-Time Tooltips

- Tooltip 1: "This is the AI Score — 1 to 10, higher is stronger"
- Tooltip 2: "Tap any card to see the full bull and bear case"
- Tooltip 3: "Ready to act? Tap here to walk through the trade step by step"

## Execution Wizard Labels

- Step 1 title: "Analysis"
- Step 2 title: "Order Type"
- Step 2 descriptions:
  - Market: "Buy immediately at the current price. Fast but the price might shift."
  - Limit: "Buy only at your target price or lower. You control the price, but it might not fill."
  - Stop-Limit: "Buy once the stock hits a trigger price, then only at your limit. Best for breakout entries."
- Step 3 title: "Position Size"
- Step 4 title: "Review"
- Step 4 earnings warning: "Earnings in [N] days — gap risk. Consider smaller position or waiting."
- Step 5 title: "Execute"
- Copy button: "Copy All Details"
- Copy format:
  ```
  BUY [TICKER] ([Company Name])
  Order: [Type] @ $[Price]
  Shares: [N]
  Stop-Loss: $[Price]
  Take-Profit: $[Price]
  ```
- Fidelity button: "Open Fidelity"
- Post-trade prompt: "After you've placed the trade, come back and confirm."
- Confirm buttons: "I placed the trade" / "Not yet" / "Decided against it"
- Fill price warning: "Your fill price is [X]% different from the limit. Is this correct?"

## Portfolio Labels

- Section headers: "Your Holdings" / "Watchlist" / "Active Recommendations"
- Benchmark toggle: "Compare vs S&P 500"
- Chart toggle: "Line" / "Candlestick"
- Analytics header: "Trade Analytics"
- Weekly summary: "This week: [+/-X.X]% ($[amount]). [N] trades closed. Win rate: [X]%. S&P comparison: [beat/trailed] by [X.X]%."
- Empty holdings: "No trades logged yet. Complete your first trade to see it here."
- Empty analytics: "Complete at least 3 trades to see your analytics."
- Empty watchlist: "Add stocks to your watchlist to track them here."
- After hours: "After Hours"
- Close trade button: "Close Trade"
- Edit trade button: "Edit"
- Journal button: "Journal"
- Journal prompt: "What was your thesis? What happened? What did you learn?"
- Close shares: "Close [X] Shares"

## Settings Labels

- Profile section: "Investor Profile"
- Recalibrate: "Recalibrate Profile"
- Balance section: "Portfolio Balance"
- Update balance: "Update Balance"
- Balance last updated: "Last updated [date]"
- Display section: "Display"
- Colorblind toggle: "Colorblind-friendly colors"
- Cost section: "API Usage"
- Cost display: "$[X.XX] / $[budget] monthly budget"
- Daily calls: "[N] of [cap] daily analyses used"
- Export CSV: "Export Trade History (CSV)"
- Export JSON: "Export Full Backup (JSON)"
- Restore: "Restore from Backup"
- Backup now: "Backup Now"
- Clear button: "Clear All Data"
- Clear confirmation: "This will permanently delete all your trades, recommendations, and settings. Data will be recoverable for 7 days."
- Clear confirm: "Delete Everything"
- Clear cancel: "Keep My Data"
- Undo clear: "Undo Clear Data ([N] days remaining)"
- Restore failed: "Couldn't restore backup. The file may be corrupted."

## Toast Messages

- Trade saved: "Trade logged! View in portfolio."
- Trade closed: "Trade closed. Return: [+/-X.X]%"
- Copy success: "Copied to clipboard"
- Copy failed: "Couldn't copy to clipboard"
- Export success: "Trade history exported"
- Backup success: "Backup saved"
- Restore success: "Data restored successfully"
- Profile updated: "Profile updated. Recommendations will refresh."
- Balance updated: "Portfolio balance updated."
- Network error: "No connection. Showing cached data."
- AI error: "Couldn't generate recommendations. Pull to refresh."
- Rate limit: "Daily analysis limit reached. Recommendations refresh tomorrow."
- Refresh cooldown: "Recommendations were just refreshed. Try again in [N] minutes."
- Data cleared: "All data cleared. You have 7 days to undo."

## Error Messages

- Generic: "Something went wrong. Please try again."
- Network: "Can't connect. Check your internet and try again."
- Data stale: "Prices as of [timestamp]"
- Validation failed: "Couldn't process the AI response. Showing cached recommendations."
