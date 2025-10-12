import Color from "colorjs.io";
import type { Theme } from "@/types/Theme";

/**
 * Deserializes a URL string back to a Theme object
 * @param urlParam - URL string to deserialize
 * @returns Theme object or null if deserialization fails
 */
export function deserializeTheme(urlParam: string): Theme | null {
  try {
    const jsonString = decodeURIComponent(urlParam);
    const parsed = JSON.parse(jsonString);

    // Reconstruct Color objects
    const reconstructedTheme: Theme = {
      ...parsed,
      mainColors: {
        surface: Object.fromEntries(
          Object.entries(
            parsed.mainColors.surface as Record<
              string,
              { space: string; coords: number[]; alpha: number }
            >,
          ).map(([subKey, colorData]) => [
            subKey,
            new Color(
              colorData.space,
              colorData.coords as [number, number, number],
              colorData.alpha,
            ),
          ]),
        ),
        content: Object.fromEntries(
          Object.entries(
            parsed.mainColors.content as Record<
              string,
              { space: string; coords: number[]; alpha: number }
            >,
          ).map(([subKey, colorData]) => [
            subKey,
            new Color(
              colorData.space,
              colorData.coords as [number, number, number],
              colorData.alpha,
            ),
          ]),
        ),
        border: Object.fromEntries(
          Object.entries(
            parsed.mainColors.border as Record<
              string,
              { space: string; coords: number[]; alpha: number }
            >,
          ).map(([subKey, colorData]) => [
            subKey,
            new Color(
              colorData.space,
              colorData.coords as [number, number, number],
              colorData.alpha,
            ),
          ]),
        ),
      },
      brandColors: Object.fromEntries(
        Object.entries(
          parsed.brandColors as Record<
            string,
            Record<string, { space: string; coords: number[]; alpha: number }>
          >,
        ).map(([key, colorStack]) => [
          key,
          Object.fromEntries(
            Object.entries(colorStack).map(([subKey, colorData]) => [
              subKey,
              new Color(
                colorData.space,
                colorData.coords as [number, number, number],
                colorData.alpha,
              ),
            ]),
          ),
        ]),
      ),
    };

    return reconstructedTheme;
  } catch (error) {
    console.error("Error deserializing theme from URL:", error);
    return null;
  }
}
