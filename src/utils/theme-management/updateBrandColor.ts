import type Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Updates a specific color in a brand color group
 * @param theme - Current theme
 * @param colorGroup - Name of the brand color group
 * @param colorKey - Key of the color to update (string or number)
 * @param newColor - New color value
 * @returns Updated theme with new color, or original theme if operation fails
 */
export function updateBrandColor(
  theme: Theme,
  colorGroup: string,
  colorKey: string | number,
  newColor: Color,
): Theme {
  if (!theme.brandColors[colorGroup]) return theme;

  return {
    ...theme,
    brandColors: {
      ...theme.brandColors,
      [colorGroup]: {
        ...theme.brandColors[colorGroup],
        [colorKey]: newColor,
      },
    },
  };
}
