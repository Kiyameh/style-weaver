import type { Theme } from "@/types/Theme";
import type { ThemeStats } from "../types";

/**
 * Calculates statistics for a theme
 */
export function calculateThemeStats(theme: Theme): ThemeStats {
  // Count main colors (surface, content, border variants)
  const mainColorsCount =
    Object.keys(theme.mainColors.surface).length +
    Object.keys(theme.mainColors.content).length +
    Object.keys(theme.mainColors.border).length;

  // Count brand colors (all variants across all brands)
  const brandColorsCount = Object.values(theme.brandColors).reduce(
    (total, colorGroup) => total + Object.keys(colorGroup).length,
    0,
  );

  // Count shadow variants
  const shadowsCount = Object.keys(theme.shadows).length;

  // Count radius variants
  const radiusCount = Object.keys(theme.radius).length;

  return {
    mainColorsCount,
    brandColorsCount,
    shadowsCount,
    radiusCount,
  };
}
