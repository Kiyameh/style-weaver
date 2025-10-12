import { useMemo } from "react";
import s from "./TextField.module.css";
import type { TextFieldProps } from "./types";

const TextField = ({
  label,
  variant = "primary",
  error = false,
  helperText,
  fullWidth = false,
  className,
  id,
  ...props
}: TextFieldProps) => {
  const inputClass = useMemo(() => {
    const baseClass = (() => {
      switch (variant) {
        case "primary":
          return `${s.input} ${s.inputPrimary}`;
        case "secondary":
          return `${s.input} ${s.inputSecondary}`;
      }
    })();

    const errorClass = error ? s.inputError : "";
    const classes = [baseClass, errorClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [variant, error, className]);

  const containerClass = useMemo(() => {
    return fullWidth ? `${s.container} ${s.fullWidth}` : s.container;
  }, [fullWidth]);

  const generatedId = useMemo(
    () => id || `textfield-${Math.random().toString(36).substr(2, 9)}`,
    [id],
  );

  const helperTextId = helperText ? `${generatedId}-helper` : undefined;

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={generatedId} className={s.label}>
          {label}
        </label>
      )}
      <input
        {...props}
        type={props.type || "text"}
        id={generatedId}
        className={inputClass}
        aria-describedby={helperTextId}
        aria-invalid={error}
      />
      {helperText && (
        <span
          id={helperTextId}
          className={`${s.helperText} ${error ? s.helperTextError : ""}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;
