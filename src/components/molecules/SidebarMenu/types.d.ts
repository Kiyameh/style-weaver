import type { HTMLAttributes } from "react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface SidebarMenuProps extends HTMLAttributes<HTMLElement> {
  items: MenuItem[];
  activeItemId?: string;
  title?: string;
}
