import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import { updateUrlWithTheme } from "./updateUrlWithTheme";

// Mock window and history API
const mockReplaceState = vi.fn();
const mockLocation = {
  href: "https://example.com/",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, "history", {
  value: {
    replaceState: mockReplaceState,
  },
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

describe("updateUrlWithTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = "https://example.com/";
  });

  it("updates URL with theme parameter", () => {
    updateUrlWithTheme(mockTheme);

    expect(mockReplaceState).toHaveBeenCalledWith(
      {},
      "",
      expect.stringContaining("theme="),
    );
  });

  it("preserves existing URL parameters", () => {
    mockLocation.href = "https://example.com/?existing=param";

    updateUrlWithTheme(mockTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toContain("existing=param");
    expect(newUrl).toContain("theme=");
  });

  it("replaces existing theme parameter", () => {
    mockLocation.href = "https://example.com/?theme=old-theme-data";

    updateUrlWithTheme(mockTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    // Should have only one theme parameter
    const themeMatches = newUrl.match(/theme=/g);
    expect(themeMatches).toHaveLength(1);
  });

  it("handles URL with hash fragment", () => {
    mockLocation.href = "https://example.com/#section";

    updateUrlWithTheme(mockTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toContain("#section");
    expect(newUrl).toContain("theme=");
  });

  it("handles complex URLs with multiple parameters", () => {
    mockLocation.href =
      "https://example.com/path?param1=value1&param2=value2#hash";

    updateUrlWithTheme(mockTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toContain("param1=value1");
    expect(newUrl).toContain("param2=value2");
    expect(newUrl).toContain("#hash");
    expect(newUrl).toContain("theme=");
  });

  it("does nothing in server environment", () => {
    // Mock server environment
    const originalWindow = global.window;
    // @ts-expect-error
    delete global.window;

    updateUrlWithTheme(mockTheme);

    expect(mockReplaceState).not.toHaveBeenCalled();

    // Restore window
    global.window = originalWindow;
  });

  it("removes theme parameter when serialization fails", () => {
    mockLocation.href = "https://example.com/?theme=existing";

    // Create a theme that will fail serialization
    const invalidTheme = { ...mockTheme } as any;
    invalidTheme.circular = invalidTheme;

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    updateUrlWithTheme(invalidTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).not.toContain("theme=");

    consoleSpy.mockRestore();
  });

  it("creates valid URL structure", () => {
    updateUrlWithTheme(mockTheme);

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    // Should be a valid URL
    expect(() => new URL(newUrl)).not.toThrow();

    const url = new URL(newUrl);
    expect(url.searchParams.has("theme")).toBe(true);
    expect(url.searchParams.get("theme")).toBeTruthy();
  });
});
