import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { renameColorGroup } from "./renameColorGroup";

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

describe("renameColorGroup", () => {
  it("renames a brand color group successfully", () => {
    const result = renameColorGroup(mockTheme, "primary", "newPrimary");

    expect(result.brandColors).toHaveProperty("newPrimary");
    expect(result.brandColors).not.toHaveProperty("primary");
    expect(result.brandColors.newPrimary).toEqual(
      mockTheme.brandColors.primary,
    );
  });

  it("returns original theme when trying to rename non-existent group", () => {
    const result = renameColorGroup(mockTheme, "nonExistent", "newName");

    expect(result).toEqual(mockTheme);
  });

  it("returns original theme when new name already exists", () => {
    const result = renameColorGroup(mockTheme, "primary", "secondary");

    expect(result).toEqual(mockTheme);
  });

  it("returns original theme when trying to rename main color groups", () => {
    const result = renameColorGroup(mockTheme, "surface", "newSurface");

    expect(result).toEqual(mockTheme);
  });

  it("preserves all other theme properties", () => {
    const result = renameColorGroup(mockTheme, "primary", "newPrimary");

    expect(result.name).toBe(mockTheme.name);
    expect(result.description).toBe(mockTheme.description);
    expect(result.colorMode).toBe(mockTheme.colorMode);
    expect(result.mainColors).toEqual(mockTheme.mainColors);
    expect(result.radius).toEqual(mockTheme.radius);
    expect(result.shadows).toEqual(mockTheme.shadows);
  });

  it("preserves the order of color groups when renaming", () => {
    const themeWithMultipleGroups: Theme = {
      ...mockTheme,
      brandColors: {
        first: {
          100: new Color("oklch", [0.8, 0.1, 0]),
        },
        second: {
          100: new Color("oklch", [0.8, 0.1, 120]),
        },
        third: {
          100: new Color("oklch", [0.8, 0.1, 240]),
        },
        fourth: {
          100: new Color("oklch", [0.8, 0.1, 60]),
        },
      },
    };

    const result = renameColorGroup(
      themeWithMultipleGroups,
      "second",
      "renamedSecond",
    );

    const keys = Object.keys(result.brandColors);
    expect(keys).toEqual(["first", "renamedSecond", "third", "fourth"]);
    expect(keys[1]).toBe("renamedSecond");
  });
});
