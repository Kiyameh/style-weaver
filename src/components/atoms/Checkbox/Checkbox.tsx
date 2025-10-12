import { useMemo } from "react";
import s from "./Checkbox.module.css";
import type { CheckboxProps } from "./types";

const Checkbox = ({
  label,
  variant = "primary",
  error = false,
  className,
  id,
  ...props
}: CheckboxProps) => {
  const checkboxClass = useMemo(() => {
    const baseClass = (() => {
      switch (variant) {
        case "primary":
          return `${s.checkbox} ${s.checkboxPrimary}`;
        case "secondary":
          return `${s.checkbox} ${s.checkboxSecondary}`;
      }
    })();

    const errorClass = error ? s.checkboxError : "";
    const classes = [baseClass, errorClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [variant, error, className]);

  const generatedId = useMemo(
    () => id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
    [id],
  );

  return (
    <div className={s.container}>
      <input
        {...props}
        type="checkbox"
        id={generatedId}
        className={checkboxClass}
      />
      {label && (
        <label htmlFor={generatedId} className={s.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
