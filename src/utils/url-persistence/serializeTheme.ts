import type { Theme } from "@/types/Theme";

/**
 * Serializes a Theme object to a URL-safe string
 * @param theme - Theme to serialize
 * @returns URL-safe string representation of the theme
 */
export function serializeTheme(theme: Theme): string {
  try {
    // Convert Color objects to serializable format
    const serializedTheme = {
      ...theme,
      mainColors: {
        surface: Object.fromEntries(
          Object.entries(theme.mainColors.surface).map(([subKey, color]) => [
            subKey,
            {
              space: color.space.id,
              coords: color.coords,
              alpha: color.alpha,
            },
          ]),
        ),
        content: Object.fromEntries(
          Object.entries(theme.mainColors.content).map(([subKey, color]) => [
            subKey,
            {
              space: color.space.id,
              coords: color.coords,
              alpha: color.alpha,
            },
          ]),
        ),
        border: Object.fromEntries(
          Object.entries(theme.mainColors.border).map(([subKey, color]) => [
            subKey,
            {
              space: color.space.id,
              coords: color.coords,
              alpha: color.alpha,
            },
          ]),
        ),
      },
      brandColors: Object.fromEntries(
        Object.entries(theme.brandColors).map(([key, colorStack]) => [
          key,
          Object.fromEntries(
            Object.entries(colorStack).map(([subKey, color]) => [
              subKey,
              {
                space: color.space.id,
                coords: color.coords,
                alpha: color.alpha,
              },
            ]),
          ),
        ]),
      ),
    };

    const jsonString = JSON.stringify(serializedTheme);
    return encodeURIComponent(jsonString);
  } catch (error) {
    console.error("Error serializing theme to URL:", error);
    return "";
  }
}
