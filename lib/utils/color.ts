/** Design token colors for programmatic access */
export const colors = {
  accent: "#E87425",
  success: { light: "#15803D", dark: "#22C55E" },
  warning: { light: "#B45309", dark: "#F59E0B" },
  danger: { light: "#B91C1C", dark: "#EF4444" },
  text: { light: "#0F0F0F", dark: "#E8E5E0" },
  textSecondary: { light: "#3D3D3D", dark: "#9B9790" },
  textTertiary: { light: "#7A7A74", dark: "#5E5C57" },
  surface: { light: "#FFFFFF", dark: "#1A1A19" },
  bg: { light: "#F5F4F1", dark: "#0A0A0A" },
} as const;

/** Get urgency badge color values */
export function urgencyBgColor(
  urgency: "critical" | "high" | "medium" | "low"
): string {
  switch (urgency) {
    case "critical":
      return colors.danger.light;
    case "high":
      return colors.warning.light;
    case "medium":
      return colors.accent;
    case "low":
      return colors.success.light;
  }
}
