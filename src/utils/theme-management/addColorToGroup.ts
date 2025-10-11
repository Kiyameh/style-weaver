import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Adds a new color with consecutive numeric key to a color group
 * @param theme - Current theme
 * @param groupName - Name of the color group
 * @param isBrandColor - Whether the group is a brand color (true) or main color (false)
 * @param lightnessIncrement - Amount to increment lightness from previous color (default: 0.2)
 * @returns Updated theme with new color added, or original theme if operation fails
 */
export function addColorToGroup(
  theme: Theme,
  groupName: string,
  isBrandColor = false,
  lightnessIncrement = 0.2,
): Theme {
  const colorGroups = isBrandColor ? theme.brandColors : theme.mainColors;
  const colorGroup = colorGroups[groupName as keyof typeof colorGroups];

  if (!colorGroup) return theme;

  // Get existing numeric keys and find the next consecutive number
  const numericKeys = Object.keys(colorGroup)
    .filter((key) => !Number.isNaN(Number(key)))
    .map(Number)
    .sort((a, b) => a - b);

  // Find next consecutive number (100, 200, 300, 400, 500, 600, etc.)
  let nextKey = 100;
  if (numericKeys.length > 0) {
    nextKey = Math.max(...numericKeys) + 100;
  }

  // Get the last color to base the new color on
  let defaultColor: Color;
  if (numericKeys.length > 0) {
    const lastKey = Math.max(...numericKeys);
    const lastColor = colorGroup[lastKey] as Color;

    // Get OKLCH values from the last color
    const [l, c, h] = lastColor.oklch;
    const alpha = lastColor.alpha;

    // Increment lightness, clamping between 0 and 1
    const newLightness = Math.min(1, Math.max(0, l - lightnessIncrement));

    // Create new color with incremented lightness
    defaultColor = new Color("oklch", [newLightness, c, h || 0]);
    defaultColor.alpha = alpha;
  } else {
    // If no previous colors, create a default color (neutral gray)
    defaultColor = new Color("oklch", [0.5, 0.02, 260]);
  }

  if (isBrandColor) {
    return {
      ...theme,
      brandColors: {
        ...theme.brandColors,
        [groupName]: {
          ...theme.brandColors[groupName],
          [nextKey]: defaultColor,
        },
      },
    };
  } else {
    return {
      ...theme,
      mainColors: {
        ...theme.mainColors,
        [groupName as keyof Theme["mainColors"]]: {
          ...theme.mainColors[groupName as keyof Theme["mainColors"]],
          [nextKey]: defaultColor,
        },
      },
    };
  }
}
