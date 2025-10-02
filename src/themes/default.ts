import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

const DEFAULT_THEME: Theme = {
  name: "Default theme",
  description: "Tema por defecto",
  colorMode: "light",
  colors: {
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
    primary: {
      100: new Color("oklch", [0.8, 0.31, 252]),
      200: new Color("oklch", [0.63, 0.2, 252]),
      300: new Color("oklch", [0.42, 0.2, 252]),
      content: new Color("oklch", [0.93, 0.016, 262]),
    },
    secondary: {
      100: new Color("oklch", [0.86, 0.09, 212]),
      200: new Color("oklch", [0.72, 0.09, 212]),
      300: new Color("oklch", [0.58, 0.09, 212]),
      content: new Color("oklch", [0.93, 0.016, 262]),
    },
    accent: {
      100: new Color("oklch", [0.8, 0.25, 9]),
      200: new Color("oklch", [0.64, 0.25, 9]),
      300: new Color("oklch", [0.42, 0.25, 9]),
      content: new Color("oklch", [0.93, 0.016, 262]),
    },
    neutral: {
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
      300: new Color("oklch", [0.42, 0.027, 268]),
      content: new Color("oklch", [0.42, 0.027, 268]),
    },
    info: {
      100: new Color("oklch", [0.8, 0.2, 200]),
      content: new Color("oklch", [0.3, 0.02, 200]),
    },
    success: {
      100: new Color("oklch", [0.8, 0.2, 166]),
      content: new Color("oklch", [0.3, 0.02, 166]),
    },
    warning: {
      100: new Color("oklch", [0.8, 0.2, 95]),
      content: new Color("oklch", [0.3, 0.02, 95]),
    },
    error: {
      100: new Color("oklch", [0.8, 0.2, 28]),
      content: new Color("oklch", [0.3, 0.02, 28]),
    },
  },
  radius: {
    s: "0.25rem",
    m: "0.5rem",
    l: "1rem",
    xl: "1.5rem",
  },
  shadows: {
    s: "0 0 0.5rem rgba(0, 0, 0, 0.1)",
    m: "0 0 1rem rgba(0, 0, 0, 0.2)",
    l: "0 0 1.5rem rgba(0, 0, 0, 0.3)",
    xl: "0 0 2rem rgba(0, 0, 0, 0.4)",
  },
};

export default DEFAULT_THEME;
