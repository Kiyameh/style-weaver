import type Color from "colorjs.io";

export type ColorGroup = Record<string | number, Color>;

export interface MainColors {
  surface: ColorGroup;
  content: ColorGroup;
  border: ColorGroup;
}

export interface Theme {
  name: string;
  description: string;
  colorMode: "dark" | "light" | undefined;
  mainColors: MainColors;
  brandColors: Record<string, ColorGroup>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}
