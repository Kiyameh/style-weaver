import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { generateCssCode } from "./generateCssCode";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "A test theme for testing",
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
  radius: {
    s: "0.25rem",
    m: "0.5rem",
  },
  shadows: {
    s: "0 0 0.5rem rgba(0, 0, 0, 0.1)",
  },
};

describe("generateCssCode", () => {
  it("generates complete CSS code with header comments", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain("* Tema: Test Theme");
    expect(result).toContain("* Descripción: A test theme for testing");
    expect(result).toContain("* Modo de color: light");
    expect(result).toContain("/* Generado con StyleWeaver */");
  });

  it("includes :root selector", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain(":root {");
    expect(result).toContain("}");
  });

  it("includes main color variables", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain("--surface-100: oklch(1 0 0);");
    expect(result).toContain("--surface-200: oklch(0.9 0 0);");
    expect(result).toContain("--content-100: oklch(0.2 0 0);");
    expect(result).toContain("--border-100: oklch(0.5 0 0);");
  });

  it("includes brand color variables", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain("--primary-content: oklch(0.2 0.1 260);");
    expect(result).toContain("--primary-100: oklch(0.8 0.1 260);");
  });

  it("includes radius variables", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain("--radius-s: 0.25rem;");
    expect(result).toContain("--radius-m: 0.5rem;");
  });

  it("includes shadow variables", () => {
    const result = generateCssCode(mockTheme);

    expect(result).toContain("--shadow-s: 0 0 0.5rem rgba(0, 0, 0, 0.1);");
  });

  it("handles theme with undefined colorMode", () => {
    const themeWithUndefinedMode: Theme = {
      ...mockTheme,
      colorMode: undefined,
    };

    const result = generateCssCode(themeWithUndefinedMode);

    expect(result).toContain("* Modo de color: no definido");
  });

  it("handles empty theme properties", () => {
    const emptyTheme: Theme = {
      name: "Empty Theme",
      description: "Empty",
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

    const result = generateCssCode(emptyTheme);

    expect(result).toContain("* Tema: Empty Theme");
    expect(result).toContain(":root {");
    expect(result).toContain("}");
    expect(result).toContain("/* Generado con StyleWeaver */");

    // Should not contain any variable declarations
    expect(result).not.toMatch(/--\w+/);
  });

  it("properly formats CSS with correct indentation", () => {
    const result = generateCssCode(mockTheme);
    const lines = result.split("\n");

    // Find variable lines (they should start with two spaces)
    const variableLines = lines.filter((line) => line.includes("--"));

    variableLines.forEach((line) => {
      expect(line).toMatch(/^ {2}--/); // Should start with two spaces
      expect(line).toMatch(/;$/); // Should end with semicolon
    });
  });

  it("maintains consistent variable naming convention", () => {
    const result = generateCssCode(mockTheme);

    // Main colors should follow --{group}-{key} pattern
    expect(result).toMatch(/--surface-\d+:/);
    expect(result).toMatch(/--content-\d+:/);
    expect(result).toMatch(/--border-\d+:/);

    // Brand colors should follow --{group}-{key} pattern
    expect(result).toMatch(/--primary-content:/);
    expect(result).toMatch(/--primary-\d+:/);

    // Radius should follow --radius-{key} pattern
    expect(result).toMatch(/--radius-[a-z]+:/);

    // Shadows should follow --shadow-{key} pattern
    expect(result).toMatch(/--shadow-[a-z]+:/);
  });
});
