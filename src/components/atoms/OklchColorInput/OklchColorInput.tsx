import Color from "colorjs.io";
import { useEffect, useId, useState } from "react";
import s from "./OklchColorInput.module.css";

const OklchColorInput = ({
  onColorChange,
  value,
}: {
  onColorChange: (color: Color) => void;
  value: Color;
}) => {
  const [color, setColor] = useState<Color>(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setColor(value);
  }, [value]);

  const handleColorChange = (color: Color) => {
    setColor(color);
    onColorChange(color);
  };

  const hueId = useId();
  const chromaId = useId();
  const lightnessId = useId();
  const alphaId = useId();

  return (
    <fieldset className={s.selectors}>
      {/* Hue Slider */}
      <div>
        <label htmlFor={hueId}>Hue: {color.oklch.hue.toFixed(0)}°</label>
        <input
          id={hueId}
          type="range"
          min="0"
          max="360"
          step="1"
          value={color.oklch.hue}
          onChange={(e) => {
            const hueValue = parseFloat(e.target.value);
            if (!Number.isNaN(hueValue)) {
              handleColorChange(
                new Color(
                  "oklch",
                  [color.oklch.lightness, color.oklch.chroma, hueValue],
                  color.alpha,
                ),
              );
            }
          }}
          className={s.slider}
          style={
            {
              background: `linear-gradient(to right, 
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 0),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 60),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 120),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 180),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 240),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 300),
                oklch(${color.oklch.lightness} ${color.oklch.chroma} 360))`,
              "--thumb-color": `oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue})`,
            } as React.CSSProperties
          }
        />
      </div>
      {/* Chroma Slider */}
      <div>
        <label htmlFor={chromaId}>
          Chroma: {color.oklch.chroma.toFixed(2)}
        </label>
        <input
          id={chromaId}
          type="range"
          min="0"
          max="0.37"
          step="0.01"
          value={color.oklch.chroma}
          onChange={(e) => {
            const chromaValue = parseFloat(e.target.value);
            if (!Number.isNaN(chromaValue)) {
              handleColorChange(
                new Color(
                  "oklch",
                  [color.oklch.lightness, chromaValue, color.oklch.hue],
                  color.alpha,
                ),
              );
            }
          }}
          className={s.slider}
          style={
            {
              background: `linear-gradient(to right, 
											 oklch(${color.oklch.lightness} 0 ${color.oklch.hue}), 
											oklch(${color.oklch.lightness} 0.37 ${color.oklch.hue}))`,
              "--thumb-color": `oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue})`,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Lightness Slider */}
      <div>
        <label htmlFor={lightnessId}>
          Lightness: {color.oklch.lightness.toFixed(2)}
        </label>
        <input
          id={lightnessId}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={color.oklch.lightness}
          onChange={(e) => {
            const lightnessValue = parseFloat(e.target.value);
            if (!Number.isNaN(lightnessValue)) {
              handleColorChange(
                new Color(
                  "oklch",
                  [lightnessValue, color.oklch.chroma, color.oklch.hue],
                  color.alpha,
                ),
              );
            }
          }}
          className={s.slider}
          style={
            {
              background: `linear-gradient(to right, 
											oklch(0 ${color.oklch.chroma} ${color.oklch.hue}), 
											oklch(1 ${color.oklch.chroma} ${color.oklch.hue}))`,
              "--thumb-color": `oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue})`,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Alpha Slider */}
      <div>
        <label htmlFor={alphaId}>Alpha: {color.alpha.toFixed(2)}</label>
        <input
          id={alphaId}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={color.alpha}
          onChange={(e) => {
            const alphaValue = parseFloat(e.target.value);
            if (!Number.isNaN(alphaValue)) {
              const newColor = color.clone();
              newColor.alpha = alphaValue;
              handleColorChange(newColor);
            }
          }}
          className={s.slider}
          style={
            {
              background: `linear-gradient(to right, 
                oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue} / 0), 
                oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue} / 1))`,
              "--thumb-color": `oklch(${color.oklch.lightness} ${color.oklch.chroma} ${color.oklch.hue} / ${color.alpha})`,
            } as React.CSSProperties
          }
        />
      </div>
    </fieldset>
  );
};

export default OklchColorInput;
