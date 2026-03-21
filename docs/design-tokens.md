# Design Tokens

Single source of truth for all design decisions.

## Colors (Light Mode)

| Token         | Value                      |
|---------------|----------------------------|
| bg            | #F5F4F1                    |
| surface       | #FFFFFF                    |
| surfaceDim    | #EDECE8                    |
| text          | #0F0F0F                    |
| textSecondary | #3D3D3D                    |
| textTertiary  | #7A7A74                    |
| textMuted     | #ADADA6                    |
| accent        | #E87425                    |
| accentBg      | rgba(232,116,37,0.06)      |
| success       | #15803D                    |
| successBg     | rgba(21,128,61,0.07)       |
| warning       | #B45309                    |
| warningBg     | rgba(180,83,9,0.07)        |
| danger        | #B91C1C                    |
| dangerBg      | rgba(185,28,28,0.07)       |
| border        | rgba(0,0,0,0.06)           |
| borderLight   | rgba(0,0,0,0.03)           |

## Colors (Dark Mode)

| Token         | Value                      |
|---------------|----------------------------|
| bg            | #0A0A0A                    |
| surface       | #1A1A19                    |
| surfaceDim    | #141413                    |
| text          | #E8E5E0                    |
| textSecondary | #9B9790                    |
| textTertiary  | #5E5C57                    |
| textMuted     | #3E3D3A                    |
| accent        | #E87425                    |
| accentBg      | rgba(232,116,37,0.12)      |
| success       | #22C55E                    |
| successBg     | rgba(34,197,94,0.12)       |
| warning       | #F59E0B                    |
| warningBg     | rgba(245,158,11,0.12)      |
| danger        | #EF4444                    |
| dangerBg      | rgba(239,68,68,0.12)       |
| border        | rgba(255,255,255,0.07)     |
| borderLight   | rgba(255,255,255,0.04)     |

## Typography

| Token    | Font          | Weights   | Fallback                                |
|----------|---------------|-----------|-----------------------------------------|
| sans     | DM Sans       | 300-700   | -apple-system, BlinkMacSystemFont, sans-serif |
| mono     | JetBrains Mono| 400-700   | monospace                               |

## Border Radius

| Token | Value |
|-------|-------|
| sm    | 6px   |
| md    | 10px  |
| lg    | 14px  |

## Shadows

| Token | Value                          |
|-------|--------------------------------|
| sm    | 0 1px 2px rgba(0,0,0,0.04)    |
| md    | 0 2px 8px rgba(0,0,0,0.06)    |

## Spacing

Default Tailwind spacing scale.

## Animation

| Token          | Value                         |
|----------------|-------------------------------|
| ease-out-expo  | cubic-bezier(.16,1,.3,1)      |
| expand         | 450ms ease-out-expo           |
| content-fade   | 300ms ease, 60ms delay        |
| tab-switch     | 120ms crossfade               |
| drill-in       | 200ms slide-left              |
| back           | 200ms slide-right             |
| bottom-sheet   | 300ms slide-up spring         |
| toast          | 300ms slide-up/down           |
| stagger        | 50ms delay per card           |
