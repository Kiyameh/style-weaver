import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * @version 1
 * @description Serializes a Theme object to a URL-safe string
 * @param theme to serialize
 */
export function serializeThemeToUrl(theme: Theme): string {
  try {
    // Convert Color objects to serializable format
    const serializedTheme = {
      ...theme,
      colors: Object.fromEntries(
        Object.entries(theme.colors).map(([key, colorStack]) => [
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

/**
 * @version 1
 * @description Deserializes a URL string back to a Theme object
 * @param urlParam URL string to deserialize
 */
export function deserializeThemeFromUrl(urlParam: string): Theme | null {
  try {
    const jsonString = decodeURIComponent(urlParam);
    const parsed = JSON.parse(jsonString);

    // Reconstruct Color objects
    const reconstructedTheme: Theme = {
      ...parsed,
      colors: Object.fromEntries(
        Object.entries(
          parsed.colors as Record<
            string,
            Record<string, { space: string; coords: number[]; alpha: number }>
          >,
        ).map(([key, colorStack]) => [
          key,
          Object.fromEntries(
            Object.entries(colorStack).map(([subKey, colorData]) => [
              subKey,
              new Color(
                colorData.space,
                colorData.coords as [number, number, number],
                colorData.alpha,
              ),
            ]),
          ),
        ]),
      ),
    };

    return reconstructedTheme;
  } catch (error) {
    console.error("Error deserializing theme from URL:", error);
    return null;
  }
}

/**
 * @version 1
 * @description Updates the URL with the theme data
 * @param theme to update
 */
export function updateUrlWithTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const serializedTheme = serializeThemeToUrl(theme);
  const url = new URL(window.location.href);

  if (serializedTheme) {
    url.searchParams.set("theme", serializedTheme);
  } else {
    url.searchParams.delete("theme");
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * @version 1
 * @description Gets the theme from the current URL
 */
export function getThemeFromUrl(): Theme | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const themeParam = url.searchParams.get("theme");

  if (!themeParam) return null;

  return deserializeThemeFromUrl(themeParam);
}

/**
 * @version 1
 * @description Removes the theme from the URL
 */
export function clearThemeFromUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("theme");
  window.history.replaceState({}, "", url.toString());
}
