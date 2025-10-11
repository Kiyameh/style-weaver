import { useEffect, useId, useState } from "react";
import s from "./CssRadiusInput.module.css";

export type CssUnit = "px" | "rem" | "em" | "%";

export interface CssRadiusValue {
  value: number;
  unit: CssUnit;
}

const CssRadiusInput = ({
  onRadiusChange,
  value,
  min,
  max,
  step,
}: {
  onRadiusChange: (radius: CssRadiusValue) => void;
  value: CssRadiusValue;
  min?: number;
  max?: number;
  step?: number;
}) => {
  const [radius, setRadius] = useState<CssRadiusValue>(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setRadius(value);
  }, [value]);

  // Get dynamic range based on unit
  const getRangeForUnit = (unit: CssUnit) => {
    switch (unit) {
      case "px":
        return { min: 0, max: 320, step: 1 };
      case "rem":
      case "em":
        return { min: 0, max: 20, step: 0.25 };
      case "%":
        return { min: 0, max: 100, step: 1 };
      default:
        return { min: 0, max: 100, step: 1 };
    }
  };

  const range = getRangeForUnit(radius.unit);
  const effectiveMin = min ?? range.min;
  const effectiveMax = max ?? range.max;
  const effectiveStep = step ?? range.step;

  const handleRadiusChange = (newRadius: CssRadiusValue) => {
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  const handleValueChange = (newValue: number) => {
    handleRadiusChange({
      ...radius,
      value: newValue,
    });
  };

  const handleUnitChange = (newUnit: CssUnit) => {
    // Get the new range for the new unit
    const newRange = getRangeForUnit(newUnit);

    // Clamp the current value to the new range
    let newValue = radius.value;
    if (newValue > newRange.max) {
      newValue = newRange.max;
    }
    if (newValue < newRange.min) {
      newValue = newRange.min;
    }

    handleRadiusChange({
      value: newValue,
      unit: newUnit,
    });
  };

  const valueId = useId();
  const unitId = useId();

  return (
    <fieldset className={s.container}>
      {/* Preview Box */}
      <div className={s.previewContainer}>
        <div
          className={s.previewBox}
          style={{
            borderRadius: `${radius.value}${radius.unit}`,
          }}
        >
          <span className={`${s.dimensionLabel} ${s.widthLabel}`}>200px</span>
          <span className={`${s.dimensionLabel} ${s.heightLabel}`}>100px</span>
        </div>
      </div>
      {/* Value Slider */}
      <div className={s.sliderContainer}>
        <label htmlFor={valueId}>
          Border Radius: {radius.value.toFixed(effectiveStep < 1 ? 2 : 0)}
          {radius.unit}
        </label>
        <input
          id={valueId}
          type="range"
          min={effectiveMin}
          max={effectiveMax}
          step={effectiveStep}
          value={radius.value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!Number.isNaN(newValue)) {
              handleValueChange(newValue);
            }
          }}
          className={s.slider}
        />
      </div>

      {/* Unit Selector */}
      <div className={s.unitContainer}>
        <label htmlFor={unitId}>Unit:</label>
        <select
          id={unitId}
          value={radius.unit}
          onChange={(e) => {
            handleUnitChange(e.target.value as CssUnit);
          }}
          className={s.unitSelect}
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
          <option value="%">%</option>
        </select>
      </div>
    </fieldset>
  );
};

export default CssRadiusInput;
