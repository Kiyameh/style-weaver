import Color from "colorjs.io";
import { Pencil } from "lucide-react";
import { useState } from "react";
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
    removeRadius,
    removeShadow,
    changeColorGroupName,
    addColorToGroup,
    removeLastColorFromGroup,
    addContentColorToGroup,
    removeContentColorFromGroup,
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

  // State for editing color group names
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [tempGroupName, setTempGroupName] = useState<string>("");

  // State for lightness increment when creating new color variants
  const [lightnessIncrement] = useState<number>(0.2);

  // Helper function to handle color group name changes
  const handleColorGroupNameChange = (oldName: string, newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== oldName) {
      changeColorGroupName(oldName, trimmedName);
    }
    setEditingGroupName(null);
    setTempGroupName("");
  };

  // Helper function to adjust number of variants in a color group
  const handleVariantCountChange = (
    groupName: string,
    targetCount: number,
    isBrandColor: boolean,
  ) => {
    if (!currentTheme) return;

    // Limit to maximum 10 variants
    if (targetCount > 10) return;

    const colorGroups = isBrandColor
      ? currentTheme.brandColors
      : currentTheme.mainColors;
    const colorGroup = colorGroups[groupName as keyof typeof colorGroups];

    if (!colorGroup) return;

    // Count current numeric variants (excluding "content")
    const currentNumericKeys = Object.keys(colorGroup).filter(
      (key) => !Number.isNaN(Number(key)),
    ).length;

    const diff = targetCount - currentNumericKeys;

    if (diff > 0) {
      // Add variants
      for (let i = 0; i < diff; i++) {
        addColorToGroup(groupName, isBrandColor, lightnessIncrement);
      }
    } else if (diff < 0) {
      // Remove variants
      for (let i = 0; i < Math.abs(diff); i++) {
        removeLastColorFromGroup(groupName, isBrandColor);
      }
    }
  };

  // Helper function to adjust number of radius variants
  const handleRadiusVariantCountChange = (targetCount: number) => {
    if (!currentTheme) return;

    // Limit to maximum 10 variants
    if (targetCount > 10) return;

    const currentCount = Object.keys(currentTheme.radius).length;
    const diff = targetCount - currentCount;

    if (diff > 0) {
      // Add radius variants
      const sizeKeys = [
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
      ];

      for (let i = 0; i < diff; i++) {
        const currentKeys = Object.keys(currentTheme.radius);
        let nextKey: string;
        let defaultValue = "0.5rem"; // Default value

        if (currentKeys.length === 0) {
          nextKey = "sm";
        } else {
          const lastKey = currentKeys[currentKeys.length - 1];
          const lastIndex = sizeKeys.indexOf(lastKey);

          // Get the value from the last variant
          defaultValue = currentTheme.radius[lastKey];

          if (lastIndex >= 0 && lastIndex < sizeKeys.length - 1) {
            nextKey = sizeKeys[lastIndex + 1];
          } else {
            // If we've used all predefined keys, generate 8xl, 9xl, 10xl...
            const xlMatch = lastKey.match(/^(\d+)xl$/);
            if (xlMatch) {
              const num = parseInt(xlMatch[1]);
              nextKey = `${num + 1}xl`;
            } else {
              nextKey = "8xl";
            }
          }
        }

        updateRadius(nextKey, defaultValue);
      }
    } else if (diff < 0) {
      // Remove radius variants
      const keys = Object.keys(currentTheme.radius);
      const keysToRemove = keys.slice(targetCount);

      keysToRemove.forEach((key) => {
        removeRadius(key);
      });
    }
  };

  // Helper function to adjust number of shadow variants
  const handleShadowVariantCountChange = (targetCount: number) => {
    if (!currentTheme) return;

    // Limit to maximum 10 variants
    if (targetCount > 10) return;

    const currentCount = Object.keys(currentTheme.shadows).length;
    const diff = targetCount - currentCount;

    if (diff > 0) {
      // Add shadow variants
      const sizeKeys = [
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
      ];

      for (let i = 0; i < diff; i++) {
        const currentKeys = Object.keys(currentTheme.shadows);
        let nextKey: string;
        let defaultValue = "0 2px 4px oklch(0 0 0 / 0.1)"; // Default value

        if (currentKeys.length === 0) {
          nextKey = "sm";
        } else {
          const lastKey = currentKeys[currentKeys.length - 1];
          const lastIndex = sizeKeys.indexOf(lastKey);

          // Get the value from the last variant
          defaultValue = currentTheme.shadows[lastKey];

          if (lastIndex >= 0 && lastIndex < sizeKeys.length - 1) {
            nextKey = sizeKeys[lastIndex + 1];
          } else {
            // If we've used all predefined keys, generate 8xl, 9xl, 10xl...
            const xlMatch = lastKey.match(/^(\d+)xl$/);
            if (xlMatch) {
              const num = parseInt(xlMatch[1]);
              nextKey = `${num + 1}xl`;
            } else {
              nextKey = "8xl";
            }
          }
        }

        updateShadow(nextKey, defaultValue);
      }
    } else if (diff < 0) {
      // Remove shadow variants
      const keys = Object.keys(currentTheme.shadows);
      const keysToRemove = keys.slice(targetCount);

      keysToRemove.forEach((key) => {
        removeShadow(key);
      });
    }
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
      const colorStr =
        alpha < 1
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
            <header className={s.groupHeader}>
              <p>{colorGroup}</p>
              <div className={s.variantControl}>
                <button
                  type="button"
                  onClick={() => {
                    const currentCount = Object.keys(colors).filter(
                      (key) => !Number.isNaN(Number(key)),
                    ).length;
                    if (currentCount > 1) {
                      handleVariantCountChange(
                        colorGroup,
                        currentCount - 1,
                        false,
                      );
                    }
                  }}
                  disabled={
                    Object.keys(colors).filter(
                      (key) => !Number.isNaN(Number(key)),
                    ).length <= 1
                  }
                >
                  -
                </button>
                <span>
                  {
                    Object.keys(colors).filter(
                      (key) => !Number.isNaN(Number(key)),
                    ).length
                  }{" "}
                  Variants
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentCount = Object.keys(colors).filter(
                      (key) => !Number.isNaN(Number(key)),
                    ).length;
                    handleVariantCountChange(
                      colorGroup,
                      currentCount + 1,
                      false,
                    );
                  }}
                  disabled={
                    Object.keys(colors).filter(
                      (key) => !Number.isNaN(Number(key)),
                    ).length >= 10
                  }
                >
                  +
                </button>
              </div>
            </header>
            <div className={s.colorGroup}>
              {Object.entries(colors as Record<string, Color>)
                .sort(([keyA], [keyB]) => {
                  // "content" always comes first
                  if (keyA === "content") return -1;
                  if (keyB === "content") return 1;
                  // Otherwise maintain original order
                  return 0;
                })
                .map(([colorKey, color]) => (
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
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className={s.section}>
        <h3>Brand Colors</h3>
        {Object.entries(currentTheme.brandColors).map(
          ([colorGroup, colors]) => (
            <div key={colorGroup}>
              <header className={s.groupHeader}>
                <label htmlFor={`colorName-${colorGroup}`}>
                  <input
                    type="text"
                    id={`colorName-${colorGroup}`}
                    value={
                      editingGroupName === colorGroup
                        ? tempGroupName
                        : colorGroup
                    }
                    maxLength={14}
                    onFocus={() => {
                      setEditingGroupName(colorGroup);
                      setTempGroupName(colorGroup);
                    }}
                    onChange={(e) => setTempGroupName(e.target.value)}
                    onBlur={() => {
                      if (editingGroupName === colorGroup) {
                        handleColorGroupNameChange(colorGroup, tempGroupName);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      }
                    }}
                  />
                  <Pencil className={s.pencilIcon} size={18} />
                </label>
                <div className={s.variantControl}>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = Object.keys(colors).filter(
                        (key) => !Number.isNaN(Number(key)),
                      ).length;
                      if (currentCount > 1) {
                        handleVariantCountChange(
                          colorGroup,
                          currentCount - 1,
                          true,
                        );
                      }
                    }}
                    disabled={
                      Object.keys(colors).filter(
                        (key) => !Number.isNaN(Number(key)),
                      ).length <= 1
                    }
                  >
                    -
                  </button>
                  <span>
                    {
                      Object.keys(colors).filter(
                        (key) => !Number.isNaN(Number(key)),
                      ).length
                    }{" "}
                    Variants
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = Object.keys(colors).filter(
                        (key) => !Number.isNaN(Number(key)),
                      ).length;
                      handleVariantCountChange(
                        colorGroup,
                        currentCount + 1,
                        true,
                      );
                    }}
                    disabled={
                      Object.keys(colors).filter(
                        (key) => !Number.isNaN(Number(key)),
                      ).length >= 10
                    }
                  >
                    +
                  </button>
                </div>
                <div className={s.contentCheckbox}>
                  <label htmlFor={`content-${colorGroup}`}>Content</label>
                  <input
                    type="checkbox"
                    id={`content-${colorGroup}`}
                    checked={Object.keys(colors).includes("content")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addContentColorToGroup(colorGroup);
                      } else {
                        removeContentColorFromGroup(colorGroup);
                      }
                    }}
                  />
                </div>
              </header>
              <div className={s.colorGroup}>
                {Object.entries(colors)
                  .sort(([keyA], [keyB]) => {
                    // "content" always comes first
                    if (keyA === "content") return -1;
                    if (keyB === "content") return 1;
                    // Otherwise maintain original order
                    return 0;
                  })
                  .map(([colorKey, color]) => (
                    <ColorPicker
                      key={`${colorGroup}-${colorKey}`}
                      name={`${colorGroup}-${colorKey}`}
                      onChange={createBrandColorChangeHandler(
                        colorGroup,
                        colorKey,
                      )}
                      value={color as Color}
                      background={Object.values(colors)[0]}
                      mode={
                        colorKey.includes("content") ? "content" : "surface"
                      }
                    />
                  ))}
              </div>
            </div>
          ),
        )}
      </section>

      <section className={s.section}>
        <header className={s.groupHeader}>
          <h3>Border Radius</h3>
          <div className={s.variantControl}>
            <button
              type="button"
              onClick={() => {
                const currentCount = Object.keys(currentTheme.radius).length;
                if (currentCount > 1) {
                  handleRadiusVariantCountChange(currentCount - 1);
                }
              }}
              disabled={Object.keys(currentTheme.radius).length <= 1}
            >
              -
            </button>
            <span>{Object.keys(currentTheme.radius).length} Variants</span>
            <button
              type="button"
              onClick={() => {
                const currentCount = Object.keys(currentTheme.radius).length;
                handleRadiusVariantCountChange(currentCount + 1);
              }}
              disabled={Object.keys(currentTheme.radius).length >= 10}
            >
              +
            </button>
          </div>
        </header>
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
        <header className={s.groupHeader}>
          <h3>Box Shadows</h3>
          <div className={s.variantControl}>
            <button
              type="button"
              onClick={() => {
                const currentCount = Object.keys(currentTheme.shadows).length;
                if (currentCount > 1) {
                  handleShadowVariantCountChange(currentCount - 1);
                }
              }}
              disabled={Object.keys(currentTheme.shadows).length <= 1}
            >
              -
            </button>
            <span>{Object.keys(currentTheme.shadows).length} Variants</span>
            <button
              type="button"
              onClick={() => {
                const currentCount = Object.keys(currentTheme.shadows).length;
                handleShadowVariantCountChange(currentCount + 1);
              }}
              disabled={Object.keys(currentTheme.shadows).length >= 10}
            >
              +
            </button>
          </div>
        </header>
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
