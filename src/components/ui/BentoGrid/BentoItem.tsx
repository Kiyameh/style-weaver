import { useMemo } from "react";
import s from "./BentoGrid.module.css";
import type { BentoItemProps } from "./types";

const BentoItem = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  variant = "default",
  className,
  ...props
}: BentoItemProps) => {
  const itemClass = useMemo(() => {
    const variantClass = (() => {
      switch (variant) {
        case "default":
          return s.itemDefault;
        case "elevated":
          return s.itemElevated;
        case "outlined":
          return s.itemOutlined;
      }
    })();

    const classes = [s.item, variantClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [variant, className]);

  const itemStyle = useMemo(() => {
    return {
      gridColumn: `span ${colSpan}`,
      gridRow: `span ${rowSpan}`,
    };
  }, [colSpan, rowSpan]);

  return (
    <div {...props} className={itemClass} style={itemStyle}>
      {children}
    </div>
  );
};

export default BentoItem;
