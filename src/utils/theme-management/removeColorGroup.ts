import type { Theme } from "@/types/Theme";

/**
 * Removes an entire color group from the theme
 * @param theme - Current theme
 * @param groupName - Name of the color group to remove
 * @param isBrandColor - Whether the group is a brand color (true) or main color (false)
 * @returns Updated theme with color group removed, or original theme if operation fails
 */
export function removeColorGroup(
  theme: Theme,
  groupName: string,
  isBrandColor = false,
): Theme {
  if (isBrandColor) {
    // Remove brand color group
    if (!(groupName in theme.brandColors)) return theme;
    
    const { [groupName]: _, ...restBrandColors } = theme.brandColors;
    
    return {
      ...theme,
      brandColors: restBrandColors,
    };
  } else {
    // Main color groups cannot be removed (surface, content, border are required)
    console.warn(`Cannot remove main color group '${groupName}'. Main color groups are required.`);
    return theme;
  }
}
