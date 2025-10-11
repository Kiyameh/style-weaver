import Color from "colorjs.io";
import type { CssRadiusValue } from "@/components/atoms/CssRadiusInput";
import type { CssShadowValue } from "@/components/atoms/CssShadowInput";

/**
 * Parses a CSS radius string to a CssRadiusValue object
 * @param radiusStr - CSS radius string (e.g., "0.5rem", "8px")
 * @returns CssRadiusValue object with value and unit
 */
export function parseRadiusString(radiusStr: string): CssRadiusValue {
  const match = radiusStr.match(/^([\d.]+)(\w+|%)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] as "px" | "rem" | "em" | "%",
    };
  }
  return { value: 0, unit: "px" };
}

/**
 * Parses a value string with unit to an object
 * @param str - String with value and unit (e.g., "10px", "1rem")
 * @returns Object with value and unit
 */
function parseValueWithUnit(str: string): {
  value: number;
  unit: "px" | "rem" | "em" | "%";
} {
  const match = str.match(/^([\d.-]+)(\w+|%)$/);
  if (match) {
    const unit = match[2];
    // Validate unit
    if (unit === "px" || unit === "rem" || unit === "em" || unit === "%") {
      return {
        value: parseFloat(match[1]),
        unit: unit,
      };
    }
  }
  return { value: 0, unit: "px" };
}

/**
 * Parses a CSS shadow string to a CssShadowValue object
 * @param shadowStr - CSS shadow string (e.g., "0 2px 4px oklch(0 0 0 / 0.1)")
 * @returns CssShadowValue object
 */
export function parseShadowString(shadowStr: string): CssShadowValue {
  const parts = shadowStr.trim().split(/\s+/);
  const isInset = parts[0] === "inset";
  const offset = isInset ? 1 : 0;

  // Extract color (oklch format)
  const colorMatch = shadowStr.match(/(oklch\([^)]+\))/);
  const color = colorMatch
    ? new Color(colorMatch[1])
    : new Color("oklch", [0.3, 0.1, 0]);

  return {
    offsetX: parseValueWithUnit(parts[offset]),
    offsetY: parseValueWithUnit(parts[offset + 1]),
    blur: parts[offset + 2]
      ? parseValueWithUnit(parts[offset + 2])
      : { value: 0, unit: "px" },
    spread:
      parts[offset + 3] && !parts[offset + 3].includes("oklch")
        ? parseValueWithUnit(parts[offset + 3])
        : { value: 0, unit: "px" },
    color,
    inset: isInset,
  };
}

/**
 * Parses a color string to a Color object
 * @param colorStr - Color string in any CSS format
 * @returns Color object
 */
export function parseColorFromString(colorStr: string): Color {
  try {
    return new Color(colorStr);
  } catch {
    return new Color("oklch", [0.5, 0.02, 260]);
  }
}
