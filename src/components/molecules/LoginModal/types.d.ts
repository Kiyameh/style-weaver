import type { HTMLAttributes } from "react";

export interface LoginModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}
