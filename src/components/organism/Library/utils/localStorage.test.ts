import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import {
  addProject,
  deleteProject,
  deleteTheme,
  getProjects,
  getSavedThemes,
  saveTheme,
  updateThemeProject,
} from "./localStorage";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "Test Description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
    },
    content: {
      100: new Color("oklch", [0.2, 0, 0]),
    },
    border: {
      100: new Color("oklch", [0.5, 0, 0]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.2, 0.1, 260]),
      100: new Color("oklch", [0.8, 0.1, 260]),
    },
  },
  radius: {
    s: "0.25rem",
  },
  shadows: {
    s: "0 0 0.5rem oklch(0 0 0 / 0.1)",
  },
};

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getSavedThemes", () => {
    it("returns empty array when no themes saved", () => {
      const themes = getSavedThemes();
      expect(themes).toEqual([]);
    });

    it("returns saved themes", () => {
      saveTheme(mockTheme);
      const themes = getSavedThemes();

      expect(themes).toHaveLength(1);
      expect(themes[0].theme.name).toBe(mockTheme.name);
    });

    it("returns empty array when localStorage data is invalid", () => {
      localStorage.setItem("styleweaver_library", "invalid json");
      const themes = getSavedThemes();
      expect(themes).toEqual([]);
    });

    it("filters out invalid theme entries", () => {
      localStorage.setItem(
        "styleweaver_library",
        JSON.stringify(["invalid", "also invalid"]),
      );
      const themes = getSavedThemes();
      expect(themes).toEqual([]);
    });
  });

  describe("saveTheme", () => {
    it("saves a theme without project", () => {
      const saved = saveTheme(mockTheme);

      expect(saved).not.toBeNull();
      expect(saved?.theme.name).toBe(mockTheme.name);
      expect(saved?.project).toBeUndefined();
      expect(saved?.id).toBeDefined();
      expect(saved?.savedAt).toBeDefined();
    });

    it("saves a theme with project", () => {
      const saved = saveTheme(mockTheme, "My Project");

      expect(saved).not.toBeNull();
      expect(saved?.project).toBe("My Project");
    });

    it("generates unique IDs for each theme", () => {
      const saved1 = saveTheme(mockTheme);
      const saved2 = saveTheme(mockTheme);

      expect(saved1?.id).not.toBe(saved2?.id);
    });

    it("persists themes to localStorage", () => {
      saveTheme(mockTheme);
      const data = localStorage.getItem("styleweaver_library");

      expect(data).not.toBeNull();
      expect(JSON.parse(data as string)).toHaveLength(1);
    });

    it("appends to existing themes", () => {
      saveTheme(mockTheme);
      saveTheme({ ...mockTheme, name: "Theme 2" });

      const themes = getSavedThemes();
      expect(themes).toHaveLength(2);
    });
  });

  describe("deleteTheme", () => {
    it("deletes a theme by id", () => {
      const saved = saveTheme(mockTheme);
      // biome-ignore lint/style/noNonNullAssertion: <testing>
      const result = deleteTheme(saved!.id);

      expect(result).toBe(true);
      expect(getSavedThemes()).toHaveLength(0);
    });

    it("returns true even if theme not found", () => {
      const result = deleteTheme("non-existent-id");
      expect(result).toBe(true);
    });

    it("preserves other themes when deleting", () => {
      const saved1 = saveTheme(mockTheme);
      const saved2 = saveTheme({ ...mockTheme, name: "Theme 2" });

      // biome-ignore lint/style/noNonNullAssertion: <testing>
      deleteTheme(saved1!.id);

      const themes = getSavedThemes();
      expect(themes).toHaveLength(1);
      expect(themes[0].id).toBe(saved2?.id);
    });
  });

  describe("getProjects", () => {
    it("returns empty array when no projects", () => {
      const projects = getProjects();
      expect(projects).toEqual([]);
    });

    it("returns saved projects", () => {
      addProject("Project 1");
      addProject("Project 2");

      const projects = getProjects();
      expect(projects).toEqual(["Project 1", "Project 2"]);
    });

    it("returns empty array when localStorage data is invalid", () => {
      localStorage.setItem("styleweaver_projects", "invalid json");
      const projects = getProjects();
      expect(projects).toEqual([]);
    });
  });

  describe("addProject", () => {
    it("adds a new project", () => {
      const result = addProject("New Project");

      expect(result).toBe(true);
      expect(getProjects()).toContain("New Project");
    });

    it("does not add duplicate projects", () => {
      addProject("Project");
      const result = addProject("Project");

      expect(result).toBe(false);
      expect(getProjects()).toHaveLength(1);
    });

    it("does not add empty project names", () => {
      const result = addProject("   ");
      expect(result).toBe(false);
      expect(getProjects()).toHaveLength(0);
    });

    it("trims project names", () => {
      addProject("  Project  ");
      const projects = getProjects();
      expect(projects).toContain("  Project  ");
    });
  });

  describe("deleteProject", () => {
    it("deletes a project", () => {
      addProject("Project");
      const result = deleteProject("Project");

      expect(result).toBe(true);
      expect(getProjects()).not.toContain("Project");
    });

    it("removes project from themes", () => {
      addProject("Project");
      saveTheme(mockTheme, "Project");

      deleteProject("Project");

      const themes = getSavedThemes();
      expect(themes[0].project).toBeUndefined();
    });

    it("does not affect themes with different projects", () => {
      addProject("Project 1");
      addProject("Project 2");
      saveTheme(mockTheme, "Project 1");
      saveTheme({ ...mockTheme, name: "Theme 2" }, "Project 2");

      deleteProject("Project 1");

      const themes = getSavedThemes();
      expect(themes.find((t) => t.theme.name === "Theme 2")?.project).toBe(
        "Project 2",
      );
    });
  });

  describe("updateThemeProject", () => {
    it("updates theme project", () => {
      const saved = saveTheme(mockTheme);
      // biome-ignore lint/style/noNonNullAssertion: <testing>
      const result = updateThemeProject(saved!.id, "New Project");

      expect(result).toBe(true);
      const themes = getSavedThemes();
      expect(themes[0].project).toBe("New Project");
    });

    it("can remove project from theme", () => {
      const saved = saveTheme(mockTheme, "Project");
      // biome-ignore lint/style/noNonNullAssertion: <testing>
      updateThemeProject(saved!.id, undefined);

      const themes = getSavedThemes();
      expect(themes[0].project).toBeUndefined();
    });

    it("returns false for non-existent theme", () => {
      const result = updateThemeProject("non-existent", "Project");
      expect(result).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("handles server environment gracefully", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulating server environment
      global.window = undefined;

      expect(getSavedThemes()).toEqual([]);
      expect(saveTheme(mockTheme)).toBeNull();
      expect(deleteTheme("id")).toBe(false);
      expect(getProjects()).toEqual([]);
      expect(addProject("Project")).toBe(false);
      expect(deleteProject("Project")).toBe(false);
      expect(updateThemeProject("id", "Project")).toBe(false);

      global.window = originalWindow;
    });

    it("handles localStorage errors gracefully", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      expect(getSavedThemes()).toEqual([]);
      expect(getProjects()).toEqual([]);
    });
  });
});
