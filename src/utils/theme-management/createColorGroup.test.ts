import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import { createColorGroup } from "./createColorGroup";

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
  radius: {},
  shadows: {},
};

describe("createColorGroup", () => {
  it("creates new brand color group with default colors", () => {
    const result = createColorGroup(mockTheme, "newBrand", true);

    expect(result.brandColors).toHaveProperty("newBrand");
    expect(result.brandColors.newBrand).toHaveProperty("content");
    expect(result.brandColors.newBrand).toHaveProperty("100");
    expect(result.brandColors.newBrand.content).toBeInstanceOf(Color);
    expect(result.brandColors.newBrand[100]).toBeInstanceOf(Color);
  });

  it("returns original theme when trying to create main color group", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = createColorGroup(mockTheme, "newMain", false);

    expect(result).toEqual(mockTheme);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Cannot add main color group 'newMain'. Main color groups are fixed.",
    );

    consoleSpy.mockRestore();
  });

  it("returns original theme when brand color group already exists", () => {
    const result = createColorGroup(mockTheme, "primary", true);

    expect(result).toEqual(mockTheme);
  });

  it("preserves all other theme properties", () => {
    const result = createColorGroup(mockTheme, "newBrand", true);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("preserves existing brand color groups", () => {
    const result = createColorGroup(mockTheme, "newBrand", true);

    expect(result.brandColors.primary).toEqual(mockTheme.brandColors.primary);
  });

  it("creates default colors with appropriate contrast", () => {
    const result = createColorGroup(mockTheme, "newBrand", true);
    const contentColor = result.brandColors.newBrand.content as Color;
    const baseColor = result.brandColors.newBrand[100] as Color;

    // Content should be dark for readability
    expect(contentColor.oklch.l).toBeLessThan(0.5);
    // Base color should be lighter
    expect(baseColor.oklch.l).toBeGreaterThan(0.5);
  });
});
