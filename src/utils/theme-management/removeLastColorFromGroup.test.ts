import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { removeLastColorFromGroup } from "./removeLastColorFromGroup";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "Test Description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.9, 0, 0]),
      300: new Color("oklch", [0.8, 0, 0]),
      500: new Color("oklch", [0.6, 0, 0]),
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
      300: new Color("oklch", [0.4, 0.1, 260]),
    },
  },
  radius: {},
  shadows: {},
};

describe("removeLastColorFromGroup", () => {
  it("removes highest numeric key from main color group", () => {
    const result = removeLastColorFromGroup(mockTheme, "surface", false);

    // Surface has 100, 200, 300, 500, so 500 should be removed
    expect(result.mainColors.surface).not.toHaveProperty("500");
    expect(result.mainColors.surface).toHaveProperty("300");
    expect(result.mainColors.surface).toHaveProperty("200");
    expect(result.mainColors.surface).toHaveProperty("100");
  });

  it("removes highest numeric key from brand color group", () => {
    const result = removeLastColorFromGroup(mockTheme, "primary", true);

    // Primary has content, 100, 200, 300, so 300 should be removed
    expect(result.brandColors.primary).not.toHaveProperty("300");
    expect(result.brandColors.primary).toHaveProperty("200");
    expect(result.brandColors.primary).toHaveProperty("100");
    expect(result.brandColors.primary).toHaveProperty("content");
  });

  it("preserves non-numeric keys like 'content'", () => {
    const result = removeLastColorFromGroup(mockTheme, "primary", true);

    expect(result.brandColors.primary.content).toEqual(
      mockTheme.brandColors.primary.content,
    );
  });

  it("returns original theme when group doesn't exist", () => {
    const result = removeLastColorFromGroup(mockTheme, "nonExistent", false);

    expect(result).toEqual(mockTheme);
  });

  it("returns original theme when group has no numeric keys", () => {
    const themeWithContentOnly: Theme = {
      ...mockTheme,
      brandColors: {
        testGroup: {
          content: new Color("oklch", [0.5, 0.1, 180]),
        },
      },
    };

    const result = removeLastColorFromGroup(
      themeWithContentOnly,
      "testGroup",
      true,
    );

    expect(result).toEqual(themeWithContentOnly);
  });

  it("preserves all other theme properties", () => {
    const result = removeLastColorFromGroup(mockTheme, "surface", false);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.brandColors).toEqual(mockTheme.brandColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });
});
