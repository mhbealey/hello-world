# UI Content

Single source of truth for all UI copy. No hardcoded strings in components.

## Labels

### Screen Titles
- Home: "Home"
- Risk Scenarios: "Risk Scenarios"
- Recommended Actions: "Recommended Actions"
- AI Posture: "AI Posture"
- Funds: "Funds"

### Section Labels
- "Annual Loss Exposure"
- "Controls Effective"
- "Policy Coverage"
- "Incident Readiness"

### Button Labels
- "Talk to Advisor"
- "Mark as Resolved"
- "Schedule a Call"
- "View all"
- "Back to [screen]"

## Empty States

| Screen | Message | CTA |
|--------|---------|-----|
| No funds | "No funds configured yet. Add your first fund to get started." | "Add Fund" |
| No risks | "No risk scenarios have been assessed. Run your first assessment." | "Start Assessment" |
| No actions | "No recommended actions. Your governance posture is strong." | _(none — celebratory)_ |
| No AI tools | "No AI tools have been inventoried." | "Add Tool" |
| No assessment data | "Awaiting first assessment. Data will appear once your advisor completes the initial review." | "Contact Advisor" |
| New org (no data) | "Welcome to [org name]. Let's set up your governance program." | "Start Setup" |

## Error States

| Error | Message |
|-------|---------|
| API timeout | "Unable to load data. Pull down to refresh or try again in a moment." |
| Auth failure | "Session expired. Please log in again." |
| Network offline | "You're offline. Showing data from [date]. Changes will sync when you reconnect." |
| Permission denied | "You don't have access to this feature. Contact your administrator." |
| Rate limited | "Too many requests. Please wait a moment." |
| Chat API error | "Unable to reach the AI assistant. Try again in a few seconds." |
| Export failed | "PDF generation failed. Please try again." |

## Loading States

| State | Behavior |
|-------|----------|
| Screen loading | Skeleton shimmer matching the layout structure |
| Action in progress | "Saving…" / "Resolving…" / "Scheduling…" |
| Chat thinking | Three-dot animation with "Thinking…" |
| Export generating | "Generating your report…" |

## Toasts

| Event | Message |
|-------|---------|
| Action resolved | "[Action title] resolved" |
| Action undone | "[Action title] restored" |
| Step completed | _(no toast — immediate visual feedback only)_ |
| Advisor booked | "Call scheduled for [time]" |
| Export ready | "Report downloaded" |
| Error | "Something went wrong. Please try again." |

## Freshness Indicators

| Age | Indicator | Label |
|-----|-----------|-------|
| < 7 days | Green dot | "Current" |
| 7–30 days | Amber dot | "Updated [X] days ago" |
| > 30 days | Red dot | "Stale — last updated [date]" |

## LP Deadline Urgency

| Days Remaining | Style |
|----------------|-------|
| 14+ days | Normal display |
| 7–14 days | Amber text |
| 1–7 days | Red text, "LP Review in [X] days" |
| Today | Red background, "LP Review TODAY" |
| Past due | Red background, "LP Review OVERDUE by [X] days" |

## Overdue Severity

| Days Overdue | Style |
|--------------|-------|
| 1–7 days | Amber |
| 8–30 days | Red |
| 30+ days | Red with emphasis icon |
