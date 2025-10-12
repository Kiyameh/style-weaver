import type { HTMLAttributes } from "react";

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  onDelete?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}
