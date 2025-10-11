import type Color from "colorjs.io";
import { useEffect, useId, useState } from "react";
import OklchColorInput from "../OklchColorInput/OklchColorInput";
import s from "./CssShadowInput.module.css";

export type CssUnit = "px" | "rem" | "em" | "%";

export interface CssLengthValue {
  value: number;
  unit: CssUnit;
}

export interface CssShadowValue {
  offsetX: CssLengthValue;
  offsetY: CssLengthValue;
  blur?: CssLengthValue;
  spread?: CssLengthValue;
  color: Color;
  inset: boolean;
}

interface CssShadowInputProps {
  value: CssShadowValue;
  onShadowChange: (shadow: CssShadowValue) => void;
  showBlur?: boolean;
  showSpread?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const CssShadowInput = ({
  value,
  onShadowChange,
  showBlur = true,
  showSpread = false,
  min,
  max,
  step,
}: CssShadowInputProps) => {
  const [shadow, setShadow] = useState<CssShadowValue>(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setShadow(value);
  }, [value]);

  // Get dynamic range based on unit
  const getRangeForUnit = (unit: CssUnit) => {
    switch (unit) {
      case "px":
        return { min: -25, max: 25, step: 1 };
      case "rem":
      case "em":
        return { min: -5, max: 5, step: 0.25 };
      case "%":
        return { min: -100, max: 100, step: 1 };
      default:
        return { min: -25, max: 25, step: 1 };
    }
  };

  // Get effective range for a specific property
  const getEffectiveRange = (property: "offsetX" | "offsetY" | "blur" | "spread") => {
    const currentLength = shadow[property];
    if (!currentLength) return { min: 0, max: 25, step: 1 };
    
    const range = getRangeForUnit(currentLength.unit);
    
    // For blur, min is always 0
    if (property === "blur") {
      return { ...range, min: 0 };
    }
    
    return {
      min: min ?? range.min,
      max: max ?? range.max,
      step: step ?? range.step,
    };
  };

  const handleShadowChange = (newShadow: CssShadowValue) => {
    setShadow(newShadow);
    onShadowChange(newShadow);
  };

  const handleLengthChange = (
    property: "offsetX" | "offsetY" | "blur" | "spread",
    newValue: number,
  ) => {
    const currentLength = shadow[property];
    if (!currentLength) return;

    handleShadowChange({
      ...shadow,
      [property]: {
        ...currentLength,
        value: newValue,
      },
    });
  };

  // Handle global unit change for all sliders
  const handleGlobalUnitChange = (newUnit: CssUnit) => {
    const newRange = getRangeForUnit(newUnit);
    
    // Clamp all values to the new range
    const clampValue = (value: number, property: "offsetX" | "offsetY" | "blur" | "spread") => {
      const effectiveMin = property === "blur" ? 0 : newRange.min;
      const effectiveMax = newRange.max;
      
      if (value > effectiveMax) return effectiveMax;
      if (value < effectiveMin) return effectiveMin;
      return value;
    };

    handleShadowChange({
      ...shadow,
      offsetX: {
        value: clampValue(shadow.offsetX.value, "offsetX"),
        unit: newUnit,
      },
      offsetY: {
        value: clampValue(shadow.offsetY.value, "offsetY"),
        unit: newUnit,
      },
      blur: shadow.blur ? {
        value: clampValue(shadow.blur.value, "blur"),
        unit: newUnit,
      } : shadow.blur,
      spread: shadow.spread ? {
        value: clampValue(shadow.spread.value, "spread"),
        unit: newUnit,
      } : shadow.spread,
    });
  };

  const handleColorChange = (newColor: Color) => {
    handleShadowChange({
      ...shadow,
      color: newColor,
    });
  };

  const handleInsetChange = (inset: boolean) => {
    handleShadowChange({
      ...shadow,
      inset,
    });
  };

  // Generate CSS string representation
  const generateCssShadow = (): string => {
    const parts: string[] = [];

    if (shadow.inset) {
      parts.push("inset");
    }

    parts.push(`${shadow.offsetX.value}${shadow.offsetX.unit}`);
    parts.push(`${shadow.offsetY.value}${shadow.offsetY.unit}`);

    if (shadow.blur) {
      parts.push(`${shadow.blur.value}${shadow.blur.unit}`);
    }

    if (shadow.spread) {
      parts.push(`${shadow.spread.value}${shadow.spread.unit}`);
    }

    // Format color as oklch()
    const colorStr = `oklch(${shadow.color.oklch.lightness.toFixed(2)} ${shadow.color.oklch.chroma.toFixed(2)} ${shadow.color.oklch.hue.toFixed(0)} / ${shadow.color.alpha.toFixed(2)})`;
    parts.push(colorStr);

    return parts.join(" ");
  };

  const offsetXId = useId();
  const offsetYId = useId();
  const blurId = useId();
  const spreadId = useId();
  const insetId = useId();

  return (
    <fieldset className={s.container}>
      <legend className={s.legend}>Box Shadow</legend>

      {/* Visual Preview */}
      <div className={s.outputContainer}>
        <code className={s.output}>{generateCssShadow()}</code>
        <div
          className={s.previewBox}
          style={{
            boxShadow: generateCssShadow(),
          }}
        />
      </div>

      {/* Two Column Layout */}
      <div className={s.contentGrid}>
        {/* Left Column: Sliders + Inset */}
        <div className={s.leftColumn}>
          {/* Offset X */}
          <div className={s.lengthControl}>
            <label htmlFor={offsetXId}>
              Offset X: {shadow.offsetX.value.toFixed(getEffectiveRange("offsetX").step < 1 ? 2 : 0)}
              {shadow.offsetX.unit}
            </label>
            <input
              id={offsetXId}
              type="range"
              min={getEffectiveRange("offsetX").min}
              max={getEffectiveRange("offsetX").max}
              step={getEffectiveRange("offsetX").step}
              value={shadow.offsetX.value}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (!Number.isNaN(newValue)) {
                  handleLengthChange("offsetX", newValue);
                }
              }}
              className={s.slider}
            />
          </div>

          {/* Offset Y */}
          <div className={s.lengthControl}>
            <label htmlFor={offsetYId}>
              Offset Y: {shadow.offsetY.value.toFixed(getEffectiveRange("offsetY").step < 1 ? 2 : 0)}
              {shadow.offsetY.unit}
            </label>
            <input
              id={offsetYId}
              type="range"
              min={getEffectiveRange("offsetY").min}
              max={getEffectiveRange("offsetY").max}
              step={getEffectiveRange("offsetY").step}
              value={shadow.offsetY.value}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (!Number.isNaN(newValue)) {
                  handleLengthChange("offsetY", newValue);
                }
              }}
              className={s.slider}
            />
          </div>

          {/* Blur Radius */}
          {showBlur && shadow.blur && (
            <div className={s.lengthControl}>
              <label htmlFor={blurId}>
                Blur: {shadow.blur.value.toFixed(getEffectiveRange("blur").step < 1 ? 2 : 0)}
                {shadow.blur.unit}
              </label>
              <input
                id={blurId}
                type="range"
                min={getEffectiveRange("blur").min}
                max={getEffectiveRange("blur").max}
                step={getEffectiveRange("blur").step}
                value={shadow.blur.value}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!Number.isNaN(newValue)) {
                    handleLengthChange("blur", newValue);
                  }
                }}
                className={s.slider}
              />
            </div>
          )}

          {/* Spread Radius */}
          {showSpread && shadow.spread && (
            <div className={s.lengthControl}>
              <label htmlFor={spreadId}>
                Spread: {shadow.spread.value.toFixed(getEffectiveRange("spread").step < 1 ? 2 : 0)}
                {shadow.spread.unit}
              </label>
              <input
                id={spreadId}
                type="range"
                min={getEffectiveRange("spread").min}
                max={getEffectiveRange("spread").max}
                step={getEffectiveRange("spread").step}
                value={shadow.spread.value}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!Number.isNaN(newValue)) {
                    handleLengthChange("spread", newValue);
                  }
                }}
                className={s.slider}
              />
            </div>
          )}

          {/* Inset Toggle + Global Unit Selector */}
          <div className={s.controlsRow}>
            <div className={s.checkboxContainer}>
              <input
                id={insetId}
                type="checkbox"
                checked={shadow.inset}
                onChange={(e) => handleInsetChange(e.target.checked)}
                className={s.checkbox}
              />
              <label htmlFor={insetId}>Inset</label>
            </div>
            <select
              value={shadow.offsetX.unit}
              onChange={(e) => handleGlobalUnitChange(e.target.value as CssUnit)}
              className={s.unitSelect}
              aria-label="Unit for all values"
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>

        {/* Right Column: Color Input */}
        <div className={s.rightColumn}>
          <div className={s.colorSection}>
            <h3 className={s.colorTitle}>Shadow Color</h3>
            <OklchColorInput
              value={shadow.color}
              onColorChange={handleColorChange}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CssShadowInput;
