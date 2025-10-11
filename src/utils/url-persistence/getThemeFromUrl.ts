import type { Theme } from "@/types/Theme";
import { deserializeTheme } from "./deserializeTheme";

/**
 * Gets the theme from the current browser URL
 * @returns Theme object from URL or null if not found or invalid
 */
export function getThemeFromUrl(): Theme | null {
  if (typeof window === "undefined") return null;

  try {
    const url = new URL(window.location.href);
    const themeParam = url.searchParams.get("theme");

    if (!themeParam) return null;

    return deserializeTheme(themeParam);
  } catch {
    // Handle malformed URLs gracefully
    console.warn("Invalid URL in window.location.href:", window.location.href);
    return null;
  }
}
