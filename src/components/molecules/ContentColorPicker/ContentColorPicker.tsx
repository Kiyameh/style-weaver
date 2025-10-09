import type Color from "colorjs.io";
import { useMemo } from "react";
import OklchColorInput from "@/components/atoms/OklchColorInput/OklchColorInput";
import Popover from "@/components/atoms/Popover/Popover";
import s from "./ContentColorPicker.module.css";

const ContentColorPicker = ({
  name,
  onChange,
  contentValue,
  surfaceValue,
}: {
  name?: string;
  onChange: (color: Color) => void;
  contentValue: Color;
  surfaceValue: Color;
}) => {
  const contentValueString = useMemo(
    () => contentValue.toString(),
    [contentValue],
  );
  const surfaceValueString = useMemo(
    () => surfaceValue.toString(),
    [surfaceValue],
  );
  return (
    <Popover
      trigger={
        <button
          type="button"
          className={s.trigger}
          style={
            {
              "--contentValue": contentValueString,
              "--surfaceValue": surfaceValueString,
            } as React.CSSProperties
          }
          title={name}
          aria-label={`Select color ${name}`}
        >
          A
        </button>
      }
    >
      <p className={s.name}>{name}</p>
      <OklchColorInput onColorChange={onChange} value={contentValue} />
    </Popover>
  );
};

export default ContentColorPicker;
