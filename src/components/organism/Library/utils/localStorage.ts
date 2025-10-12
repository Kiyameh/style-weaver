import type { Theme } from "@/types/Theme";
import { deserializeTheme } from "@/utils/url-persistence/deserializeTheme";
import { serializeTheme } from "@/utils/url-persistence/serializeTheme";
import type { SavedTheme } from "../types";

const STORAGE_KEY = "styleweaver_library";
const PROJECTS_KEY = "styleweaver_projects";

/**
 * Serializes a SavedTheme for storage
 */
function serializeSavedTheme(savedTheme: SavedTheme): string {
  return JSON.stringify({
    id: savedTheme.id,
    theme: serializeTheme(savedTheme.theme),
    project: savedTheme.project,
    savedAt: savedTheme.savedAt,
  });
}

/**
 * Deserializes a SavedTheme from storage
 */
function deserializeSavedTheme(data: string): SavedTheme | null {
  try {
    const parsed = JSON.parse(data);
    const theme = deserializeTheme(parsed.theme);

    if (!theme) return null;

    return {
      id: parsed.id,
      theme,
      project: parsed.project,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Gets all saved themes from localStorage
 */
export function getSavedThemes(): SavedTheme[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: string) => deserializeSavedTheme(item))
      .filter((theme): theme is SavedTheme => theme !== null);
  } catch {
    return [];
  }
}

/**
 * Saves a theme to localStorage
 */
export function saveTheme(theme: Theme, project?: string): SavedTheme | null {
  if (typeof window === "undefined") return null;

  try {
    const savedTheme: SavedTheme = {
      id: generateId(),
      theme,
      project,
      savedAt: Date.now(),
    };

    const themes = getSavedThemes();
    themes.push(savedTheme);

    const serialized = themes.map((t) => serializeSavedTheme(t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));

    return savedTheme;
  } catch {
    return null;
  }
}

/**
 * Deletes a theme from localStorage
 */
export function deleteTheme(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const themes = getSavedThemes();
    const filtered = themes.filter((t) => t.id !== id);

    const serialized = filtered.map((t) => serializeSavedTheme(t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all available projects
 */
export function getProjects(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Adds a new project
 */
export function addProject(projectName: string): boolean {
  if (typeof window === "undefined") return false;
  if (!projectName.trim()) return false;

  try {
    const projects = getProjects();
    if (projects.includes(projectName)) return false;

    projects.push(projectName);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

    return true;
  } catch {
    return false;
  }
}

/**
 * Deletes a project and removes it from all themes
 */
export function deleteProject(projectName: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    // Remove from projects list
    const projects = getProjects();
    const filtered = projects.filter((p) => p !== projectName);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));

    // Remove project assignment from themes
    const themes = getSavedThemes();
    const updated = themes.map((t) => ({
      ...t,
      project: t.project === projectName ? undefined : t.project,
    }));

    const serialized = updated.map((t) => serializeSavedTheme(t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));

    return true;
  } catch {
    return false;
  }
}

/**
 * Updates the project assignment for a theme
 */
export function updateThemeProject(themeId: string, project?: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const themes = getSavedThemes();
    const themeIndex = themes.findIndex((t) => t.id === themeId);

    if (themeIndex === -1) return false;

    themes[themeIndex] = {
      ...themes[themeIndex],
      project,
    };

    const serialized = themes.map((t) => serializeSavedTheme(t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));

    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a unique ID for a saved theme
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
