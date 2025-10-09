import type Color from "colorjs.io";
import { useMemo } from "react";
import OklchColorInput from "@/components/atoms/OklchColorInput/OklchColorInput";
import Popover from "@/components/atoms/Popover/Popover";
import s from "./BorderColorPicker.module.css";

const BorderColorPicker = ({
  name,
  onChange,
  value,
}: {
  name?: string;
  onChange: (color: Color) => void;
  value: Color;
}) => {
  const valueString = useMemo(() => value.toString(), [value]);
  return (
    <Popover
      trigger={
        <button
          type="button"
          className={s.trigger}
          style={
            {
              "--value": valueString,
            } as React.CSSProperties
          }
          title={name}
          aria-label={`Select color ${name}`}
        />
      }
    >
      <p className={s.name}>{name}</p>
      <OklchColorInput onColorChange={onChange} value={value} />
    </Popover>
  );
};

export default BorderColorPicker;
