import Color from "colorjs.io";
import type { CssRadiusValue } from "@/components/atoms/CssRadiusInput";
import type { CssShadowValue } from "@/components/atoms/CssShadowInput";
import { ColorPicker } from "@/components/molecules/ColorPicker/ColorPicker";
import { RadiusPicker } from "@/components/molecules/RadiusPicker";
import { ShadowPicker } from "@/components/molecules/ShadowPicker";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import s from "./SidebarContent.module.css";

const SidebarContent = () => {
  const {
    currentTheme,
    updateMainColor,
    updateBrandColor,
    updateRadius,
    updateShadow,
  } = useTheme();

  // Helper function to create color change handlers for main colors
  const createMainColorChangeHandler = (
    colorGroup: keyof Theme["mainColors"],
    colorKey: string | number,
  ) => {
    return (newColor: Color) => updateMainColor(colorGroup, colorKey, newColor);
  };

  // Helper function to create color change handlers for brand colors
  const createBrandColorChangeHandler = (
    colorGroup: string,
    colorKey: string | number,
  ) => {
    return (newColor: Color) =>
      updateBrandColor(colorGroup, colorKey, newColor);
  };

  // Helper function to parse CSS radius string to CssRadiusValue
  const parseRadiusString = (radiusStr: string): CssRadiusValue => {
    const match = radiusStr.match(/^([\d.]+)(\w+|%)$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2] as "px" | "rem" | "em" | "%",
      };
    }
    return { value: 0, unit: "px" };
  };

  // Helper function to parse CSS shadow string to CssShadowValue
  const parseShadowString = (shadowStr: string): CssShadowValue => {
    const parts = shadowStr.trim().split(/\s+/);
    const isInset = parts[0] === "inset";
    const offset = isInset ? 1 : 0;

    const parseValue = (
      str: string,
    ): { value: number; unit: "px" | "rem" | "em" | "%" } => {
      const match = str.match(/^([\d.-]+)(\w+|%)$/);
      if (match) {
        const unit = match[2];
        // Validate unit
        if (unit === "px" || unit === "rem" || unit === "em" || unit === "%") {
          return {
            value: parseFloat(match[1]),
            unit: unit,
          };
        }
      }
      return { value: 0, unit: "px" };
    };

    // Extract color (oklch format)
    const colorMatch = shadowStr.match(/(oklch\([^)]+\))/);
    const color = colorMatch
      ? new Color(colorMatch[1])
      : new Color("oklch", [0.3, 0.1, 0]);

    return {
      offsetX: parseValue(parts[offset]),
      offsetY: parseValue(parts[offset + 1]),
      blur: parts[offset + 2]
        ? parseValue(parts[offset + 2])
        : { value: 0, unit: "px" },
      spread:
        parts[offset + 3] && !parts[offset + 3].includes("oklch")
          ? parseValue(parts[offset + 3])
          : { value: 0, unit: "px" },
      color,
      inset: isInset,
    };
  };

  // Helper function to create radius change handler
  const createRadiusChangeHandler = (key: string) => {
    return (newRadius: CssRadiusValue) => {
      const radiusString = `${newRadius.value}${newRadius.unit}`;
      updateRadius(key, radiusString);
    };
  };

  // Helper function to create shadow change handler
  const createShadowChangeHandler = (key: string) => {
    return (newShadow: CssShadowValue) => {
      const parts: string[] = [];
      if (newShadow.inset) parts.push("inset");
      parts.push(`${newShadow.offsetX.value}${newShadow.offsetX.unit}`);
      parts.push(`${newShadow.offsetY.value}${newShadow.offsetY.unit}`);
      if (newShadow.blur)
        parts.push(`${newShadow.blur.value}${newShadow.blur.unit}`);
      if (newShadow.spread)
        parts.push(`${newShadow.spread.value}${newShadow.spread.unit}`);

      // Convert color to oklch format
      const [l, c, h] = newShadow.color.oklch;
      const alpha = newShadow.color.alpha;
      const colorStr = alpha < 1 
        ? `oklch(${l} ${c} ${h || 0} / ${alpha})`
        : `oklch(${l} ${c} ${h || 0})`;
      parts.push(colorStr);

      updateShadow(key, parts.join(" "));
    };
  };

  if (!currentTheme) return null;

  return (
    <>
      <section className={s.section}>
        <h3>Main Colors</h3>
        {Object.entries(currentTheme.mainColors).map(([colorGroup, colors]) => (
          <div key={colorGroup}>
            <header className={s.colorHeader}>
              <p>{colorGroup}</p>
              <select value={Object.keys(colors).length}>
                <option value="1">1 variant</option>
                <option value="2">2 variants</option>
                <option value="3">3 variants</option>
                <option value="4">4 variants</option>
                <option value="5">5 variants</option>
              </select>
            </header>
            <div className={s.colorGroup}>
              {Object.entries(colors as Record<string, Color>).map(
                ([colorKey, color]) => (
                  <ColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    onChange={createMainColorChangeHandler(
                      colorGroup as keyof Theme["mainColors"],
                      colorKey,
                    )}
                    value={color}
                    background={currentTheme.mainColors.surface["100"]}
                    mode={colorGroup as "surface" | "content" | "border"}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </section>

      <section className={s.section}>
        <h3>Brand Colors</h3>
        {Object.entries(currentTheme.brandColors).map(
          ([colorGroup, colors]) => (
            <div key={colorGroup}>
              <header className={s.colorHeader}>
                <input type="text" value={colorGroup} maxLength={14} />
                <select
                  value={
                    Object.keys(colors).filter((key) => key.includes("00"))
                      .length
                  }
                >
                  <option value="1">1 variant</option>
                  <option value="2">2 variants</option>
                  <option value="3">3 variants</option>
                  <option value="4">4 variants</option>
                  <option value="5">5 variants</option>
                </select>
                <label htmlFor="content">content</label>
                <input
                  type="checkbox"
                  id="content"
                  checked={Object.keys(colors).includes("content")}
                />
              </header>
              <div className={s.colorGroup}>
                {Object.entries(colors).map(([colorKey, color]) => (
                  <ColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    onChange={createBrandColorChangeHandler(
                      colorGroup,
                      colorKey,
                    )}
                    value={color}
                    background={Object.values(colors)[0]}
                    mode={colorKey.includes("content") ? "content" : "surface"}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </section>

      <section className={s.section}>
        <h3>Border Radius</h3>
        <div className={s.colorGroup}>
          {Object.entries(currentTheme.radius).map(([key, radiusStr]) => (
            <RadiusPicker
              key={key}
              name={`radius-${key}`}
              value={parseRadiusString(radiusStr)}
              onChange={createRadiusChangeHandler(key)}
            />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h3>Box Shadows</h3>
        <div className={s.colorGroup}>
          {Object.entries(currentTheme.shadows).map(([key, shadowStr]) => (
            <ShadowPicker
              key={key}
              name={key}
              value={parseShadowString(shadowStr)}
              onChange={createShadowChangeHandler(key)}
              showBlur={true}
              showSpread={true}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default SidebarContent;
