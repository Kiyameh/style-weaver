import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Creates a new color group in the theme
 * @param theme - Current theme
 * @param groupName - Name of the new color group
 * @param isBrandColor - Whether the group is a brand color (true) or main color (false)
 * @returns Updated theme with new color group, or original theme if operation fails
 */
export function createColorGroup(
  theme: Theme,
  groupName: string,
  isBrandColor = false,
): Theme {
  if (isBrandColor) {
    // Add new brand color group
    if (groupName in theme.brandColors) return theme; // Group already exists

    // Create a default color group with content and 100 colors
    const defaultColors = {
      content: new Color("oklch", [0.2, 0.02, 260]),
      100: new Color("oklch", [0.8, 0.15, 260]),
    };

    return {
      ...theme,
      brandColors: {
        ...theme.brandColors,
        [groupName]: defaultColors,
      },
    };
  } else {
    // Main color groups cannot be added (surface, content, border are fixed)
    console.warn(
      `Cannot add main color group '${groupName}'. Main color groups are fixed.`,
    );
    return theme;
  }
}
