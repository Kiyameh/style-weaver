import type Color from "colorjs.io";
import OklchColorInput from "@/components/atoms/OklchColorInput";
import Popover from "@/components/atoms/Popover";
import s from "./ColorPicker.module.css";

export const ColorPicker = ({
  name,
  onChange,
  value,
  background,
  mode = "surface",
}: {
  name?: string;
  onChange: (color: Color) => void;
  value: Color;
  background?: Color;
  mode?: "content" | "surface" | "border";
}) => {
  const styles: Record<string, string> = {};

  styles["--color"] = mode === "content" ? value.toString() : "transparent";

  styles["--background"] =
    mode === "surface"
      ? value.toString()
      : background?.toString() || "var(--sw-surface-100)";

  styles["--border"] =
    mode === "border" ? value.toString() : "var(--sw-border-300)";

  return (
    <Popover
      trigger={
        <button
          type="button"
          className={s.trigger}
          style={styles}
          title={name}
          aria-label={`Select color ${name}`}
        >
          &
        </button>
      }
    >
      <p className={s.name}>{name}</p>
      <OklchColorInput onColorChange={onChange} value={value} />
    </Popover>
  );
};
