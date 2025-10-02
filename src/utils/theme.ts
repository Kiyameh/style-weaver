import type { Theme } from "@/types/Theme";

export const generateCssVariables = (theme: Theme): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Add color variables
  Object.entries(theme.colors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      cssVars[`--${colorName}-${stackName}`] = color.toString();
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
};

export const generateCssCode = (theme: Theme): string => {
  const cssVars: string[] = [];

  // Add color variables
  Object.entries(theme.colors).forEach(([colorName, colorStack]) => {
    Object.entries(colorStack).forEach(([stackName, color]) => {
      cssVars.push(`  --${colorName}-${stackName}: ${color.toString()};`);
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
};
