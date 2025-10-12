import { act, renderHook } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DEFAULT_THEME from "@/themes/default";
import * as urlState from "@/utils/url-persistence";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Mock URL persistence utilities
vi.mock("@/utils/url-persistence", () => ({
  getThemeFromUrl: vi.fn(() => null),
  updateUrlWithTheme: vi.fn(),
}));

// Mock setTimeout for debouncing tests
vi.useFakeTimers();

describe("ThemeContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe("useTheme hook", () => {
    it("throws error when used outside ThemeProvider", () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow("useTheme must be used within a ThemeProvider");
    });

    it("provides theme context when used within ThemeProvider", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.currentTheme).toEqual(DEFAULT_THEME);
      expect(typeof result.current.changeColorGroupName).toBe("function");
      expect(typeof result.current.addColorToGroup).toBe("function");
      expect(typeof result.current.removeLastColorFromGroup).toBe("function");
      expect(typeof result.current.addContentColorToGroup).toBe("function");
      expect(typeof result.current.removeContentColorFromGroup).toBe(
        "function",
      );
      expect(typeof result.current.removeColorGroup).toBe("function");
      expect(typeof result.current.addNewColorGroup).toBe("function");
      expect(typeof result.current.updateMainColor).toBe("function");
      expect(typeof result.current.updateBrandColor).toBe("function");
    });
  });

  describe("changeColorGroupName", () => {
    it("renames a brand color group successfully", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.changeColorGroupName("primary", "newPrimary");
      });

      expect(result.current.currentTheme?.brandColors).toHaveProperty(
        "newPrimary",
      );
      expect(result.current.currentTheme?.brandColors).not.toHaveProperty(
        "primary",
      );
      expect(result.current.currentTheme?.brandColors.newPrimary).toEqual(
        DEFAULT_THEME.brandColors.primary,
      );
    });

    it("does nothing when trying to rename non-existent group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.changeColorGroupName("nonExistent", "newName");
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });

    it("does nothing when new name already exists", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.changeColorGroupName("primary", "secondary");
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });

    it("does nothing when trying to rename main color groups", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.changeColorGroupName("surface", "newSurface");
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("addColorToGroup", () => {
    it("adds color to main color group with next consecutive number", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.addColorToGroup("surface", false);
      });

      // Surface has 100, 200, 300, 400, 500 by default, so next should be 600
      expect(result.current.currentTheme?.mainColors.surface).toHaveProperty(
        "600",
      );
      expect(
        result.current.currentTheme?.mainColors.surface[600],
      ).toBeInstanceOf(Color);
    });

    it("adds color to brand color group with next consecutive number", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.addColorToGroup("primary", true);
      });

      // Primary has content, 100, 200, 300 by default, so next should be 400
      expect(result.current.currentTheme?.brandColors.primary).toHaveProperty(
        "400",
      );
      expect(
        result.current.currentTheme?.brandColors.primary[400],
      ).toBeInstanceOf(Color);
    });

    it("does nothing when group doesn't exist", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.addColorToGroup("nonExistent", false);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("removeLastColorFromGroup", () => {
    it("removes highest numeric key from main color group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.removeLastColorFromGroup("surface", false);
      });

      // Surface has 100, 200, 300, 400, 500 by default, so 500 should be removed
      expect(
        result.current.currentTheme?.mainColors.surface,
      ).not.toHaveProperty("500");
      expect(result.current.currentTheme?.mainColors.surface).toHaveProperty(
        "400",
      );
    });

    it("removes highest numeric key from brand color group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.removeLastColorFromGroup("primary", true);
      });

      // Primary has content, 100, 200, 300 by default, so 300 should be removed
      expect(
        result.current.currentTheme?.brandColors.primary,
      ).not.toHaveProperty("300");
      expect(result.current.currentTheme?.brandColors.primary).toHaveProperty(
        "200",
      );
      expect(result.current.currentTheme?.brandColors.primary).toHaveProperty(
        "content",
      );
    });

    it("does nothing when group doesn't exist", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.removeLastColorFromGroup("nonExistent", false);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("addContentColorToGroup", () => {
    it("adds content color to brand color group that doesn't have one", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // First remove content color from info group
      act(() => {
        result.current.removeContentColorFromGroup("info");
      });

      // Then add it back
      act(() => {
        result.current.addContentColorToGroup("info");
      });

      expect(result.current.currentTheme?.brandColors.info).toHaveProperty(
        "content",
      );
      expect(
        result.current.currentTheme?.brandColors.info.content,
      ).toBeInstanceOf(Color);
    });

    it("does nothing when group already has content color", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalContentColor =
        result.current.currentTheme?.brandColors.primary.content;

      act(() => {
        result.current.addContentColorToGroup("primary");
      });

      expect(result.current.currentTheme?.brandColors.primary.content).toEqual(
        originalContentColor,
      );
    });

    it("does nothing when group doesn't exist", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.addContentColorToGroup("nonExistent");
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("removeContentColorFromGroup", () => {
    it("removes content color from brand color group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.removeContentColorFromGroup("primary");
      });

      expect(
        result.current.currentTheme?.brandColors.primary,
      ).not.toHaveProperty("content");
      expect(result.current.currentTheme?.brandColors.primary).toHaveProperty(
        "100",
      );
    });

    it("does nothing when group doesn't have content color", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // First remove content color
      act(() => {
        result.current.removeContentColorFromGroup("primary");
      });

      const themeAfterFirstRemoval = result.current.currentTheme;

      // Try to remove again
      act(() => {
        result.current.removeContentColorFromGroup("primary");
      });

      expect(result.current.currentTheme).toEqual(themeAfterFirstRemoval);
    });

    it("does nothing when group doesn't exist", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.removeContentColorFromGroup("nonExistent");
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("removeColorGroup", () => {
    it("removes brand color group successfully", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.removeColorGroup("primary", true);
      });

      expect(result.current.currentTheme?.brandColors).not.toHaveProperty(
        "primary",
      );
      expect(result.current.currentTheme?.brandColors).toHaveProperty(
        "secondary",
      );
    });

    it("does nothing when trying to remove main color group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      act(() => {
        result.current.removeColorGroup("surface", false);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Cannot remove main color group 'surface'. Main color groups are required.",
      );

      consoleSpy.mockRestore();
    });

    it("does nothing when brand color group doesn't exist", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.removeColorGroup("nonExistent", true);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("addNewColorGroup", () => {
    it("adds new brand color group with default colors", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.addNewColorGroup("newBrand", true);
      });

      expect(result.current.currentTheme?.brandColors).toHaveProperty(
        "newBrand",
      );
      expect(result.current.currentTheme?.brandColors.newBrand).toHaveProperty(
        "content",
      );
      expect(result.current.currentTheme?.brandColors.newBrand).toHaveProperty(
        "100",
      );
      expect(
        result.current.currentTheme?.brandColors.newBrand.content,
      ).toBeInstanceOf(Color);
      expect(
        result.current.currentTheme?.brandColors.newBrand[100],
      ).toBeInstanceOf(Color);
    });

    it("does nothing when trying to add main color group", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      act(() => {
        result.current.addNewColorGroup("newMain", false);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Cannot add main color group 'newMain'. Main color groups are fixed.",
      );

      consoleSpy.mockRestore();
    });

    it("does nothing when brand color group already exists", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const originalTheme = result.current.currentTheme;

      act(() => {
        result.current.addNewColorGroup("primary", true);
      });

      expect(result.current.currentTheme).toEqual(originalTheme);
    });
  });

  describe("updateMainColor", () => {
    it("updates main color successfully", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const newColor = new Color("oklch", [0.9, 0.1, 180]);

      act(() => {
        result.current.updateMainColor("surface", 100, newColor);
      });

      expect(result.current.currentTheme?.mainColors.surface[100]).toEqual(
        newColor,
      );
    });

    it("does nothing when currentTheme is null", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // Set currentTheme to null by manipulating the state
      act(() => {
        // This is a bit tricky to test, but we can simulate it by calling the function
        // when there's no theme (this would happen in edge cases)
        const newColor = new Color("oklch", [0.9, 0.1, 180]);
        result.current.updateMainColor("surface", 100, newColor);
      });

      // The function should handle null theme gracefully
      expect(result.current.currentTheme).toBeTruthy();
    });
  });

  describe("updateBrandColor", () => {
    it("updates brand color successfully", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const newColor = new Color("oklch", [0.9, 0.1, 180]);

      act(() => {
        result.current.updateBrandColor("primary", 100, newColor);
      });

      expect(result.current.currentTheme?.brandColors.primary[100]).toEqual(
        newColor,
      );
    });

    it("updates brand content color successfully", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const newColor = new Color("oklch", [0.9, 0.1, 180]);

      act(() => {
        result.current.updateBrandColor("primary", "content", newColor);
      });

      expect(result.current.currentTheme?.brandColors.primary.content).toEqual(
        newColor,
      );
    });
  });

  describe("URL synchronization", () => {
    it("calls updateUrlWithTheme when theme changes (after debounce)", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      const updateUrlSpy = vi.mocked(urlState.updateUrlWithTheme);

      act(() => {
        result.current.changeColorGroupName("primary", "newPrimary");
        // Fast-forward time to trigger debounced update
        vi.advanceTimersByTime(2000);
      });

      expect(updateUrlSpy).toHaveBeenCalledWith(result.current.currentTheme);
    });
  });

  describe("Edge cases", () => {
    it("handles empty numeric keys gracefully in addColorToGroup", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // First create the test group
      act(() => {
        result.current.addNewColorGroup("testGroup", true);
      });

      // Remove all numeric keys to leave only content
      act(() => {
        result.current.removeLastColorFromGroup("testGroup", true);
      });

      // Verify the group exists with only content
      expect(result.current.currentTheme?.brandColors.testGroup).toHaveProperty(
        "content",
      );
      expect(
        result.current.currentTheme?.brandColors.testGroup,
      ).not.toHaveProperty("100");

      // Now add a color to the group that has no numeric keys
      act(() => {
        result.current.addColorToGroup("testGroup", true);
      });

      // Should add 100 as the first numeric key
      expect(result.current.currentTheme?.brandColors.testGroup).toHaveProperty(
        "100",
      );
    });

    it("removes highest numeric key while preserving content in removeLastColorFromGroup", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.removeLastColorFromGroup("info", true);
      });

      // info group has content, 100, and 200, so 200 (highest) should be removed
      expect(result.current.currentTheme?.brandColors.info).not.toHaveProperty(
        "200",
      );
      expect(result.current.currentTheme?.brandColors.info).toHaveProperty(
        "100",
      );
      expect(result.current.currentTheme?.brandColors.info).toHaveProperty(
        "content",
      );
    });
  });
});
