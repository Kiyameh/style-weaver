import type Color from "colorjs.io";
import type { CssRadiusValue } from "@/components/atoms/CssRadiusInput";
import type { CssShadowValue } from "@/components/atoms/CssShadowInput";

/**
 * Formats a CssRadiusValue object to a CSS string
 * @param radius - CssRadiusValue object
 * @returns CSS radius string (e.g., "0.5rem")
 */
export function formatRadiusValue(radius: CssRadiusValue): string {
  return `${radius.value}${radius.unit}`;
}

/**
 * Formats a CssShadowValue object to a CSS shadow string
 * @param shadow - CssShadowValue object
 * @returns CSS shadow string
 */
export function formatShadowValue(shadow: CssShadowValue): string {
  const parts: string[] = [];

  if (shadow.inset) parts.push("inset");
  parts.push(`${shadow.offsetX.value}${shadow.offsetX.unit}`);
  parts.push(`${shadow.offsetY.value}${shadow.offsetY.unit}`);

  if (shadow.blur) parts.push(`${shadow.blur.value}${shadow.blur.unit}`);
  if (shadow.spread) parts.push(`${shadow.spread.value}${shadow.spread.unit}`);

  // Convert color to oklch format
  const colorStr = formatColorToOklch(shadow.color);
  parts.push(colorStr);

  return parts.join(" ");
}

/**
 * Formats a Color object to an oklch CSS string
 * @param color - Color object
 * @returns oklch CSS string (e.g., "oklch(0.5 0.1 260)" or "oklch(0.5 0.1 260 / 0.8)")
 */
export function formatColorToOklch(color: Color): string {
  const [l, c, h] = color.oklch;
  const alpha = color.alpha;

  if (alpha < 1) {
    return `oklch(${l} ${c} ${h || 0} / ${alpha})`;
  }
  return `oklch(${l} ${c} ${h || 0})`;
}
