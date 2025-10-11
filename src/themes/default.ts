import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

const DEFAULT_THEME: Theme = {
  name: "Default theme",
  description: "Tema por defecto",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.97, 0.011, 259]),
      300: new Color("oklch", [0.93, 0.016, 262]),
      400: new Color("oklch", [0.85, 0.021, 264]),
      500: new Color("oklch", [0.82, 0.029, 266]),
    },
    content: {
      100: new Color("oklch", [0.85, 0.053, 255]),
      200: new Color("oklch", [0.62, 0.053, 255]),
      300: new Color("oklch", [0.42, 0.053, 255]),
      400: new Color("oklch", [0.38, 0.053, 255]),
      500: new Color("oklch", [0.28, 0.053, 255]),
    },
    border: {
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
      300: new Color("oklch", [0.42, 0.027, 268]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.93, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.31, 252]),
      200: new Color("oklch", [0.63, 0.2, 252]),
      300: new Color("oklch", [0.42, 0.2, 252]),
    },
    secondary: {
      content: new Color("oklch", [0.93, 0.016, 262]),
      100: new Color("oklch", [0.86, 0.09, 212]),
      200: new Color("oklch", [0.72, 0.09, 212]),
      300: new Color("oklch", [0.58, 0.09, 212]),
    },
    accent: {
      content: new Color("oklch", [0.93, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.25, 9]),
      200: new Color("oklch", [0.64, 0.25, 9]),
      300: new Color("oklch", [0.42, 0.25, 9]),
    },
    neutral: {
      content: new Color("oklch", [0.42, 0.027, 268]),
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
      300: new Color("oklch", [0.42, 0.027, 268]),
    },
    info: {
      content: new Color("oklch", [0.3, 0.02, 200]),
      100: new Color("oklch", [0.8, 0.2, 200]),
    },
    success: {
      content: new Color("oklch", [0.3, 0.02, 166]),
      100: new Color("oklch", [0.8, 0.2, 166]),
    },
    warning: {
      content: new Color("oklch", [0.3, 0.02, 95]),
      100: new Color("oklch", [0.8, 0.2, 95]),
    },
    error: {
      content: new Color("oklch", [0.3, 0.02, 28]),
      100: new Color("oklch", [0.8, 0.2, 28]),
    },
  },
  radius: {
    s: "0.25rem",
    m: "0.5rem",
    l: "1rem",
    xl: "1.5rem",
  },
  shadows: {
    s: "0 0 0.5rem 0px oklch(0, 0, 0, 0.1)",
    m: "0 0 1rem 0px oklch(0, 0, 0, 0.2)",
    l: "0 0 1.5rem 0px oklch(0, 0, 0, 0.3)",
    xl: "0 0 2rem 0px oklch(0, 0, 0, 0.4)",
  },
};

export default DEFAULT_THEME;
