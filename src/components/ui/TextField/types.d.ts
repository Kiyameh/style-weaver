import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "primary" | "secondary";
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}
