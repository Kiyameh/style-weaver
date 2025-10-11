import type Color from "colorjs.io";

/**
 * Formats a Color object for CSS output in OKLCH format with decimal values
 * @param color - Color object to format
 * @returns Formatted color string for CSS
 */
export function formatColorForCSS(color: Color): string {
  const [l, c, h] = color.oklch;
  return `oklch(${l} ${c} ${h || 0})`;
}
