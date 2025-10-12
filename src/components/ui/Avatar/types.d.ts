import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "circle" | "square";
}
