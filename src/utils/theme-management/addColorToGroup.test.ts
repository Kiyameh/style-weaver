import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { addColorToGroup } from "./addColorToGroup";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "Test Description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.9, 0, 0]),
      300: new Color("oklch", [0.8, 0, 0]),
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
      200: new Color("oklch", [0.6, 0.1, 260]),
    },
  },
  radius: {},
  shadows: {},
};

describe("addColorToGroup", () => {
  it("adds color to main color group with next consecutive number", () => {
    const result = addColorToGroup(mockTheme, "surface", false);

    // Surface has 100, 200, 300, so next should be 400
    expect(result.mainColors.surface).toHaveProperty("400");
    expect(result.mainColors.surface[400]).toBeInstanceOf(Color);
  });

  it("adds color to brand color group with next consecutive number", () => {
    const result = addColorToGroup(mockTheme, "primary", true);

    // Primary has content, 100, 200, so next should be 300
    expect(result.brandColors.primary).toHaveProperty("300");
    expect(result.brandColors.primary[300]).toBeInstanceOf(Color);
  });

  it("adds first numeric color when group has no numeric keys", () => {
    const themeWithContentOnly: Theme = {
      ...mockTheme,
      brandColors: {
        testGroup: {
          content: new Color("oklch", [0.5, 0.1, 180]),
        },
      },
    };

    const result = addColorToGroup(themeWithContentOnly, "testGroup", true);

    expect(result.brandColors.testGroup).toHaveProperty("100");
    expect(result.brandColors.testGroup[100]).toBeInstanceOf(Color);
  });

  it("returns original theme when group doesn't exist", () => {
    const result = addColorToGroup(mockTheme, "nonExistent", false);

    expect(result).toEqual(mockTheme);
  });

  it("increments lightness from previous color by default 0.2", () => {
    // Create a theme with lower lightness values
    const testTheme: Theme = {
      ...mockTheme,
      mainColors: {
        ...mockTheme.mainColors,
        surface: {
          100: new Color("oklch", [0.2, 0, 0]),
          200: new Color("oklch", [0.4, 0, 0]),
        },
      },
    };

    const result = addColorToGroup(testTheme, "surface", false);

    // Surface 200 has lightness 0.4, so new color should have 0.4 + 0.2 = 0.6
    const newColor = result.mainColors.surface[300];
    const [lightness] = newColor.oklch;

    expect(lightness).toBeCloseTo(0.6, 1);
  });

  it("increments lightness with custom increment", () => {
    const result = addColorToGroup(mockTheme, "primary", true, 0.1);

    // Primary 200 has lightness 0.6, so new color should have 0.6 + 0.1 = 0.7
    const newColor = result.brandColors.primary[300];
    const [lightness] = newColor.oklch;

    expect(lightness).toBeCloseTo(0.7, 1);
  });

  it("preserves chroma and hue from previous color", () => {
    const result = addColorToGroup(mockTheme, "primary", true);

    const previousColor = mockTheme.brandColors.primary[200];
    const newColor = result.brandColors.primary[300];

    const [, prevChroma, prevHue] = previousColor.oklch;
    const [, newChroma, newHue] = newColor.oklch;

    expect(newChroma).toBeCloseTo(prevChroma, 2);
    expect(newHue).toBeCloseTo(prevHue || 0, 2);
  });

  it("clamps lightness to maximum 1.0", () => {
    // Create a theme with high lightness
    const highLightnessTheme: Theme = {
      ...mockTheme,
      mainColors: {
        ...mockTheme.mainColors,
        surface: {
          100: new Color("oklch", [0.95, 0, 0]),
        },
      },
    };

    const result = addColorToGroup(highLightnessTheme, "surface", false);
    const newColor = result.mainColors.surface[200];
    const [lightness] = newColor.oklch;

    // 0.95 + 0.2 = 1.15, but should be clamped to 1.0
    expect(lightness).toBeLessThanOrEqual(1.0);
    expect(lightness).toBeCloseTo(1.0, 1);
  });

  it("preserves existing colors in the group", () => {
    const result = addColorToGroup(mockTheme, "surface", false);

    expect(result.mainColors.surface[100]).toEqual(
      mockTheme.mainColors.surface[100],
    );
    expect(result.mainColors.surface[200]).toEqual(
      mockTheme.mainColors.surface[200],
    );
    expect(result.mainColors.surface[300]).toEqual(
      mockTheme.mainColors.surface[300],
    );
  });

  it("preserves all other theme properties", () => {
    const result = addColorToGroup(mockTheme, "surface", false);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.brandColors).toEqual(mockTheme.brandColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });
});
