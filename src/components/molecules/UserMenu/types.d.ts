import type { HTMLAttributes } from "react";

export interface UserMenuProps extends HTMLAttributes<HTMLDivElement> {
  userName: string;
  userEmail?: string;
  avatarSrc?: string;
  menuItems?: MenuItem[];
  onLogout?: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
}
