import { useMemo } from "react";
import s from "./Button.module.css";
import type { ButtonProps } from "./types";

const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const buttonClass = useMemo(() => {
    const baseClass = (() => {
      switch (variant) {
        case "primary":
          return `${s.button} ${s.buttonPrimary}`;
        case "secondary":
          return `${s.button} ${s.buttonSecondary}`;
        case "ghost":
          return `${s.button} ${s.buttonGhost}`;
      }
    })();

    return className ? `${baseClass} ${className}` : baseClass;
  }, [variant, className]);

  if (!children) {
    return null;
  }

  return (
    <button {...props} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
