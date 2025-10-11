import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import { serializeTheme } from "./serializeTheme";

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
    s: "0 0 0.5rem rgba(0, 0, 0, 0.1)",
  },
};

describe("serializeTheme", () => {
  it("serializes theme to URL-safe string", () => {
    const result = serializeTheme(mockTheme);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toContain(" "); // Should be URL-safe
  });

  it("creates valid URL-encoded string", () => {
    const result = serializeTheme(mockTheme);

    // Should be decodable
    expect(() => decodeURIComponent(result)).not.toThrow();

    const decoded = decodeURIComponent(result);
    expect(() => JSON.parse(decoded)).not.toThrow();
  });

  it("preserves theme metadata", () => {
    const result = serializeTheme(mockTheme);
    const decoded = decodeURIComponent(result);
    const parsed = JSON.parse(decoded);

    expect(parsed.name).toBe(mockTheme.name);
    expect(parsed.description).toBe(mockTheme.description);
    expect(parsed.colorMode).toBe(mockTheme.colorMode);
  });

  it("serializes color objects to plain objects", () => {
    const result = serializeTheme(mockTheme);
    const decoded = decodeURIComponent(result);
    const parsed = JSON.parse(decoded);

    // Colors should be serialized as objects with space, coords, alpha
    expect(parsed.mainColors.surface[100]).toHaveProperty("space");
    expect(parsed.mainColors.surface[100]).toHaveProperty("coords");
    expect(parsed.mainColors.surface[100]).toHaveProperty("alpha");

    expect(parsed.brandColors.primary.content).toHaveProperty("space");
    expect(parsed.brandColors.primary.content).toHaveProperty("coords");
    expect(parsed.brandColors.primary.content).toHaveProperty("alpha");
  });

  it("preserves radius and shadow values", () => {
    const result = serializeTheme(mockTheme);
    const decoded = decodeURIComponent(result);
    const parsed = JSON.parse(decoded);

    expect(parsed.radius).toEqual(mockTheme.radius);
    expect(parsed.shadows).toEqual(mockTheme.shadows);
  });

  it("handles empty color groups", () => {
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

    const result = serializeTheme(emptyTheme);
    expect(result).toBeTruthy();

    const decoded = decodeURIComponent(result);
    const parsed = JSON.parse(decoded);

    expect(parsed.mainColors.surface).toEqual({});
    expect(parsed.brandColors).toEqual({});
  });

  it("returns empty string on serialization error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Create a theme with circular reference to cause JSON.stringify to fail
    // biome-ignore lint/suspicious/noExplicitAny: <not necesary type>
    const invalidTheme = { ...mockTheme } as any;
    invalidTheme.circular = invalidTheme;

    const result = serializeTheme(invalidTheme);

    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error serializing theme to URL:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
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

    const result = serializeTheme(mixedTheme);
    const decoded = decodeURIComponent(result);
    const parsed = JSON.parse(decoded);

    expect(parsed.brandColors.primary).toHaveProperty("content");
    expect(parsed.brandColors.primary).toHaveProperty("100");
    expect(parsed.brandColors.primary).toHaveProperty("custom-key");
  });
});
