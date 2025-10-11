import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Adds a content color to a brand color group
 * @param theme - Current theme
 * @param groupName - Name of the brand color group
 * @returns Updated theme with content color added, or original theme if operation fails
 */
export function addContentColor(theme: Theme, groupName: string): Theme {
  // Content colors only exist in brand colors
  if (!(groupName in theme.brandColors)) return theme;
  if ("content" in theme.brandColors[groupName]) return theme; // Already has content color

  // Create a default content color (high contrast for readability)
  const defaultContentColor = new Color("oklch", [0.2, 0.02, 260]);

  return {
    ...theme,
    brandColors: {
      ...theme.brandColors,
      [groupName]: {
        ...theme.brandColors[groupName],
        content: defaultContentColor,
      },
    },
  };
}
