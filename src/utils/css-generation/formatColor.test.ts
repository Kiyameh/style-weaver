import Color from "colorjs.io";
import { describe, expect, it } from "vitest";
import { formatColorForCSS } from "./formatColor";

describe("formatColorForCSS", () => {
  it("formats OKLCH color with decimal values", () => {
    const color = new Color("oklch", [1.0, 0, 0]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(1 0 0)");
  });

  it("formats OKLCH color with chroma and hue values", () => {
    const color = new Color("oklch", [0.8, 0.1, 260]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(0.8 0.1 260)");
  });

  it("handles undefined hue by defaulting to 0", () => {
    // @ts-expect-error
    const color = new Color("oklch", [0.5, 0.02, undefined]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(0.5 0.02 0)");
  });

  it("handles NaN hue by defaulting to 0", () => {
    const color = new Color("oklch", [0.5, 0.02, NaN]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(0.5 0.02 0)");
  });

  it("preserves decimal precision", () => {
    const color = new Color("oklch", [0.123456, 0.987654, 123.456]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(0.123456 0.987654 123.456)");
  });

  it("handles zero values correctly", () => {
    const color = new Color("oklch", [0, 0, 0]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(0 0 0)");
  });

  it("handles maximum lightness value", () => {
    const color = new Color("oklch", [1, 0.5, 360]);
    const result = formatColorForCSS(color);

    expect(result).toBe("oklch(1 0.5 360)");
  });
});
