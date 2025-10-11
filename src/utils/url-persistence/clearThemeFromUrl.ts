/**
 * Removes the theme parameter from the browser URL
 */
export function clearThemeFromUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("theme");
  window.history.replaceState({}, "", url.toString());
}
