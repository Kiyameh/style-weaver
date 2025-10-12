import { useMemo } from "react";
import s from "./BentoGrid.module.css";
import type { BentoGridProps } from "./types";

const BentoGrid = ({
  children,
  columns = 3,
  gap = "medium",
  className,
  ...props
}: BentoGridProps) => {
  const gridClass = useMemo(() => {
    const columnClass = (() => {
      switch (columns) {
        case 2:
          return s.gridCols2;
        case 3:
          return s.gridCols3;
        case 4:
          return s.gridCols4;
        case 6:
          return s.gridCols6;
      }
    })();

    const gapClass = (() => {
      switch (gap) {
        case "small":
          return s.gapSmall;
        case "medium":
          return s.gapMedium;
        case "large":
          return s.gapLarge;
      }
    })();

    const classes = [s.grid, columnClass, gapClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [columns, gap, className]);

  return (
    <div {...props} className={gridClass}>
      {children}
    </div>
  );
};

export default BentoGrid;
