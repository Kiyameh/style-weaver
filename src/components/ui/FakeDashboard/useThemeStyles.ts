import type Color from "colorjs.io";
import { useMemo } from "react";
import type { Theme } from "@/types/Theme";

/**
 * Hook que genera las variables CSS dinámicamente desde el tema actual
 * @param theme - Tema actual
 * @returns Objeto con las variables CSS como propiedades CSS-in-JS
 */
export function useThemeStyles(theme: Theme | null) {
  return useMemo(() => {
    if (!theme) return {};

    const styles: Record<string, string> = {};

    // Main Colors
    for (const [groupName, colorGroup] of Object.entries(theme.mainColors)) {
      for (const [variant, color] of Object.entries(colorGroup)) {
        const colorObj = color as Color;
        const cssValue = colorObj.toString({ format: "css" });
        styles[`--${groupName}-${variant}`] = cssValue;
      }
    }

    // Brand Colors
    for (const [groupName, colorGroup] of Object.entries(theme.brandColors)) {
      for (const [variant, color] of Object.entries(colorGroup)) {
        const colorObj = color as Color;
        const cssValue = colorObj.toString({ format: "css" });
        styles[`--${groupName}-${variant}`] = cssValue;
      }
    }

    // Radius
    for (const [size, value] of Object.entries(theme.radius)) {
      styles[`--radius-${size}`] = value;
    }

    // Shadows
    for (const [size, value] of Object.entries(theme.shadows)) {
      styles[`--shadow-${size}`] = value;
    }

    return styles;
  }, [theme]);
}
