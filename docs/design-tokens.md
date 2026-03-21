# AlphaEdge — Design Tokens

## Colors (Dark Mode — Primary, Default)

| Token             | Value                  | Usage                     |
|-------------------|------------------------|---------------------------|
| bg-base           | #0D0D0F                | App background            |
| bg-surface        | #1A1B23                | Cards, elevated surfaces  |
| bg-surface-hover  | #22232E                | Card hover/press state    |
| bg-input          | #13141A                | Input field backgrounds   |
| border-default    | rgba(255,255,255,0.05) | Card borders              |
| border-focus      | #3B82F6                | Focused input borders     |
| text-primary      | #E8E8ED                | Primary text              |
| text-secondary    | #8B8B9E                | Secondary/muted text      |
| text-tertiary     | #5C5C6F                | Disabled/placeholder text |
| accent-blue       | #3B82F6                | CTAs, active tab, links   |
| accent-blue-hover | #2563EB                | Button hover              |
| gain-green        | #22C55E                | Positive returns          |
| loss-red          | #EF4444                | Negative returns          |
| gain-alt-blue     | #0066CC                | Colorblind mode: gains    |
| loss-alt-orange   | #FF6B00                | Colorblind mode: losses   |
| warning-amber     | #F59E0B                | Warnings, caution badges  |
| score-high        | #22C55E                | AI Score 7–10             |
| score-mid         | #F59E0B                | AI Score 4–6              |
| score-low         | #EF4444                | AI Score 1–3              |

## Typography

- **Font family:** Inter (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)
- **Tabular figures:** `font-variant-numeric: tabular-nums` on ALL financial numbers

| Token    | Size  | Weight | Usage                                                            |
|----------|-------|--------|------------------------------------------------------------------|
| display  | 28px  | 700    | Portfolio value hero number                                      |
| title-lg | 22px  | 600    | Screen titles                                                    |
| title-md | 18px  | 600    | Section headers                                                  |
| body-lg  | 16px  | 400    | Primary body text                                                |
| body-md  | 14px  | 400    | Secondary text, card details                                     |
| body-sm  | 12px  | 400    | Timestamps, disclaimers                                          |
| mono     | 14px  | 500    | Ticker symbols (font-family: 'SF Mono', 'Fira Code', monospace) |

## Spacing

| Token    | Value |
|----------|-------|
| space-xs | 4px   |
| space-sm | 8px   |
| space-md | 16px  |
| space-lg | 24px  |
| space-xl | 32px  |
| space-2xl| 48px  |

## Layout

- **Max content width:** 390px (iPhone viewport, fluid scaling)
- **Screen padding:** 16px horizontal
- **Card padding:** 16px
- **Card border-radius:** 12px
- **Card border:** 1px solid rgba(255,255,255,0.05)
- **Card gap:** 12px between cards in a list
- **Bottom tab bar height:** 64px + safe area inset
- **Safe area handling:** Respect iOS notch and Android navigation bar

## Touch Targets

- **Minimum:** 44×44px (all interactive elements)
- **Recommended for primary CTAs:** 48×48px
- **Tab bar icons:** 48×48px tap area

## Animations & Transitions

| Interaction              | Duration        | Easing           | Haptic               |
|--------------------------|-----------------|------------------|----------------------|
| Screen transition        | 300ms           | ease-in-out      | No                   |
| Card expand/collapse     | 250ms           | ease-out         | No                   |
| Tab switch               | 200ms           | ease-in-out      | Light impact         |
| Stepper step transition  | 300ms           | ease-in-out      | No                   |
| Toast appear             | 200ms           | ease-out         | No                   |
| Toast dismiss            | 150ms           | ease-in          | No                   |
| Chart scrub              | 0ms (immediate) | linear           | No                   |
| Pull-to-refresh          | 300ms           | spring           | No                   |
| Shimmer animation        | 1500ms          | linear, infinite | No                   |
| AI Score count-up        | 600ms           | ease-out         | No                   |
| AI Score pulse (new rec) | 400ms           | ease-in-out      | Light impact         |
| Copy to clipboard        | —               | —                | Success notification |
| Trade confirmation       | —               | —                | Medium impact        |
| Bottom sheet open        | 300ms           | ease-out         | No                   |
| Bottom sheet close       | 200ms           | ease-in          | No                   |
