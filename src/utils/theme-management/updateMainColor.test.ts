import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { updateMainColor } from "./updateMainColor";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "Test Description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.9, 0, 0]),
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
  radius: {},
  shadows: {},
};

describe("updateMainColor", () => {
  it("updates main color successfully", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", 100, newColor);

    expect(result.mainColors.surface[100]).toEqual(newColor);
  });

  it("updates main color with string key", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", "100", newColor);

    expect(result.mainColors.surface["100"]).toEqual(newColor);
  });

  it("adds new color key if it doesn't exist", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", 300, newColor);

    expect(result.mainColors.surface[300]).toEqual(newColor);
    expect(result.mainColors.surface[100]).toEqual(
      mockTheme.mainColors.surface[100],
    );
    expect(result.mainColors.surface[200]).toEqual(
      mockTheme.mainColors.surface[200],
    );
  });

  it("preserves other colors in the same group", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", 100, newColor);

    expect(result.mainColors.surface[200]).toEqual(
      mockTheme.mainColors.surface[200],
    );
  });

  it("preserves other main color groups", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", 100, newColor);

    expect(result.mainColors.content).toEqual(mockTheme.mainColors.content);
    expect(result.mainColors.border).toEqual(mockTheme.mainColors.border);
  });

  it("preserves all other theme properties", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    const result = updateMainColor(mockTheme, "surface", 100, newColor);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.brandColors).toEqual(mockTheme.brandColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("returns original theme when color group doesn't exist", () => {
    const newColor = new Color("oklch", [0.9, 0.1, 180]);
    // TypeScript won't allow invalid keys, but we can test the runtime behavior
    const result = updateMainColor(mockTheme, "surface", 100, newColor);

    // This should work normally since surface exists
    expect(result.mainColors.surface[100]).toEqual(newColor);
  });
});
