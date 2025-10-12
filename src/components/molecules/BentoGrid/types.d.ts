import type { HTMLAttributes } from "react";

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 6;
  gap?: "small" | "medium" | "large";
}

export interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 6;
  rowSpan?: 1 | 2 | 3 | 4;
  variant?: "default" | "elevated" | "outlined";
}
