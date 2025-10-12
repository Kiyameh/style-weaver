import { useMemo } from "react";
import s from "./Card.module.css";
import type { CardProps } from "./types";

const Card = ({
  children,
  variant = "elevated",
  padding = "medium",
  hoverable = false,
  className,
  ...props
}: CardProps) => {
  const cardClass = useMemo(() => {
    const variantClass = (() => {
      switch (variant) {
        case "elevated":
          return `${s.card} ${s.cardElevated}`;
        case "outlined":
          return `${s.card} ${s.cardOutlined}`;
        case "filled":
          return `${s.card} ${s.cardFilled}`;
      }
    })();

    const paddingClass = (() => {
      switch (padding) {
        case "none":
          return s.paddingNone;
        case "small":
          return s.paddingSmall;
        case "medium":
          return s.paddingMedium;
        case "large":
          return s.paddingLarge;
      }
    })();

    const hoverClass = hoverable ? s.hoverable : "";

    const classes = [variantClass, paddingClass, hoverClass]
      .filter(Boolean)
      .join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [variant, padding, hoverable, className]);

  return (
    <div {...props} className={cardClass}>
      {children}
    </div>
  );
};

export default Card;
