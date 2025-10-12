import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { generateCssVariables } from "./generateCssVariables";

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
    secondary: {
      100: new Color("oklch", [0.8, 0.1, 180]),
    },
  },
  radius: {
    s: "0.25rem",
    m: "0.5rem",
    l: "1rem",
  },
  shadows: {
    s: "0 0 0.5rem oklch(0 0 0 / 0.1)",
    m: "0 0 1rem oklch(0 0 0 / 0.2)",
  },
};

describe("generateCssVariables", () => {
  it("generates CSS variables for main colors", () => {
    const result = generateCssVariables(mockTheme);

    expect(result).toHaveProperty("--surface-100");
    expect(result).toHaveProperty("--surface-200");
    expect(result).toHaveProperty("--content-100");
    expect(result).toHaveProperty("--border-100");

    expect(result["--surface-100"]).toBe("oklch(1 0 0)");
    expect(result["--content-100"]).toBe("oklch(0.2 0 0)");
  });

  it("generates CSS variables for brand colors", () => {
    const result = generateCssVariables(mockTheme);

    expect(result).toHaveProperty("--primary-content");
    expect(result).toHaveProperty("--primary-100");
    expect(result).toHaveProperty("--secondary-100");

    expect(result["--primary-content"]).toBe("oklch(0.2 0.1 260)");
    expect(result["--primary-100"]).toBe("oklch(0.8 0.1 260)");
  });

  it("generates CSS variables for radius values", () => {
    const result = generateCssVariables(mockTheme);

    expect(result).toHaveProperty("--radius-s");
    expect(result).toHaveProperty("--radius-m");
    expect(result).toHaveProperty("--radius-l");

    expect(result["--radius-s"]).toBe("0.25rem");
    expect(result["--radius-m"]).toBe("0.5rem");
    expect(result["--radius-l"]).toBe("1rem");
  });

  it("generates CSS variables for shadow values", () => {
    const result = generateCssVariables(mockTheme);

    expect(result).toHaveProperty("--shadow-s");
    expect(result).toHaveProperty("--shadow-m");

    expect(result["--shadow-s"]).toBe("0 0 0.5rem oklch(0 0 0 / 0.1)");
    expect(result["--shadow-m"]).toBe("0 0 1rem oklch(0 0 0 / 0.2)");
  });

  it("returns empty object for theme with no properties", () => {
    const emptyTheme: Theme = {
      name: "Empty",
      description: "Empty theme",
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

    const result = generateCssVariables(emptyTheme);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("handles themes with mixed color key types", () => {
    const mixedTheme: Theme = {
      ...mockTheme,
      brandColors: {
        primary: {
          content: new Color("oklch", [0.2, 0.1, 260]),
          100: new Color("oklch", [0.8, 0.1, 260]),
          "custom-key": new Color("oklch", [0.6, 0.1, 260]),
        },
      },
    };

    const result = generateCssVariables(mixedTheme);

    expect(result).toHaveProperty("--primary-content");
    expect(result).toHaveProperty("--primary-100");
    expect(result).toHaveProperty("--primary-custom-key");
  });
});
