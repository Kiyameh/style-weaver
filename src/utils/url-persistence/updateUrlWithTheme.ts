import type { Theme } from "@/types/Theme";
import { serializeTheme } from "./serializeTheme";

/**
 * Updates the browser URL with the theme data
 * @param theme - Theme to update in URL
 */
export function updateUrlWithTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const serializedTheme = serializeTheme(theme);
  const url = new URL(window.location.href);

  if (serializedTheme) {
    url.searchParams.set("theme", serializedTheme);
  } else {
    url.searchParams.delete("theme");
  }

  window.history.replaceState({}, "", url.toString());
}
