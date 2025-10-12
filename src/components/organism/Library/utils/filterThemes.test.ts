import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import type { SavedTheme } from "../types";
import { filterThemes, sortThemesByDate } from "./filterThemes";

const createMockTheme = (name: string): Theme => ({
  name,
  description: `Description for ${name}`,
  colorMode: "light",
  mainColors: {
    surface: { 100: new Color("oklch", [1, 0, 0]) },
    content: { 100: new Color("oklch", [0, 0, 0]) },
    border: { 100: new Color("oklch", [0.5, 0, 0]) },
  },
  brandColors: {
    primary: { 100: new Color("oklch", [0.5, 0.1, 260]) },
  },
  radius: { s: "0.25rem" },
  shadows: { s: "0 0 0.5rem black" },
});

const createSavedTheme = (
  name: string,
  project?: string,
  savedAt = Date.now(),
): SavedTheme => ({
  id: `id-${name}`,
  theme: createMockTheme(name),
  project,
  savedAt,
});

describe("filterThemes", () => {
  describe("filterThemes", () => {
    it("returns all themes when no filters applied", () => {
      const themes = [createSavedTheme("Theme 1"), createSavedTheme("Theme 2")];

      const filtered = filterThemes(themes, "", []);

      expect(filtered).toHaveLength(2);
    });

    it("filters by search query in name", () => {
      const themes = [
        createSavedTheme("Dark Theme"),
        createSavedTheme("Light Theme"),
        createSavedTheme("Colorful Theme"),
      ];

      const filtered = filterThemes(themes, "dark", []);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].theme.name).toBe("Dark Theme");
    });

    it("filters by search query in description", () => {
      const themes = [createSavedTheme("Theme 1"), createSavedTheme("Theme 2")];

      const filtered = filterThemes(themes, "Theme 1", []);

      expect(filtered.length).toBeGreaterThan(0);
    });

    it("filters by search query in project", () => {
      const themes = [
        createSavedTheme("Theme 1", "Website"),
        createSavedTheme("Theme 2", "Mobile App"),
      ];

      const filtered = filterThemes(themes, "website", []);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].project).toBe("Website");
    });

    it("search is case insensitive", () => {
      const themes = [createSavedTheme("Dark Theme")];

      const filtered = filterThemes(themes, "DARK", []);

      expect(filtered).toHaveLength(1);
    });

    it("filters by project", () => {
      const themes = [
        createSavedTheme("Theme 1", "Project A"),
        createSavedTheme("Theme 2", "Project B"),
        createSavedTheme("Theme 3", "Project A"),
      ];

      const filtered = filterThemes(themes, "", ["Project A"]);

      expect(filtered).toHaveLength(2);
      expect(filtered.every((t) => t.project === "Project A")).toBe(true);
    });

    it("filters themes without project when empty string selected", () => {
      const themes = [
        createSavedTheme("Theme 1", "Project A"),
        createSavedTheme("Theme 2"),
        createSavedTheme("Theme 3"),
      ];

      const filtered = filterThemes(themes, "", [""]);

      expect(filtered).toHaveLength(2);
      expect(filtered.every((t) => !t.project)).toBe(true);
    });

    it("combines search and project filters", () => {
      const themes = [
        createSavedTheme("Dark Theme", "Project A"),
        createSavedTheme("Light Theme", "Project A"),
        createSavedTheme("Dark Theme", "Project B"),
      ];

      const filtered = filterThemes(themes, "dark", ["Project A"]);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].theme.name).toBe("Dark Theme");
      expect(filtered[0].project).toBe("Project A");
    });

    it("returns empty array when no matches", () => {
      const themes = [createSavedTheme("Theme 1")];

      const filtered = filterThemes(themes, "nonexistent", []);

      expect(filtered).toHaveLength(0);
    });

    it("handles empty themes array", () => {
      const filtered = filterThemes([], "query", []);

      expect(filtered).toHaveLength(0);
    });

    it("trims whitespace from search query", () => {
      const themes = [createSavedTheme("Dark Theme")];

      const filtered = filterThemes(themes, "  dark  ", []);

      expect(filtered).toHaveLength(1);
    });
  });

  describe("sortThemesByDate", () => {
    it("sorts themes by date (newest first)", () => {
      const themes = [
        createSavedTheme("Old", undefined, 1000),
        createSavedTheme("New", undefined, 3000),
        createSavedTheme("Middle", undefined, 2000),
      ];

      const sorted = sortThemesByDate(themes);

      expect(sorted[0].theme.name).toBe("New");
      expect(sorted[1].theme.name).toBe("Middle");
      expect(sorted[2].theme.name).toBe("Old");
    });

    it("does not mutate original array", () => {
      const themes = [
        createSavedTheme("A", undefined, 1000),
        createSavedTheme("B", undefined, 2000),
      ];

      const original = [...themes];
      sortThemesByDate(themes);

      expect(themes).toEqual(original);
    });

    it("handles empty array", () => {
      const sorted = sortThemesByDate([]);

      expect(sorted).toHaveLength(0);
    });

    it("handles single theme", () => {
      const themes = [createSavedTheme("Theme")];

      const sorted = sortThemesByDate(themes);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].theme.name).toBe("Theme");
    });

    it("handles themes with same timestamp", () => {
      const timestamp = Date.now();
      const themes = [
        createSavedTheme("A", undefined, timestamp),
        createSavedTheme("B", undefined, timestamp),
      ];

      const sorted = sortThemesByDate(themes);

      expect(sorted).toHaveLength(2);
    });
  });
});
