import { describe, expect, it } from "vitest";
import { SIZE_KEYS, generateNextKey, getNextSizeKey } from "./keyGeneration";

describe("keyGeneration", () => {
  describe("SIZE_KEYS", () => {
    it("contains expected size keys", () => {
      expect(SIZE_KEYS).toEqual([
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
      ]);
    });

    it("has correct length", () => {
      expect(SIZE_KEYS).toHaveLength(10);
    });
  });

  describe("getNextSizeKey", () => {
    it("returns next key in sequence for sm", () => {
      expect(getNextSizeKey("sm")).toBe("md");
    });

    it("returns next key in sequence for md", () => {
      expect(getNextSizeKey("md")).toBe("lg");
    });

    it("returns next key in sequence for lg", () => {
      expect(getNextSizeKey("lg")).toBe("xl");
    });

    it("returns next key in sequence for xl", () => {
      expect(getNextSizeKey("xl")).toBe("2xl");
    });

    it("returns next key in sequence for 2xl", () => {
      expect(getNextSizeKey("2xl")).toBe("3xl");
    });

    it("returns next key in sequence for 6xl", () => {
      expect(getNextSizeKey("6xl")).toBe("7xl");
    });

    it("returns 8xl when last key is 7xl (end of predefined)", () => {
      expect(getNextSizeKey("7xl")).toBe("8xl");
    });

    it("increments numeric xl keys beyond predefined", () => {
      expect(getNextSizeKey("8xl")).toBe("9xl");
      expect(getNextSizeKey("9xl")).toBe("10xl");
      expect(getNextSizeKey("10xl")).toBe("11xl");
    });

    it("handles large numeric xl keys", () => {
      expect(getNextSizeKey("99xl")).toBe("100xl");
      expect(getNextSizeKey("999xl")).toBe("1000xl");
    });

    it("returns 8xl for unknown key", () => {
      expect(getNextSizeKey("unknown")).toBe("8xl");
    });

    it("returns 8xl for empty string", () => {
      expect(getNextSizeKey("")).toBe("8xl");
    });

    it("works with custom size keys array", () => {
      const customKeys = ["xs", "s", "m", "l", "xl"];
      expect(getNextSizeKey("xs", customKeys)).toBe("s");
      expect(getNextSizeKey("s", customKeys)).toBe("m");
      expect(getNextSizeKey("m", customKeys)).toBe("l");
      expect(getNextSizeKey("l", customKeys)).toBe("xl");
    });

    it("returns 8xl when custom key is last in custom array", () => {
      const customKeys = ["xs", "s", "m"];
      expect(getNextSizeKey("m", customKeys)).toBe("8xl");
    });

    it("handles single element custom array", () => {
      const customKeys = ["only"];
      expect(getNextSizeKey("only", customKeys)).toBe("8xl");
    });

    it("handles empty custom array", () => {
      const customKeys: string[] = [];
      expect(getNextSizeKey("sm", customKeys)).toBe("8xl");
    });
  });

  describe("generateNextKey", () => {
    it("returns 'sm' for empty array", () => {
      expect(generateNextKey([])).toBe("sm");
    });

    it("returns next key based on last key in array", () => {
      expect(generateNextKey(["sm"])).toBe("md");
      expect(generateNextKey(["sm", "md"])).toBe("lg");
      expect(generateNextKey(["sm", "md", "lg"])).toBe("xl");
    });

    it("handles progression through all predefined keys", () => {
      const keys = ["sm"];
      expect(generateNextKey(keys)).toBe("md");

      keys.push("md");
      expect(generateNextKey(keys)).toBe("lg");

      keys.push("lg");
      expect(generateNextKey(keys)).toBe("xl");

      keys.push("xl");
      expect(generateNextKey(keys)).toBe("2xl");

      keys.push("2xl");
      expect(generateNextKey(keys)).toBe("3xl");
    });

    it("generates 8xl after 7xl", () => {
      const keys = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"];
      expect(generateNextKey(keys)).toBe("8xl");
    });

    it("increments numeric xl keys", () => {
      expect(generateNextKey(["sm", "md", "8xl"])).toBe("9xl");
      expect(generateNextKey(["sm", "md", "9xl"])).toBe("10xl");
      expect(generateNextKey(["sm", "md", "10xl"])).toBe("11xl");
    });

    it("only considers last key in array", () => {
      // Even if array is out of order, only last key matters
      expect(generateNextKey(["lg", "sm", "md"])).toBe("lg");
      expect(generateNextKey(["xl", "2xl", "sm"])).toBe("md");
    });

    it("works with custom size keys", () => {
      const customKeys = ["xs", "s", "m", "l"];
      expect(generateNextKey([], customKeys)).toBe("sm");
      expect(generateNextKey(["xs"], customKeys)).toBe("s");
      expect(generateNextKey(["xs", "s"], customKeys)).toBe("m");
    });

    it("handles single element array", () => {
      expect(generateNextKey(["sm"])).toBe("md");
      expect(generateNextKey(["7xl"])).toBe("8xl");
      expect(generateNextKey(["10xl"])).toBe("11xl");
    });

    it("handles array with unknown last key", () => {
      expect(generateNextKey(["unknown"])).toBe("8xl");
      expect(generateNextKey(["sm", "md", "custom"])).toBe("8xl");
    });

    it("handles large numeric keys", () => {
      expect(generateNextKey(["99xl"])).toBe("100xl");
      expect(generateNextKey(["sm", "md", "lg", "999xl"])).toBe("1000xl");
    });

    it("handles mixed valid and invalid keys", () => {
      // Last key is what matters
      expect(generateNextKey(["invalid", "sm"])).toBe("md");
      expect(generateNextKey(["sm", "invalid"])).toBe("8xl");
    });
  });
});
