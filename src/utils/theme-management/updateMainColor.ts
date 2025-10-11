import type Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Updates a specific color in a main color group
 * @param theme - Current theme
 * @param colorGroup - Name of the main color group (surface, content, border)
 * @param colorKey - Key of the color to update (string or number)
 * @param newColor - New color value
 * @returns Updated theme with new color, or original theme if operation fails
 */
export function updateMainColor(
  theme: Theme,
  colorGroup: keyof Theme["mainColors"],
  colorKey: string | number,
  newColor: Color,
): Theme {
  if (!theme.mainColors[colorGroup]) return theme;
  
  return {
    ...theme,
    mainColors: {
      ...theme.mainColors,
      [colorGroup]: {
        ...theme.mainColors[colorGroup],
        [colorKey]: newColor,
      },
    },
  };
}
