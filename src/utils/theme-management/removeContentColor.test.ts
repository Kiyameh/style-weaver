import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { removeContentColor } from "./removeContentColor";

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
      200: new Color("oklch", [0.6, 0.1, 180]),
    },
  },
  radius: {},
  shadows: {},
};

describe("removeContentColor", () => {
  it("removes content color from brand color group", () => {
    const result = removeContentColor(mockTheme, "primary");

    expect(result.brandColors.primary).not.toHaveProperty("content");
    expect(result.brandColors.primary).toHaveProperty("100");
    expect(result.brandColors.primary).toHaveProperty("200");
  });

  it("returns original theme when group doesn't have content color", () => {
    const result = removeContentColor(mockTheme, "secondary");

    expect(result).toEqual(mockTheme);
  });

  it("returns original theme when group doesn't exist", () => {
    const result = removeContentColor(mockTheme, "nonExistent");

    expect(result).toEqual(mockTheme);
  });

  it("preserves other colors in the group", () => {
    const result = removeContentColor(mockTheme, "primary");

    expect(result.brandColors.primary[100]).toEqual(
      mockTheme.brandColors.primary[100],
    );
    expect(result.brandColors.primary[200]).toEqual(
      mockTheme.brandColors.primary[200],
    );
  });

  it("preserves all other theme properties", () => {
    const result = removeContentColor(mockTheme, "primary");

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });
});
