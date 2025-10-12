import type { SavedTheme } from "../types";

/**
 * Filters themes based on search query and selected projects
 */
export function filterThemes(
  themes: SavedTheme[],
  searchQuery: string,
  selectedProjects: string[],
): SavedTheme[] {
  let filtered = themes;

  // Filter by selected projects
  if (selectedProjects.length > 0) {
    filtered = filtered.filter((theme) =>
      selectedProjects.includes(theme.project || ""),
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (theme) =>
        theme.theme.name.toLowerCase().includes(query) ||
        theme.theme.description.toLowerCase().includes(query) ||
        theme.project?.toLowerCase().includes(query),
    );
  }

  return filtered;
}

/**
 * Sorts themes by saved date (newest first)
 */
export function sortThemesByDate(themes: SavedTheme[]): SavedTheme[] {
  return [...themes].sort((a, b) => b.savedAt - a.savedAt);
}
