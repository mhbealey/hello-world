# Interaction Specifications

## Touch Targets

- Minimum 44px height for all tappable elements
- Cards: full card is tap target for expand/collapse
- Buttons: minimum 44px height, 16px horizontal padding
- Nav tabs: equal width, full height of nav bar
- Checkboxes (action steps): 44px tap target area including padding

## Gestures

- Pull-to-refresh on Home, Risk, Actions, Funds screens
- Swipe down to dismiss BottomSheet
- Scroll momentum (iOS rubber-banding)
- No horizontal swipe gestures (conflicts with system back)

## Haptic Feedback (iOS)

| Action | Feedback |
|--------|----------|
| Action resolved | UIImpactFeedbackGenerator.medium |
| Step checked | UIImpactFeedbackGenerator.light |
| Error | UINotificationFeedbackGenerator.error |
| Undo | UIImpactFeedbackGenerator.light |

## Scroll Behavior

- TopBar: sticky, visible during scroll
- BottomNav: sticky, always visible
- Scroll position: preserved per tab, reset on fresh navigation
- Back navigation: restore previous scroll position
- Pull-to-refresh: custom indicator matching brand

## Keyboard

- Chat input: keyboard push-up, input stays above keyboard
- Search fields: auto-focus on open
- Form fields: "Next" button cycles fields, "Done" dismisses
- Scroll up when keyboard appears to keep active field visible

## Card Expansion

- Accordion mode: opening one card closes others within the same section
- Exception: KPI tiles on Home can be open simultaneously
- Expand animation: 450ms cubic-bezier(.16,1,.3,1)
- Content fade: 300ms ease with 60ms delay

## Transitions

| Transition | Duration | Easing |
|------------|----------|--------|
| Tab switching | 120ms | crossfade |
| Drill-in navigation (Risk → Actions) | 200ms | slide-left |
| Back navigation | 200ms | slide-right |
| BottomSheet | 300ms | slide-up with spring |
| Toast | 300ms | slide-up, slide-down on dismiss |
| Screen load | staggered fade | each card 50ms delay |

## Text Truncation

| Element | Rule |
|---------|------|
| Risk names | max 2 lines, ellipsis |
| Action titles | max 2 lines, ellipsis |
| Fund names | single line, ellipsis |
| Labels | never truncate (design must accommodate) |
| Dollar amounts | never truncate |
