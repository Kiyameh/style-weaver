import type { Theme } from "@/types/Theme";

/**
 * Renames a brand color group in the theme while preserving the order
 * @param theme - Current theme
 * @param oldName - Current name of the color group
 * @param newName - New name for the color group
 * @returns Updated theme with renamed color group, or original theme if operation fails
 */
export function renameColorGroup(
  theme: Theme,
  oldName: string,
  newName: string,
): Theme {
  // Only brand colors can be renamed (main colors are fixed: surface, content, border)
  if (!(oldName in theme.brandColors)) return theme;
  if (newName in theme.brandColors) return theme; // Avoid duplicates

  // Preserve order by iterating through entries and renaming in place
  const newBrandColors: Record<string, (typeof theme.brandColors)[string]> = {};

  for (const [key, value] of Object.entries(theme.brandColors)) {
    if (key === oldName) {
      newBrandColors[newName] = value;
    } else {
      newBrandColors[key] = value;
    }
  }

  return {
    ...theme,
    brandColors: newBrandColors,
  };
}
