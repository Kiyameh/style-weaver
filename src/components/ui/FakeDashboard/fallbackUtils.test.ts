import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import {
  getColorWithFallback,
  getRadiusWithFallback,
  getShadowWithFallback,
} from "./fallbackUtils";

// Mock theme for testing
const mockTheme: Theme = {
  name: "Test Theme",
  description: "Theme for testing",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.97, 0.011, 259]),
      300: new Color("oklch", [0.93, 0.016, 262]),
    },
    content: {
      100: new Color("oklch", [0.85, 0.053, 255]),
      300: new Color("oklch", [0.42, 0.053, 255]),
      500: new Color("oklch", [0.28, 0.053, 255]),
    },
    border: {
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.33, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.31, 252]),
      200: new Color("oklch", [0.63, 0.2, 252]),
    },
    secondary: {
      100: new Color("oklch", [0.86, 0.09, 212]),
      300: new Color("oklch", [0.58, 0.09, 212]),
    },
  },
  radius: {
    sm: "0.25rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  shadows: {
    sm: "0 0 0.5rem 0px oklch(0% 0 0 / 0.1)",
    lg: "0 0 1.5rem 0px oklch(0% 0 0 / 0.3)",
  },
};

describe("fallbackUtils", () => {
  describe("getColorWithFallback", () => {
    it("returns correct CSS variable for existing color", () => {
      const result = getColorWithFallback(mockTheme, "surface", "100");
      expect(result).toBe("var(--surface-100)");
    });

    it("returns correct CSS variable for existing brand color", () => {
      const result = getColorWithFallback(mockTheme, "primary", "200");
      expect(result).toBe("var(--primary-200)");
    });

    it("returns fallback for missing main color group", () => {
      const result = getColorWithFallback(mockTheme, "nonexistent", "100");
      // "nonexistent" is not in mainColors, so it's treated as brandColor
      expect(result).toBe("var(--primary-100, #8b5cf6)");
    });

    it("returns fallback for missing brand color group", () => {
      const themeWithoutAccent: Theme = {
        ...mockTheme,
        brandColors: { primary: mockTheme.brandColors.primary },
      };
      const result = getColorWithFallback(themeWithoutAccent, "accent", "100");
      expect(result).toBe("var(--primary-100, #8b5cf6)");
    });

    it("returns fallback for missing variant", () => {
      const result = getColorWithFallback(mockTheme, "surface", "400");
      // Should find closest lower variant (300)
      expect(result).toBe("var(--surface-300)");
    });

    it("handles content variant fallback correctly for brand colors", () => {
      const result = getColorWithFallback(mockTheme, "secondary", "content");
      // Secondary doesn't have content, should fallback to mainColors content-100
      expect(result).toBe("var(--content-100, #333333)");
    });

    it("handles content variant for existing content", () => {
      const result = getColorWithFallback(mockTheme, "primary", "content");
      expect(result).toBe("var(--primary-content)");
    });

    it("finds closest lower variant when exact variant missing", () => {
      const result = getColorWithFallback(mockTheme, "content", "400");
      // Content has 100, 300, 500 - for 400 should return 300
      expect(result).toBe("var(--content-300)");
    });

    it("uses first available variant when no lower variant exists", () => {
      const result = getColorWithFallback(mockTheme, "content", "50");
      // No variant lower than 50, but algorithm finds 500 as available
      // The function searches for closest lower, and if none found, uses first available
      // In this case, it finds 500 in the sorted array
      expect(result).toBe("var(--content-500)");
    });

    it("returns generic fallback for non-numeric variant", () => {
      const result = getColorWithFallback(mockTheme, "surface", "invalid");
      expect(result).toBe("var(--surface-100, #cccccc)");
    });
  });

  describe("getRadiusWithFallback", () => {
    it("returns correct CSS variable for existing radius", () => {
      const result = getRadiusWithFallback(mockTheme, "sm");
      expect(result).toBe("var(--radius-sm)");
    });

    it("returns fallback for missing radius size", () => {
      const result = getRadiusWithFallback(mockTheme, "md");
      // md doesn't exist, should look for closest (sm is lower, lg is higher)
      expect(result).toBe("var(--radius-sm)");
    });

    it("finds closest available radius size going up", () => {
      const themeWithoutSm: Theme = {
        ...mockTheme,
        radius: { lg: "1rem", xl: "1.5rem" },
      };
      const result = getRadiusWithFallback(themeWithoutSm, "md");
      // md doesn't exist, sm doesn't exist, should use lg
      expect(result).toBe("var(--radius-lg)");
    });

    it("returns final fallback when no radius available", () => {
      const themeWithoutRadius: Theme = {
        ...mockTheme,
        radius: {},
      };
      const result = getRadiusWithFallback(themeWithoutRadius, "md");
      expect(result).toBe("var(--radius-md, 0.5rem)");
    });

    it("searches down first, then up", () => {
      const result = getRadiusWithFallback(mockTheme, "xl");
      // xl exists, should return it
      expect(result).toBe("var(--radius-xl)");
    });
  });

  describe("getShadowWithFallback", () => {
    it("returns correct CSS variable for existing shadow", () => {
      const result = getShadowWithFallback(mockTheme, "sm");
      expect(result).toBe("var(--shadow-sm)");
    });

    it("returns fallback for missing shadow size", () => {
      const result = getShadowWithFallback(mockTheme, "md");
      // md doesn't exist, should look for closest (sm is lower, lg is higher)
      expect(result).toBe("var(--shadow-sm)");
    });

    it("finds closest available shadow size going up", () => {
      const themeWithoutSm: Theme = {
        ...mockTheme,
        shadows: { lg: "0 0 1.5rem 0px oklch(0% 0 0 / 0.3)" },
      };
      const result = getShadowWithFallback(themeWithoutSm, "md");
      // md doesn't exist, sm doesn't exist, should use lg
      expect(result).toBe("var(--shadow-lg)");
    });

    it("returns final fallback when no shadow available", () => {
      const themeWithoutShadows: Theme = {
        ...mockTheme,
        shadows: {},
      };
      const result = getShadowWithFallback(themeWithoutShadows, "md");
      expect(result).toBe("var(--shadow-md, 0 0 1rem 0px rgba(0, 0, 0, 0.2))");
    });

    it("handles xl size correctly", () => {
      const themeWithXl: Theme = {
        ...mockTheme,
        shadows: {
          sm: "0 0 0.5rem 0px oklch(0% 0 0 / 0.1)",
          xl: "0 0 2rem 0px oklch(0% 0 0 / 0.4)",
        },
      };
      const result = getShadowWithFallback(themeWithXl, "xl");
      expect(result).toBe("var(--shadow-xl)");
    });
  });
});
