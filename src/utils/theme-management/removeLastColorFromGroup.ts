import type { Theme } from "@/types/Theme";

/**
 * Removes the color with the highest numeric key from a color group
 * @param theme - Current theme
 * @param groupName - Name of the color group
 * @param isBrandColor - Whether the group is a brand color (true) or main color (false)
 * @returns Updated theme with last color removed, or original theme if operation fails
 */
export function removeLastColorFromGroup(
  theme: Theme,
  groupName: string,
  isBrandColor = false,
): Theme {
  const colorGroups = isBrandColor ? theme.brandColors : theme.mainColors;
  const colorGroup = colorGroups[groupName as keyof typeof colorGroups];

  if (!colorGroup) return theme;

  // Get numeric keys and find the highest one
  const numericKeys = Object.keys(colorGroup)
    .filter((key) => !Number.isNaN(Number(key)))
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  if (numericKeys.length === 0) return theme; // No numeric keys to remove

  const keyToRemove = numericKeys[0]; // Highest numeric key
  const { [keyToRemove]: _, ...restColors } = colorGroup;

  if (isBrandColor) {
    return {
      ...theme,
      brandColors: {
        ...theme.brandColors,
        [groupName]: restColors,
      },
    };
  } else {
    return {
      ...theme,
      mainColors: {
        ...theme.mainColors,
        [groupName as keyof Theme["mainColors"]]: restColors,
      },
    };
  }
}
