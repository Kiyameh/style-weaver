import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { updateBrandColor } from "./updateBrandColor";

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
      200: new Color("oklch", [0.6, 0.1, 260]),
    },
    secondary: {
      100: new Color("oklch", [0.8, 0.1, 180]),
    },
  },
  radius: {},
  shadows: {},
};

describe("updateBrandColor", () => {
  it("updates brand color successfully", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", 100, newColor);

    expect(result.brandColors.primary[100]).toEqual(newColor);
  });

  it("updates brand content color successfully", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", "content", newColor);

    expect(result.brandColors.primary.content).toEqual(newColor);
  });

  it("updates brand color with string key", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", "100", newColor);

    expect(result.brandColors.primary["100"]).toEqual(newColor);
  });

  it("adds new color key if it doesn't exist", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", 300, newColor);

    expect(result.brandColors.primary[300]).toEqual(newColor);
    expect(result.brandColors.primary[100]).toEqual(
      mockTheme.brandColors.primary[100],
    );
    expect(result.brandColors.primary[200]).toEqual(
      mockTheme.brandColors.primary[200],
    );
    expect(result.brandColors.primary.content).toEqual(
      mockTheme.brandColors.primary.content,
    );
  });

  it("preserves other colors in the same group", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", 100, newColor);

    expect(result.brandColors.primary[200]).toEqual(
      mockTheme.brandColors.primary[200],
    );
    expect(result.brandColors.primary.content).toEqual(
      mockTheme.brandColors.primary.content,
    );
  });

  it("preserves other brand color groups", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", 100, newColor);

    expect(result.brandColors.secondary).toEqual(
      mockTheme.brandColors.secondary,
    );
  });

  it("preserves all other theme properties", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "primary", 100, newColor);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("returns original theme when color group doesn't exist", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateBrandColor(mockTheme, "nonExistent", 100, newColor);

    expect(result).toEqual(mockTheme);
  });
});
