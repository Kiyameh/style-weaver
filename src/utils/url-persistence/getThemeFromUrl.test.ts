import Color from "colorjs.io";
import { beforeEach, describe, expect, it } from "vitest";
import type { Theme } from "@/types/Theme";
import { getThemeFromUrl } from "./getThemeFromUrl";
import { serializeTheme } from "./serializeTheme";

// Mock window.location
const mockLocation = {
  href: "https://example.com/",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

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
  radius: {
    s: "0.25rem",
  },
  shadows: {
    s: "0 0 0.5rem oklch(0 0 0 / 0.1)",
  },
};

describe("getThemeFromUrl", () => {
  beforeEach(() => {
    mockLocation.href = "https://example.com/";
  });

  it("returns theme from URL parameter", () => {
    const serialized = serializeTheme(mockTheme);
    mockLocation.href = `https://example.com/?theme=${serialized}`;

    const result = getThemeFromUrl();

    expect(result).not.toBeNull();
    expect(result?.name).toBe(mockTheme.name);
    expect(result?.description).toBe(mockTheme.description);
    expect(result?.colorMode).toBe(mockTheme.colorMode);
  });

  it("returns null when no theme parameter exists", () => {
    mockLocation.href = "https://example.com/";

    const result = getThemeFromUrl();

    expect(result).toBeNull();
  });

  it("returns null when theme parameter is empty", () => {
    mockLocation.href = "https://example.com/?theme=";

    const result = getThemeFromUrl();

    expect(result).toBeNull();
  });

  it("returns null when theme parameter is invalid", () => {
    mockLocation.href = "https://example.com/?theme=invalid-data";

    const result = getThemeFromUrl();

    expect(result).toBeNull();
  });

  it("handles URLs with multiple parameters", () => {
    const serialized = serializeTheme(mockTheme);
    mockLocation.href = `https://example.com/?param1=value1&theme=${serialized}&param2=value2`;

    const result = getThemeFromUrl();

    expect(result).not.toBeNull();
    expect(result?.name).toBe(mockTheme.name);
  });

  it("handles URLs with hash fragments", () => {
    const serialized = serializeTheme(mockTheme);
    mockLocation.href = `https://example.com/?theme=${serialized}#section`;

    const result = getThemeFromUrl();

    expect(result).not.toBeNull();
    expect(result?.name).toBe(mockTheme.name);
  });

  it("reconstructs Color objects correctly", () => {
    const serialized = serializeTheme(mockTheme);
    mockLocation.href = `https://example.com/?theme=${serialized}`;

    const result = getThemeFromUrl();

    expect(result?.mainColors.surface[100]).toBeInstanceOf(Color);
    expect(result?.brandColors.primary.content).toBeInstanceOf(Color);
  });

  it("preserves color values accurately", () => {
    const serialized = serializeTheme(mockTheme);
    mockLocation.href = `https://example.com/?theme=${serialized}`;

    const result = getThemeFromUrl();

    expect(result?.mainColors.surface[100].toString()).toBe(
      mockTheme.mainColors.surface[100].toString(),
    );
    expect(result?.brandColors.primary.content.toString()).toBe(
      mockTheme.brandColors.primary.content.toString(),
    );
  });

  it("returns null in server environment", () => {
    // Mock server environment
    const originalWindow = global.window;
    // @ts-expect-error - Simulating server environment where window is undefined
    global.window = undefined;

    const result = getThemeFromUrl();

    expect(result).toBeNull();

    // Restore window
    global.window = originalWindow;
  });

  it("handles malformed URLs gracefully", () => {
    // This shouldn't happen in practice, but test defensive programming
    mockLocation.href = "not-a-valid-url";

    // Should not throw, but may return null
    expect(() => getThemeFromUrl()).not.toThrow();
  });
});
