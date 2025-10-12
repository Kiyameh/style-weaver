import { renderHook } from "@testing-library/react";
import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { useThemeStyles } from "./useThemeStyles";

// Mock theme for testing
const mockTheme: Theme = {
  name: "Test Theme",
  description: "Theme for testing",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.97, 0.011, 259]),
    },
    content: {
      100: new Color("oklch", [0.85, 0.053, 255]),
      500: new Color("oklch", [0.28, 0.053, 255]),
    },
    border: {
      100: new Color("oklch", [0.82, 0.031, 222]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.33, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.31, 252]),
      200: new Color("oklch", [0.63, 0.2, 252]),
    },
    secondary: {
      100: new Color("oklch", [0.86, 0.09, 212]),
    },
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
  shadows: {
    sm: "0 0 0.5rem 0px oklch(0% 0 0 / 0.1)",
    md: "0 0 1rem 0px oklch(0% 0 0 / 0.2)",
  },
};

describe("useThemeStyles", () => {
  it("generates CSS variables from theme", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("object");
    expect(Object.keys(result.current).length).toBeGreaterThan(0);
  });

  it("returns empty object when theme is null", () => {
    const { result } = renderHook(() => useThemeStyles(null));

    expect(result.current).toEqual({});
  });

  it("includes all main colors", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    // Check surface colors
    expect(result.current["--surface-100"]).toBeDefined();
    expect(result.current["--surface-200"]).toBeDefined();

    // Check content colors
    expect(result.current["--content-100"]).toBeDefined();
    expect(result.current["--content-500"]).toBeDefined();

    // Check border colors
    expect(result.current["--border-100"]).toBeDefined();
  });

  it("includes all brand colors", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    // Check primary colors
    expect(result.current["--primary-content"]).toBeDefined();
    expect(result.current["--primary-100"]).toBeDefined();
    expect(result.current["--primary-200"]).toBeDefined();

    // Check secondary colors
    expect(result.current["--secondary-100"]).toBeDefined();
  });

  it("includes radius values", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    expect(result.current["--radius-sm"]).toBe("0.25rem");
    expect(result.current["--radius-md"]).toBe("0.5rem");
    expect(result.current["--radius-lg"]).toBe("1rem");
  });

  it("includes shadow values", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    expect(result.current["--shadow-sm"]).toBe(
      "0 0 0.5rem 0px oklch(0% 0 0 / 0.1)",
    );
    expect(result.current["--shadow-md"]).toBe(
      "0 0 1rem 0px oklch(0% 0 0 / 0.2)",
    );
  });

  it("converts colors to CSS format", () => {
    const { result } = renderHook(() => useThemeStyles(mockTheme));

    // Check that colors are converted to CSS strings
    expect(typeof result.current["--surface-100"]).toBe("string");
    expect(result.current["--surface-100"]).toContain("oklch");
  });

  it("memoizes the result", () => {
    const { result, rerender } = renderHook(
      ({ theme }) => useThemeStyles(theme),
      {
        initialProps: { theme: mockTheme },
      },
    );

    const firstResult = result.current;

    // Rerender with same theme
    rerender({ theme: mockTheme });

    // Should return the same object reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it("recalculates when theme changes", () => {
    const { result, rerender } = renderHook(
      ({ theme }) => useThemeStyles(theme),
      {
        initialProps: { theme: mockTheme },
      },
    );

    const firstResult = result.current;

    // Create a different theme
    const newTheme: Theme = {
      ...mockTheme,
      name: "Different Theme",
    };

    // Rerender with different theme
    rerender({ theme: newTheme });

    // Should return a different object reference
    expect(result.current).not.toBe(firstResult);
  });

  it("handles theme with all color groups", () => {
    const fullTheme: Theme = {
      ...mockTheme,
      brandColors: {
        ...mockTheme.brandColors,
        accent: {
          content: new Color("oklch", [0.93, 0.016, 262]),
          100: new Color("oklch", [0.8, 0.25, 9]),
        },
        neutral: {
          content: new Color("oklch", [0.32, 0.027, 268]),
          100: new Color("oklch", [0.82, 0.031, 222]),
        },
      },
    };

    const { result } = renderHook(() => useThemeStyles(fullTheme));

    expect(result.current["--accent-content"]).toBeDefined();
    expect(result.current["--accent-100"]).toBeDefined();
    expect(result.current["--neutral-content"]).toBeDefined();
    expect(result.current["--neutral-100"]).toBeDefined();
  });
});
