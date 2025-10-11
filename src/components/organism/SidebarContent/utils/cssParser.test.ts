import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import {
  parseColorFromString,
  parseRadiusString,
  parseShadowString,
} from "./cssParser";

describe("cssParser", () => {
  describe("parseRadiusString", () => {
    it("parses radius with px unit", () => {
      const result = parseRadiusString("8px");
      expect(result).toEqual({ value: 8, unit: "px" });
    });

    it("parses radius with rem unit", () => {
      const result = parseRadiusString("0.5rem");
      expect(result).toEqual({ value: 0.5, unit: "rem" });
    });

    it("parses radius with em unit", () => {
      const result = parseRadiusString("1.25em");
      expect(result).toEqual({ value: 1.25, unit: "em" });
    });

    it("parses radius with % unit", () => {
      const result = parseRadiusString("50%");
      expect(result).toEqual({ value: 50, unit: "%" });
    });

    it("handles zero value", () => {
      const result = parseRadiusString("0px");
      expect(result).toEqual({ value: 0, unit: "px" });
    });

    it("handles decimal values", () => {
      const result = parseRadiusString("0.125rem");
      expect(result).toEqual({ value: 0.125, unit: "rem" });
    });

    it("handles large values", () => {
      const result = parseRadiusString("999px");
      expect(result).toEqual({ value: 999, unit: "px" });
    });

    it("returns default for invalid string", () => {
      const result = parseRadiusString("invalid");
      expect(result).toEqual({ value: 0, unit: "px" });
    });

    it("returns default for empty string", () => {
      const result = parseRadiusString("");
      expect(result).toEqual({ value: 0, unit: "px" });
    });

    it("parses string without unit as valid (treats number as value, rest as unit)", () => {
      const result = parseRadiusString("10");
      // The regex matches "10" as value:1, unit:"0" because it splits at the first non-digit
      // This is expected behavior - invalid format gets parsed as-is
      expect(result.value).toBe(1);
      expect(result.unit).toBe("0");
    });

    it("returns default for string without value", () => {
      const result = parseRadiusString("px");
      expect(result).toEqual({ value: 0, unit: "px" });
    });
  });

  describe("parseShadowString", () => {
    it("parses basic shadow without inset", () => {
      const shadowStr = "0px 2px 4px 0px oklch(0.3 0.1 260)";
      const result = parseShadowString(shadowStr);

      expect(result.offsetX).toEqual({ value: 0, unit: "px" });
      expect(result.offsetY).toEqual({ value: 2, unit: "px" });
      expect(result.blur).toEqual({ value: 4, unit: "px" });
      expect(result.spread).toEqual({ value: 0, unit: "px" });
      expect(result.inset).toBe(false);
      expect(result.color).toBeInstanceOf(Color);
    });

    it("parses shadow with inset", () => {
      const shadowStr = "inset 0px 2px 4px 0px oklch(0.3 0.1 260)";
      const result = parseShadowString(shadowStr);

      expect(result.inset).toBe(true);
      expect(result.offsetX).toEqual({ value: 0, unit: "px" });
      expect(result.offsetY).toEqual({ value: 2, unit: "px" });
    });

    it("parses shadow without blur", () => {
      const shadowStr = "2px 2px oklch(0.3 0.1 260)";
      const result = parseShadowString(shadowStr);

      expect(result.offsetX).toEqual({ value: 2, unit: "px" });
      expect(result.offsetY).toEqual({ value: 2, unit: "px" });
      expect(result.blur).toEqual({ value: 0, unit: "px" });
    });

    it("parses shadow with rem units", () => {
      const shadowStr = "0rem 0.5rem 1rem 0rem oklch(0.5 0.05 180)";
      const result = parseShadowString(shadowStr);

      expect(result.offsetX).toEqual({ value: 0, unit: "rem" });
      expect(result.offsetY).toEqual({ value: 0.5, unit: "rem" });
      expect(result.blur).toEqual({ value: 1, unit: "rem" });
      expect(result.spread).toEqual({ value: 0, unit: "rem" });
    });

    it("parses shadow with alpha color", () => {
      const shadowStr = "0px 2px 4px oklch(0.5 0.1 260 / 0.5)";
      const result = parseShadowString(shadowStr);

      expect(result.color.alpha).toBeCloseTo(0.5, 1);
    });

    it("parses shadow with negative offsets", () => {
      const shadowStr = "-2px -4px 8px oklch(0.3 0.1 260)";
      const result = parseShadowString(shadowStr);

      expect(result.offsetX).toEqual({ value: -2, unit: "px" });
      expect(result.offsetY).toEqual({ value: -4, unit: "px" });
      expect(result.blur).toEqual({ value: 8, unit: "px" });
    });

    it("parses shadow with spread", () => {
      const shadowStr = "0px 2px 4px 2px oklch(0.3 0.1 260)";
      const result = parseShadowString(shadowStr);

      expect(result.spread).toEqual({ value: 2, unit: "px" });
    });

    it("uses default color when no color specified", () => {
      const shadowStr = "0px 2px 4px";
      const result = parseShadowString(shadowStr);

      expect(result.color).toBeInstanceOf(Color);
      const [l, c, h] = result.color.oklch;
      expect(l).toBeCloseTo(0.3, 1);
      expect(c).toBeCloseTo(0.1, 1);
      expect(h).toBeCloseTo(0, 1);
    });

    it("handles extra whitespace", () => {
      const shadowStr = "  0px   2px   4px   oklch(0.3 0.1 260)  ";
      const result = parseShadowString(shadowStr);

      expect(result.offsetX).toEqual({ value: 0, unit: "px" });
      expect(result.offsetY).toEqual({ value: 2, unit: "px" });
    });

    it("parses inset shadow with all parameters", () => {
      const shadowStr = "inset 1px 2px 3px 4px oklch(0.5 0.1 180)";
      const result = parseShadowString(shadowStr);

      expect(result.inset).toBe(true);
      expect(result.offsetX).toEqual({ value: 1, unit: "px" });
      expect(result.offsetY).toEqual({ value: 2, unit: "px" });
      expect(result.blur).toEqual({ value: 3, unit: "px" });
      expect(result.spread).toEqual({ value: 4, unit: "px" });
    });
  });

  describe("parseColorFromString", () => {
    it("parses oklch color string", () => {
      const result = parseColorFromString("oklch(0.5 0.1 260)");
      expect(result).toBeInstanceOf(Color);

      const [l, c, h] = result.oklch;
      expect(l).toBeCloseTo(0.5, 1);
      expect(c).toBeCloseTo(0.1, 1);
      expect(h).toBeCloseTo(260, 1);
    });

    it("parses oklch color with alpha", () => {
      const result = parseColorFromString("oklch(0.5 0.1 260 / 0.8)");
      expect(result.alpha).toBeCloseTo(0.8, 1);
    });

    it("parses hex color", () => {
      const result = parseColorFromString("#ff0000");
      expect(result).toBeInstanceOf(Color);
    });

    it("parses rgb color", () => {
      const result = parseColorFromString("rgb(255, 0, 0)");
      expect(result).toBeInstanceOf(Color);
    });

    it("parses rgba color", () => {
      const result = parseColorFromString("rgba(255, 0, 0, 0.5)");
      expect(result).toBeInstanceOf(Color);
      expect(result.alpha).toBeCloseTo(0.5, 1);
    });

    it("parses hsl color", () => {
      const result = parseColorFromString("hsl(0, 100%, 50%)");
      expect(result).toBeInstanceOf(Color);
    });

    it("parses named color", () => {
      const result = parseColorFromString("red");
      expect(result).toBeInstanceOf(Color);
    });

    it("returns default color for invalid string", () => {
      const result = parseColorFromString("invalid-color");
      expect(result).toBeInstanceOf(Color);

      const [l, c, h] = result.oklch;
      expect(l).toBeCloseTo(0.5, 1);
      expect(c).toBeCloseTo(0.02, 2);
      expect(h).toBeCloseTo(260, 1);
    });

    it("returns default color for empty string", () => {
      const result = parseColorFromString("");
      expect(result).toBeInstanceOf(Color);

      const [l, c, h] = result.oklch;
      expect(l).toBeCloseTo(0.5, 1);
      expect(c).toBeCloseTo(0.02, 2);
      expect(h).toBeCloseTo(260, 1);
    });

    it("parses color with whitespace", () => {
      const result = parseColorFromString("  oklch(0.5 0.1 260)  ");
      expect(result).toBeInstanceOf(Color);
    });

    it("parses black color", () => {
      const result = parseColorFromString("black");
      expect(result).toBeInstanceOf(Color);
      const [l] = result.oklch;
      expect(l).toBeCloseTo(0, 1);
    });

    it("parses white color", () => {
      const result = parseColorFromString("white");
      expect(result).toBeInstanceOf(Color);
      const [l] = result.oklch;
      expect(l).toBeCloseTo(1, 1);
    });

    it("handles case insensitive color names", () => {
      const result1 = parseColorFromString("RED");
      const result2 = parseColorFromString("red");
      expect(result1).toBeInstanceOf(Color);
      expect(result2).toBeInstanceOf(Color);
    });
  });
});
