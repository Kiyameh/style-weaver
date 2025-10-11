import type Color from "colorjs.io";
import type { Theme } from "@/types/Theme";
import { formatColorForCSS } from "./formatColor";

/**
 * Generates CSS custom properties (variables) from a theme as a key-value object
 * @param theme - Theme object to generate variables from
 * @returns Object with CSS variable names as keys and their values as strings
 */
export function generateCssVariables(theme: Theme): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Add main color variables
  Object.entries(theme.mainColors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      cssVars[`--${colorName}-${stackName}`] = formatColorForCSS(color as Color);
    });
  });

  // Add brand color variables
  Object.entries(theme.brandColors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      cssVars[`--${colorName}-${stackName}`] = formatColorForCSS(color as Color);
    });
  });

  // Add radius variables
  Object.entries(theme.radius).forEach(([name, value]) => {
    cssVars[`--radius-${name}`] = value;
  });

  // Add shadow variables
  Object.entries(theme.shadows).forEach(([name, value]) => {
    cssVars[`--shadow-${name}`] = value;
  });

  return cssVars;
}
