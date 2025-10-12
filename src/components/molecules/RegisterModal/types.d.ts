import type { HTMLAttributes } from "react";

export interface RegisterModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (name: string, email: string, password: string) => void;
  onLogin?: () => void;
}
