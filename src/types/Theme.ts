import type Color from "colorjs.io";

type ColorGroup = Record<string | number, Color>;

export interface Theme {
  name: string;
  description: string;
  colorMode: "dark" | "light" | undefined;
  colors: Record<string, ColorGroup>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}
