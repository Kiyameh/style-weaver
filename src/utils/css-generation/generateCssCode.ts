import type Color from "colorjs.io";
import type { Theme } from "@/types/Theme";
import { formatColorForCSS } from "./formatColor";

/**
 * Generates complete CSS code with custom properties from a theme
 * @param theme - Theme object to generate CSS from
 * @returns Complete CSS code as a string with comments and :root selector
 */
export function generateCssCode(theme: Theme): string {
  const cssVars: string[] = [];

  // Add main color variables
  Object.entries(theme.mainColors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      const colorValue = formatColorForCSS(color as Color);
      cssVars.push(`  --${colorName}-${stackName}: ${colorValue};`);
    });
  });

  // Add brand color variables
  Object.entries(theme.brandColors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      const colorValue = formatColorForCSS(color as Color);
      cssVars.push(`  --${colorName}-${stackName}: ${colorValue};`);
    });
  });

  // Add radius variables
  Object.entries(theme.radius).forEach(([name, value]) => {
    cssVars.push(`  --radius-${name}: ${value};`);
  });

  // Add shadow variables
  Object.entries(theme.shadows).forEach(([name, value]) => {
    cssVars.push(`  --shadow-${name}: ${value};`);
  });

  // Build the complete CSS code with comments
  const cssCode = `/*
 * Tema: ${theme.name}
 * Descripción: ${theme.description}
 * Modo de color: ${theme.colorMode || "no definido"}
 */

:root {
${cssVars.join("\n")}
}

/* Generado con StyleWeaver */`;

  return cssCode;
}
