import type Color from "colorjs.io";

/**
 * Formats a Color object for CSS output in OKLCH format with alpha support
 * @param color - Color object to format
 * @returns Formatted color string for CSS in OKLCH format
 */
export function formatColorForCSS(color: Color): string {
  const [l, c, h] = color.oklch;
  const alpha = color.alpha;
  
  // Include alpha only if it's not 1 (fully opaque)
  if (alpha !== undefined && alpha < 1) {
    return `oklch(${l} ${c} ${h || 0} / ${alpha})`;
  }
  
  return `oklch(${l} ${c} ${h || 0})`;
}
