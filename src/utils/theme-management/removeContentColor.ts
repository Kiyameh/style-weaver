import type { Theme } from "@/types/Theme";

/**
 * Removes the content color from a brand color group
 * @param theme - Current theme
 * @param groupName - Name of the brand color group
 * @returns Updated theme with content color removed, or original theme if operation fails
 */
export function removeContentColor(theme: Theme, groupName: string): Theme {
  // Content colors only exist in brand colors
  if (!(groupName in theme.brandColors)) return theme;
  if (!("content" in theme.brandColors[groupName])) return theme; // No content color to remove

  const { content: _, ...restColors } = theme.brandColors[groupName];

  return {
    ...theme,
    brandColors: {
      ...theme.brandColors,
      [groupName]: restColors,
    },
  };
}
