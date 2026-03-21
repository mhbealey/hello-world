/** Trigger haptic feedback on supported iOS/Android devices */
export function haptic(style: "light" | "medium" | "error" = "medium") {
  if (typeof window === "undefined") return;

  // Use Vibration API as a cross-platform fallback
  if ("vibrate" in navigator) {
    switch (style) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "error":
        navigator.vibrate([20, 50, 20]);
        break;
    }
  }
}
