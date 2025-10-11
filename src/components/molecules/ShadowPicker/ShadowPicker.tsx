import CssShadowInput, {
  type CssShadowValue,
} from "@/components/atoms/CssShadowInput";
import Popover from "@/components/atoms/Popover";
import s from "./ShadowPicker.module.css";

export const ShadowPicker = ({
  name,
  onChange,
  value,
  showBlur = true,
  showSpread = false,
  min,
  max,
  step,
}: {
  name?: string;
  onChange: (shadow: CssShadowValue) => void;
  value: CssShadowValue;
  showBlur?: boolean;
  showSpread?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) => {
  // Generate CSS shadow string for preview
  const generateShadowString = (): string => {
    const parts: string[] = [];

    if (value.inset) {
      parts.push("inset");
    }

    parts.push(`${value.offsetX.value}${value.offsetX.unit}`);
    parts.push(`${value.offsetY.value}${value.offsetY.unit}`);

    if (value.blur) {
      parts.push(`${value.blur.value}${value.blur.unit}`);
    }

    if (value.spread) {
      parts.push(`${value.spread.value}${value.spread.unit}`);
    }

    const colorStr = `oklch(${value.color.oklch.lightness.toFixed(2)} ${value.color.oklch.chroma.toFixed(2)} ${value.color.oklch.hue.toFixed(0)} / ${value.color.alpha.toFixed(2)})`;
    parts.push(colorStr);

    return parts.join(" ");
  };

  const shadowValue = generateShadowString();

  return (
    <Popover
      position="top"
      trigger={
        <button
          type="button"
          className={s.trigger}
          style={
            {
              boxShadow: shadowValue,
            } as React.CSSProperties
          }
          title={name}
          aria-label={`Select box shadow ${name}`}
        />
      }
      style={{ maxWidth: "480px" }}
    >
      <p className={s.name}>{`shadow-${name}`}</p>
      <CssShadowInput
        onShadowChange={onChange}
        value={value}
        showBlur={showBlur}
        showSpread={showSpread}
        min={min}
        max={max}
        step={step}
      />
    </Popover>
  );
};
