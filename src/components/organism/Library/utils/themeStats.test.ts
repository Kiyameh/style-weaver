import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { calculateThemeStats } from "./themeStats";

describe("themeStats", () => {
  describe("calculateThemeStats", () => {
    it("calculates stats for a basic theme", () => {
      const theme: Theme = {
        name: "Test",
        description: "Test",
        colorMode: "light",
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
          },
          content: {
            100: new Color("oklch", [0, 0, 0]),
          },
          border: {
            100: new Color("oklch", [0.5, 0, 0]),
          },
        },
        brandColors: {
          primary: {
            100: new Color("oklch", [0.5, 0.1, 260]),
          },
        },
        radius: {
          s: "0.25rem",
        },
        shadows: {
          s: "0 0 0.5rem black",
        },
      };

      const stats = calculateThemeStats(theme);

      expect(stats.mainColorsCount).toBe(3);
      expect(stats.brandColorsCount).toBe(1);
      expect(stats.shadowsCount).toBe(1);
      expect(stats.radiusCount).toBe(1);
    });

    it("counts multiple variants correctly", () => {
      const theme: Theme = {
        name: "Test",
        description: "Test",
        colorMode: "light",
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
            200: new Color("oklch", [0.9, 0, 0]),
            300: new Color("oklch", [0.8, 0, 0]),
          },
          content: {
            100: new Color("oklch", [0, 0, 0]),
            200: new Color("oklch", [0.1, 0, 0]),
          },
          border: {
            100: new Color("oklch", [0.5, 0, 0]),
          },
        },
        brandColors: {
          primary: {
            100: new Color("oklch", [0.5, 0.1, 260]),
            200: new Color("oklch", [0.6, 0.1, 260]),
          },
          secondary: {
            100: new Color("oklch", [0.5, 0.1, 180]),
          },
        },
        radius: {
          s: "0.25rem",
          m: "0.5rem",
          l: "1rem",
        },
        shadows: {
          s: "0 0 0.5rem black",
          m: "0 0 1rem black",
        },
      };

      const stats = calculateThemeStats(theme);

      expect(stats.mainColorsCount).toBe(6); // 3 + 2 + 1
      expect(stats.brandColorsCount).toBe(3); // 2 + 1
      expect(stats.shadowsCount).toBe(2);
      expect(stats.radiusCount).toBe(3);
    });

    it("handles empty color groups", () => {
      const theme: Theme = {
        name: "Test",
        description: "Test",
        colorMode: "light",
        mainColors: {
          surface: {},
          content: {},
          border: {},
        },
        brandColors: {},
        radius: {},
        shadows: {},
      };

      const stats = calculateThemeStats(theme);

      expect(stats.mainColorsCount).toBe(0);
      expect(stats.brandColorsCount).toBe(0);
      expect(stats.shadowsCount).toBe(0);
      expect(stats.radiusCount).toBe(0);
    });

    it("handles multiple brand color groups", () => {
      const theme: Theme = {
        name: "Test",
        description: "Test",
        colorMode: "light",
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
          },
          content: {
            100: new Color("oklch", [0, 0, 0]),
          },
          border: {
            100: new Color("oklch", [0.5, 0, 0]),
          },
        },
        brandColors: {
          primary: {
            100: new Color("oklch", [0.5, 0.1, 260]),
            200: new Color("oklch", [0.6, 0.1, 260]),
          },
          secondary: {
            100: new Color("oklch", [0.5, 0.1, 180]),
            200: new Color("oklch", [0.6, 0.1, 180]),
            300: new Color("oklch", [0.7, 0.1, 180]),
          },
          accent: {
            100: new Color("oklch", [0.5, 0.1, 90]),
          },
        },
        radius: {
          s: "0.25rem",
        },
        shadows: {
          s: "0 0 0.5rem black",
        },
      };

      const stats = calculateThemeStats(theme);

      expect(stats.brandColorsCount).toBe(6); // 2 + 3 + 1
    });

    it("handles numeric keys in color groups", () => {
      const theme: Theme = {
        name: "Test",
        description: "Test",
        colorMode: "light",
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
            200: new Color("oklch", [0.9, 0, 0]),
          },
          content: {
            100: new Color("oklch", [0, 0, 0]),
          },
          border: {
            100: new Color("oklch", [0.5, 0, 0]),
          },
        },
        brandColors: {
          primary: {
            content: new Color("oklch", [0, 0, 0]),
            100: new Color("oklch", [0.5, 0.1, 260]),
          },
        },
        radius: {
          s: "0.25rem",
        },
        shadows: {
          s: "0 0 0.5rem black",
        },
      };

      const stats = calculateThemeStats(theme);

      expect(stats.mainColorsCount).toBe(4);
      expect(stats.brandColorsCount).toBe(2);
    });
  });
});
