import { describe, expect, it } from "vitest";
import {
  getNumericVariantCount,
  isContentKey,
  sortColorsWithContentFirst,
} from "./colorSorting";

describe("colorSorting", () => {
  describe("isContentKey", () => {
    it("returns true for 'content' key", () => {
      expect(isContentKey("content")).toBe(true);
    });

    it("returns false for non-content keys", () => {
      expect(isContentKey("100")).toBe(false);
      expect(isContentKey("200")).toBe(false);
      expect(isContentKey("primary")).toBe(false);
      expect(isContentKey("surface")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isContentKey("")).toBe(false);
    });

    it("is case sensitive", () => {
      expect(isContentKey("Content")).toBe(false);
      expect(isContentKey("CONTENT")).toBe(false);
      expect(isContentKey("CoNtEnT")).toBe(false);
    });
  });

  describe("sortColorsWithContentFirst", () => {
    it("places 'content' first when it exists", () => {
      const entries: [string, string][] = [
        ["100", "color1"],
        ["200", "color2"],
        ["content", "contentColor"],
        ["300", "color3"],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result[0][0]).toBe("content");
      expect(result[0][1]).toBe("contentColor");
    });

    it("maintains order of non-content entries", () => {
      const entries: [string, number][] = [
        ["100", 1],
        ["200", 2],
        ["300", 3],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result).toEqual([
        ["100", 1],
        ["200", 2],
        ["300", 3],
      ]);
    });

    it("handles array with only content", () => {
      const entries: [string, string][] = [["content", "contentColor"]];

      const result = sortColorsWithContentFirst(entries);

      expect(result).toEqual([["content", "contentColor"]]);
    });

    it("handles empty array", () => {
      const entries: [string, string][] = [];

      const result = sortColorsWithContentFirst(entries);

      expect(result).toEqual([]);
    });

    it("handles content at the beginning", () => {
      const entries: [string, string][] = [
        ["content", "contentColor"],
        ["100", "color1"],
        ["200", "color2"],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result[0][0]).toBe("content");
    });

    it("handles content at the end", () => {
      const entries: [string, string][] = [
        ["100", "color1"],
        ["200", "color2"],
        ["content", "contentColor"],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result[0][0]).toBe("content");
    });

    it("works with different value types", () => {
      const entries: [string, { value: number }][] = [
        ["100", { value: 1 }],
        ["content", { value: 999 }],
        ["200", { value: 2 }],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result[0][0]).toBe("content");
      expect(result[0][1]).toEqual({ value: 999 });
    });

    it("handles multiple numeric keys correctly", () => {
      const entries: [string, string][] = [
        ["500", "color5"],
        ["100", "color1"],
        ["content", "contentColor"],
        ["300", "color3"],
        ["200", "color2"],
      ];

      const result = sortColorsWithContentFirst(entries);

      expect(result[0][0]).toBe("content");
      // Other entries maintain their relative order
      expect(result.slice(1).map(([key]) => key)).toEqual([
        "500",
        "100",
        "300",
        "200",
      ]);
    });
  });

  describe("getNumericVariantCount", () => {
    it("counts numeric keys correctly", () => {
      const keys = ["100", "200", "300", "400"];
      expect(getNumericVariantCount(keys)).toBe(4);
    });

    it("excludes 'content' key from count", () => {
      const keys = ["100", "200", "content", "300"];
      expect(getNumericVariantCount(keys)).toBe(3);
    });

    it("excludes non-numeric string keys", () => {
      const keys = ["100", "primary", "200", "secondary", "300"];
      expect(getNumericVariantCount(keys)).toBe(3);
    });

    it("returns 0 for empty array", () => {
      expect(getNumericVariantCount([])).toBe(0);
    });

    it("returns 0 when no numeric keys exist", () => {
      const keys = ["content", "primary", "secondary"];
      expect(getNumericVariantCount(keys)).toBe(0);
    });

    it("handles mixed numeric and non-numeric keys", () => {
      const keys = ["100", "content", "200", "sm", "300", "md"];
      expect(getNumericVariantCount(keys)).toBe(3);
    });

    it("counts string numbers correctly", () => {
      const keys = ["0", "1", "2", "10", "100"];
      expect(getNumericVariantCount(keys)).toBe(5);
    });

    it("handles negative numbers", () => {
      const keys = ["-100", "100", "200"];
      expect(getNumericVariantCount(keys)).toBe(3);
    });

    it("handles decimal numbers", () => {
      const keys = ["1.5", "2.5", "100"];
      expect(getNumericVariantCount(keys)).toBe(3);
    });

    it("excludes NaN-like strings", () => {
      const keys = ["100", "abc", "200", "xyz123"];
      expect(getNumericVariantCount(keys)).toBe(2);
    });
  });
});
