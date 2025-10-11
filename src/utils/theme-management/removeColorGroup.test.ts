import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import { removeColorGroup } from "./removeColorGroup";

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
      content: new Color("oklch", [0.2, 0.1, 180]),
      100: new Color("oklch", [0.8, 0.1, 180]),
    },
  },
  radius: {},
  shadows: {},
};

describe("removeColorGroup", () => {
  it("removes brand color group successfully", () => {
    const result = removeColorGroup(mockTheme, "primary", true);

    expect(result.brandColors).not.toHaveProperty("primary");
    expect(result.brandColors).toHaveProperty("secondary");
  });

  it("returns original theme when trying to remove main color group", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = removeColorGroup(mockTheme, "surface", false);

    expect(result).toEqual(mockTheme);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Cannot remove main color group 'surface'. Main color groups are required.",
    );

    consoleSpy.mockRestore();
  });

  it("returns original theme when brand color group doesn't exist", () => {
    const result = removeColorGroup(mockTheme, "nonExistent", true);

    expect(result).toEqual(mockTheme);
  });

  it("preserves all other theme properties when removing brand color", () => {
    const result = removeColorGroup(mockTheme, "primary", true);

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("preserves other brand color groups", () => {
    const result = removeColorGroup(mockTheme, "primary", true);

    expect(result.brandColors.secondary).toEqual(
      mockTheme.brandColors.secondary,
    );
  });
});
