import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearThemeFromUrl } from "./clearThemeFromUrl";

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

describe("clearThemeFromUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = "https://example.com/";
  });

  it("removes theme parameter from URL", () => {
    mockLocation.href = "https://example.com/?theme=some-theme-data";

    clearThemeFromUrl();

    expect(mockReplaceState).toHaveBeenCalledWith(
      {},
      "",
      "https://example.com/",
    );
  });

  it("preserves other URL parameters", () => {
    mockLocation.href =
      "https://example.com/?param1=value1&theme=theme-data&param2=value2";

    clearThemeFromUrl();

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toContain("param1=value1");
    expect(newUrl).toContain("param2=value2");
    expect(newUrl).not.toContain("theme=");
  });

  it("preserves hash fragment", () => {
    mockLocation.href = "https://example.com/?theme=theme-data#section";

    clearThemeFromUrl();

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toContain("#section");
    expect(newUrl).not.toContain("theme=");
  });

  it("handles URL with no theme parameter", () => {
    mockLocation.href = "https://example.com/?other=param";

    clearThemeFromUrl();

    expect(mockReplaceState).toHaveBeenCalledWith(
      {},
      "",
      "https://example.com/?other=param",
    );
  });

  it("handles URL with no parameters", () => {
    mockLocation.href = "https://example.com/";

    clearThemeFromUrl();

    expect(mockReplaceState).toHaveBeenCalledWith(
      {},
      "",
      "https://example.com/",
    );
  });

  it("handles complex URLs", () => {
    mockLocation.href =
      "https://example.com/path/to/page?param1=value1&theme=data&param2=value2#hash";

    clearThemeFromUrl();

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    expect(newUrl).toBe(
      "https://example.com/path/to/page?param1=value1&param2=value2#hash",
    );
  });

  it("does nothing in server environment", () => {
    // Mock server environment
    const originalWindow = global.window;
    // @ts-expect-error
    delete global.window;

    clearThemeFromUrl();

    expect(mockReplaceState).not.toHaveBeenCalled();

    // Restore window
    global.window = originalWindow;
  });

  it("creates valid URL structure", () => {
    mockLocation.href = "https://example.com/?theme=data&other=param";

    clearThemeFromUrl();

    const callArgs = mockReplaceState.mock.calls[0];
    const newUrl = callArgs[2];

    // Should be a valid URL
    expect(() => new URL(newUrl)).not.toThrow();

    const url = new URL(newUrl);
    expect(url.searchParams.has("theme")).toBe(false);
    expect(url.searchParams.has("other")).toBe(true);
  });
});
