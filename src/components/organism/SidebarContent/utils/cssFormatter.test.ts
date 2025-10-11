import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import type { CssRadiusValue } from "@/components/atoms/CssRadiusInput";
import type { CssShadowValue } from "@/components/atoms/CssShadowInput";
import {
  formatColorToOklch,
  formatRadiusValue,
  formatShadowValue,
} from "./cssFormatter";

describe("cssFormatter", () => {
  describe("formatRadiusValue", () => {
    it("formats radius with px unit", () => {
      const radius: CssRadiusValue = { value: 8, unit: "px" };
      expect(formatRadiusValue(radius)).toBe("8px");
    });

    it("formats radius with rem unit", () => {
      const radius: CssRadiusValue = { value: 0.5, unit: "rem" };
      expect(formatRadiusValue(radius)).toBe("0.5rem");
    });

    it("formats radius with em unit", () => {
      const radius: CssRadiusValue = { value: 1.25, unit: "em" };
      expect(formatRadiusValue(radius)).toBe("1.25em");
    });

    it("formats radius with % unit", () => {
      const radius: CssRadiusValue = { value: 50, unit: "%" };
      expect(formatRadiusValue(radius)).toBe("50%");
    });

    it("handles zero value", () => {
      const radius: CssRadiusValue = { value: 0, unit: "px" };
      expect(formatRadiusValue(radius)).toBe("0px");
    });

    it("handles decimal values", () => {
      const radius: CssRadiusValue = { value: 0.125, unit: "rem" };
      expect(formatRadiusValue(radius)).toBe("0.125rem");
    });

    it("handles large values", () => {
      const radius: CssRadiusValue = { value: 999, unit: "px" };
      expect(formatRadiusValue(radius)).toBe("999px");
    });
  });

  describe("formatShadowValue", () => {
    it("formats basic shadow without inset", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: 0, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 0, unit: "px" },
        color: new Color("oklch", [0.3, 0.1, 260]),
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("0px 2px 4px 0px");
      expect(result).toContain("oklch");
      expect(result).not.toContain("inset");
    });

    it("formats shadow with inset", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: 0, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 0, unit: "px" },
        color: new Color("oklch", [0.3, 0.1, 260]),
        inset: true,
      };

      const result = formatShadowValue(shadow);
      expect(result).toMatch(/^inset /);
    });

    it("formats shadow without blur", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: undefined,
        spread: undefined,
        color: new Color("oklch", [0.3, 0.1, 260]),
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("2px 2px");
      expect(result).toContain("oklch");
    });

    it("formats shadow with rem units", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: 0, unit: "rem" },
        offsetY: { value: 0.5, unit: "rem" },
        blur: { value: 1, unit: "rem" },
        spread: { value: 0, unit: "rem" },
        color: new Color("oklch", [0.5, 0.05, 180]),
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("0rem 0.5rem 1rem 0rem");
    });

    it("formats shadow with alpha color", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      color.alpha = 0.5;

      const shadow: CssShadowValue = {
        offsetX: { value: 0, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 0, unit: "px" },
        color: color,
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("/ 0.5");
    });

    it("formats shadow with negative offsets", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: -2, unit: "px" },
        offsetY: { value: -4, unit: "px" },
        blur: { value: 8, unit: "px" },
        spread: { value: 0, unit: "px" },
        color: new Color("oklch", [0.3, 0.1, 260]),
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("-2px -4px");
    });

    it("formats shadow with spread", () => {
      const shadow: CssShadowValue = {
        offsetX: { value: 0, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 2, unit: "px" },
        color: new Color("oklch", [0.3, 0.1, 260]),
        inset: false,
      };

      const result = formatShadowValue(shadow);
      expect(result).toContain("0px 2px 4px 2px");
    });
  });

  describe("formatColorToOklch", () => {
    it("formats color without alpha", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      const result = formatColorToOklch(color);

      expect(result).toBe("oklch(0.5 0.1 260)");
    });

    it("formats color with alpha < 1", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      color.alpha = 0.8;

      const result = formatColorToOklch(color);
      expect(result).toBe("oklch(0.5 0.1 260 / 0.8)");
    });

    it("formats color with alpha = 1", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      color.alpha = 1;

      const result = formatColorToOklch(color);
      expect(result).toBe("oklch(0.5 0.1 260)");
    });

    it("formats color with alpha = 0", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      color.alpha = 0;

      const result = formatColorToOklch(color);
      expect(result).toBe("oklch(0.5 0.1 260 / 0)");
    });

    it("handles undefined hue (achromatic colors)", () => {
      const color = new Color("oklch", [0.5, 0, 0]);
      const result = formatColorToOklch(color);

      expect(result).toContain("oklch(0.5 0 0)");
    });

    it("formats black color", () => {
      const color = new Color("oklch", [0, 0, 0]);
      const result = formatColorToOklch(color);

      expect(result).toBe("oklch(0 0 0)");
    });

    it("formats white color", () => {
      const color = new Color("oklch", [1, 0, 0]);
      const result = formatColorToOklch(color);

      expect(result).toBe("oklch(1 0 0)");
    });

    it("formats color with high chroma", () => {
      const color = new Color("oklch", [0.7, 0.3, 120]);
      const result = formatColorToOklch(color);

      expect(result).toBe("oklch(0.7 0.3 120)");
    });

    it("formats color with decimal alpha", () => {
      const color = new Color("oklch", [0.5, 0.1, 260]);
      color.alpha = 0.123;

      const result = formatColorToOklch(color);
      expect(result).toBe("oklch(0.5 0.1 260 / 0.123)");
    });

    it("handles hue values across full range", () => {
      const color1 = new Color("oklch", [0.5, 0.1, 0]);
      expect(formatColorToOklch(color1)).toBe("oklch(0.5 0.1 0)");

      const color2 = new Color("oklch", [0.5, 0.1, 180]);
      expect(formatColorToOklch(color2)).toBe("oklch(0.5 0.1 180)");

      const color3 = new Color("oklch", [0.5, 0.1, 360]);
      expect(formatColorToOklch(color3)).toContain("oklch(0.5 0.1");
    });
  });
});
