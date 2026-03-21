# AlphaEdge — Interactions Specification

## Touch Targets

- **Minimum:** 44×44px for all interactive elements
- **Primary CTAs:** 48×48px recommended
- **Tab bar icons:** 48×48px tap area
- **Onboarding cards:** minimum 44×44px, full-width preferred

## Gestures

| Gesture             | Location                  | Action                                    |
|---------------------|---------------------------|-------------------------------------------|
| Tap                 | Recommendation card       | Expand/collapse Layer 2                   |
| Tap                 | "Full Analysis" button    | Open Layer 3 view                         |
| Tap                 | "Start Trade →" button    | Open Trade Execution Wizard               |
| Tap                 | Tab bar item              | Switch tab                                |
| Tap                 | Onboarding card           | Select option, auto-advance               |
| Tap                 | Filter/sort pill          | Activate filter                           |
| Tap                 | Copy icon                 | Copy field to clipboard                   |
| Tap                 | Portfolio snapshot card    | Navigate to Portfolio screen              |
| Pull down           | Home screen               | Refresh recommendations (15-min cooldown) |
| Swipe left          | Watchlist item             | Reveal remove action                      |
| Swipe up/down       | Bottom sheet              | Dismiss sheet                             |
| Touch-drag          | Portfolio chart            | Scrub timeline, update hero number        |
| Touch-drag          | Risk slider               | Adjust position size                      |
| Long press          | Trade detail field         | Copy to clipboard (fallback)              |

## Animations & Transitions

| Interaction              | Duration | Easing           | Notes                                        |
|--------------------------|----------|------------------|----------------------------------------------|
| Screen transition        | 300ms    | ease-in-out      | Between tab screens                          |
| Card expand/collapse     | 250ms    | ease-out         | Height animation with content reveal         |
| Tab switch               | 200ms    | ease-in-out      | Content fade transition                      |
| Stepper step transition  | 300ms    | ease-in-out      | Wizard step expand/collapse                  |
| Toast appear             | 200ms    | ease-out         | Slide in from top                            |
| Toast dismiss            | 150ms    | ease-in          | Slide out or swipe dismiss                   |
| Chart scrub              | 0ms      | linear           | Immediate response to touch                  |
| Pull-to-refresh          | 300ms    | spring           | Elastic bounce effect                        |
| Shimmer animation        | 1500ms   | linear, infinite | Loading skeleton gradient sweep              |
| AI Score count-up        | 600ms    | ease-out         | Number counts from 0 to score on first render|
| AI Score pulse (new rec) | 400ms    | ease-in-out      | Brief scale pulse on new recommendations     |
| Bottom sheet open        | 300ms    | ease-out         | Slide up from bottom                         |
| Bottom sheet close       | 200ms    | ease-in          | Slide down to bottom                         |

## Haptic Feedback

| Interaction          | Haptic Type          | Notes                                    |
|----------------------|----------------------|------------------------------------------|
| Tab switch           | Light impact         | Subtle feedback on navigation            |
| AI Score pulse       | Light impact         | When new recommendation appears          |
| Copy to clipboard    | Success notification | Confirms successful copy                 |
| Trade confirmation   | Medium impact        | "I placed the trade" confirmation        |

### Implementation Notes

- Use `Navigator.vibrate()` API where available
- No-op gracefully on unsupported devices
- Three helper functions: `lightImpact()`, `successNotification()`, `mediumImpact()`
- Feature-detect before calling

## Keyboard Shortcuts (Desktop)

| Key   | Action                       |
|-------|------------------------------|
| R     | Refresh recommendations      |
| 1     | Switch to Home tab           |
| 2     | Switch to Trade tab          |
| 3     | Switch to Portfolio tab      |
| 4     | Switch to Settings tab       |
| Esc   | Close modal/bottom sheet/L3  |

- Only active when no input field is focused
- No modifier keys required
