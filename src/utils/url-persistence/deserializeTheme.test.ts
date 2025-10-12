import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import { deserializeTheme } from "./deserializeTheme";
import { serializeTheme } from "./serializeTheme";

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
  },
  shadows: {
    s: "0 0 0.5rem oklch(0 0 0 / 0.1)",
  },
};

describe("deserializeTheme", () => {
  it("deserializes theme from URL string", () => {
    const serialized = serializeTheme(mockTheme);
    const result = deserializeTheme(serialized);

    expect(result).not.toBeNull();
    expect(result?.name).toBe(mockTheme.name);
    expect(result?.description).toBe(mockTheme.description);
    expect(result?.colorMode).toBe(mockTheme.colorMode);
  });

  it("reconstructs Color objects correctly", () => {
    const serialized = serializeTheme(mockTheme);
    const result = deserializeTheme(serialized);

    expect(result?.mainColors.surface[100]).toBeInstanceOf(Color);
    expect(result?.mainColors.content[100]).toBeInstanceOf(Color);
    expect(result?.brandColors.primary.content).toBeInstanceOf(Color);
    expect(result?.brandColors.primary[100]).toBeInstanceOf(Color);
  });

  it("preserves color values accurately", () => {
    const serialized = serializeTheme(mockTheme);
    const result = deserializeTheme(serialized);

    // Check that color values are preserved
    expect(result?.mainColors.surface[100].toString()).toBe(
      mockTheme.mainColors.surface[100].toString(),
    );
    expect(result?.brandColors.primary.content.toString()).toBe(
      mockTheme.brandColors.primary.content.toString(),
    );
  });

  it("preserves radius and shadow values", () => {
    const serialized = serializeTheme(mockTheme);
    const result = deserializeTheme(serialized);

    expect(result?.radius).toEqual(mockTheme.radius);
    expect(result?.shadows).toEqual(mockTheme.shadows);
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

    const serialized = serializeTheme(emptyTheme);
    const result = deserializeTheme(serialized);

    expect(result).not.toBeNull();
    expect(result?.mainColors.surface).toEqual({});
    expect(result?.brandColors).toEqual({});
  });

  it("returns null on invalid URL parameter", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = deserializeTheme("invalid-url-param");

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deserializing theme from URL:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("returns null on malformed JSON", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const malformedJson = encodeURIComponent("{invalid json}");
    const result = deserializeTheme(malformedJson);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

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

    const serialized = serializeTheme(mixedTheme);
    const result = deserializeTheme(serialized);

    expect(result?.brandColors.primary).toHaveProperty("content");
    expect(result?.brandColors.primary).toHaveProperty("100");
    expect(result?.brandColors.primary).toHaveProperty("custom-key");

    expect(result?.brandColors.primary.content).toBeInstanceOf(Color);
    expect(result?.brandColors.primary[100]).toBeInstanceOf(Color);
    expect(result?.brandColors.primary["custom-key"]).toBeInstanceOf(Color);
  });

  it("round-trip serialization preserves theme integrity", () => {
    const serialized = serializeTheme(mockTheme);
    const deserialized = deserializeTheme(serialized);
    // biome-ignore lint/style/noNonNullAssertion: <testing>
    const reSerialized = serializeTheme(deserialized!);
    const reDeserialized = deserializeTheme(reSerialized);

    expect(reDeserialized?.name).toBe(mockTheme.name);
    expect(reDeserialized?.description).toBe(mockTheme.description);
    expect(reDeserialized?.colorMode).toBe(mockTheme.colorMode);

    // Check that colors are still valid after round-trip
    expect(reDeserialized?.mainColors.surface[100]).toBeInstanceOf(Color);
    expect(reDeserialized?.brandColors.primary.content).toBeInstanceOf(Color);
  });
});
