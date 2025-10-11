import { describe, expect, it } from "vitest";
import {
  calculateVariantDiff,
  getKeysToRemove,
  isValidVariantCount,
} from "./variantManagement";

describe("variantManagement", () => {
  describe("getKeysToRemove", () => {
    it("returns keys to remove when reducing count", () => {
      const keys = ["sm", "md", "lg", "xl", "2xl"];
      const result = getKeysToRemove(keys, 3);

      expect(result).toEqual(["xl", "2xl"]);
    });

    it("returns empty array when target equals current count", () => {
      const keys = ["sm", "md", "lg"];
      const result = getKeysToRemove(keys, 3);

      expect(result).toEqual([]);
    });

    it("returns empty array when target is greater than current count", () => {
      const keys = ["sm", "md"];
      const result = getKeysToRemove(keys, 5);

      expect(result).toEqual([]);
    });

    it("returns all keys when target is 0", () => {
      const keys = ["sm", "md", "lg"];
      const result = getKeysToRemove(keys, 0);

      expect(result).toEqual(["sm", "md", "lg"]);
    });

    it("returns last key when reducing by 1", () => {
      const keys = ["sm", "md", "lg"];
      const result = getKeysToRemove(keys, 2);

      expect(result).toEqual(["lg"]);
    });

    it("handles single element array", () => {
      const keys = ["sm"];
      const result = getKeysToRemove(keys, 0);

      expect(result).toEqual(["sm"]);
    });

    it("handles empty array", () => {
      const keys: string[] = [];
      const result = getKeysToRemove(keys, 0);

      expect(result).toEqual([]);
    });

    it("preserves order of keys to remove", () => {
      const keys = ["a", "b", "c", "d", "e"];
      const result = getKeysToRemove(keys, 2);

      expect(result).toEqual(["c", "d", "e"]);
    });

    it("handles numeric keys", () => {
      const keys = ["100", "200", "300", "400"];
      const result = getKeysToRemove(keys, 2);

      expect(result).toEqual(["300", "400"]);
    });

    it("handles negative target count", () => {
      const keys = ["sm", "md", "lg"];
      const result = getKeysToRemove(keys, -1);

      // slice(-1) returns the last element, not all elements
      expect(result).toEqual(["lg"]);
    });
  });

  describe("calculateVariantDiff", () => {
    it("returns positive difference when adding variants", () => {
      expect(calculateVariantDiff(3, 5)).toBe(2);
    });

    it("returns negative difference when removing variants", () => {
      expect(calculateVariantDiff(5, 3)).toBe(-2);
    });

    it("returns 0 when counts are equal", () => {
      expect(calculateVariantDiff(5, 5)).toBe(0);
    });

    it("handles adding single variant", () => {
      expect(calculateVariantDiff(3, 4)).toBe(1);
    });

    it("handles removing single variant", () => {
      expect(calculateVariantDiff(4, 3)).toBe(-1);
    });

    it("handles large differences", () => {
      expect(calculateVariantDiff(1, 10)).toBe(9);
      expect(calculateVariantDiff(10, 1)).toBe(-9);
    });

    it("handles zero current count", () => {
      expect(calculateVariantDiff(0, 5)).toBe(5);
    });

    it("handles zero target count", () => {
      expect(calculateVariantDiff(5, 0)).toBe(-5);
    });

    it("handles both zero", () => {
      expect(calculateVariantDiff(0, 0)).toBe(0);
    });

    it("handles negative current count", () => {
      expect(calculateVariantDiff(-2, 3)).toBe(5);
    });

    it("handles negative target count", () => {
      expect(calculateVariantDiff(3, -2)).toBe(-5);
    });
  });

  describe("isValidVariantCount", () => {
    it("returns true for count within default range (1-10)", () => {
      expect(isValidVariantCount(1)).toBe(true);
      expect(isValidVariantCount(5)).toBe(true);
      expect(isValidVariantCount(10)).toBe(true);
    });

    it("returns false for count below minimum", () => {
      expect(isValidVariantCount(0)).toBe(false);
      expect(isValidVariantCount(-1)).toBe(false);
    });

    it("returns false for count above maximum", () => {
      expect(isValidVariantCount(11)).toBe(false);
      expect(isValidVariantCount(100)).toBe(false);
    });

    it("returns true for minimum boundary", () => {
      expect(isValidVariantCount(1)).toBe(true);
    });

    it("returns true for maximum boundary", () => {
      expect(isValidVariantCount(10)).toBe(true);
    });

    it("works with custom max and min", () => {
      expect(isValidVariantCount(5, 20, 1)).toBe(true);
      expect(isValidVariantCount(15, 20, 1)).toBe(true);
      expect(isValidVariantCount(20, 20, 1)).toBe(true);
    });

    it("returns false when below custom minimum", () => {
      expect(isValidVariantCount(2, 10, 3)).toBe(false);
      expect(isValidVariantCount(0, 10, 5)).toBe(false);
    });

    it("returns false when above custom maximum", () => {
      expect(isValidVariantCount(6, 5, 1)).toBe(false);
      expect(isValidVariantCount(100, 50, 1)).toBe(false);
    });

    it("handles custom range boundaries", () => {
      expect(isValidVariantCount(5, 10, 5)).toBe(true);
      expect(isValidVariantCount(10, 10, 5)).toBe(true);
      expect(isValidVariantCount(4, 10, 5)).toBe(false);
      expect(isValidVariantCount(11, 10, 5)).toBe(false);
    });

    it("handles single valid value (min equals max)", () => {
      expect(isValidVariantCount(5, 5, 5)).toBe(true);
      expect(isValidVariantCount(4, 5, 5)).toBe(false);
      expect(isValidVariantCount(6, 5, 5)).toBe(false);
    });

    it("handles zero as valid count with custom range", () => {
      expect(isValidVariantCount(0, 10, 0)).toBe(true);
    });

    it("handles negative numbers in custom range", () => {
      expect(isValidVariantCount(-5, 0, -10)).toBe(true);
      expect(isValidVariantCount(-11, 0, -10)).toBe(false);
    });

    it("handles large numbers", () => {
      expect(isValidVariantCount(500, 1000, 1)).toBe(true);
      expect(isValidVariantCount(1001, 1000, 1)).toBe(false);
    });

    it("returns false when min > max (invalid range)", () => {
      // This is an edge case - the function doesn't validate the range itself
      expect(isValidVariantCount(5, 1, 10)).toBe(false);
    });
  });
});
