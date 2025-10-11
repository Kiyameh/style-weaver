import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { addContentColor } from "./addContentColor";

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
    secondary: {
      100: new Color("oklch", [0.8, 0.1, 180]),
      200: new Color("oklch", [0.6, 0.1, 180]),
    },
  },
  radius: {},
  shadows: {},
};

describe("addContentColor", () => {
  it("adds content color to brand color group that doesn't have one", () => {
    const result = addContentColor(mockTheme, "secondary");

    expect(result.brandColors.secondary).toHaveProperty("content");
    expect(result.brandColors.secondary.content).toBeInstanceOf(Color);
  });

  it("returns original theme when group already has content color", () => {
    const result = addContentColor(mockTheme, "primary");

    expect(result).toEqual(mockTheme);
  });

  it("returns original theme when group doesn't exist", () => {
    const result = addContentColor(mockTheme, "nonExistent");

    expect(result).toEqual(mockTheme);
  });

  it("preserves existing colors in the group", () => {
    const result = addContentColor(mockTheme, "secondary");

    expect(result.brandColors.secondary[100]).toEqual(
      mockTheme.brandColors.secondary[100],
    );
    expect(result.brandColors.secondary[200]).toEqual(
      mockTheme.brandColors.secondary[200],
    );
  });

  it("preserves all other theme properties", () => {
    const result = addContentColor(mockTheme, "secondary");

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("creates content color with high contrast for readability", () => {
    const result = addContentColor(mockTheme, "secondary");
    const contentColor = result.brandColors.secondary.content as Color;

    // Should be a dark color for high contrast
    expect(contentColor.oklch.l).toBeLessThan(0.5);
  });
});
