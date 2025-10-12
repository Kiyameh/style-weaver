import { useMemo } from "react";
import Button from "@/components/ui/Button";
import s from "./SidebarMenu.module.css";
import type { SidebarMenuProps } from "./types";

const SidebarMenu = ({
  items,
  activeItemId,
  title,
  className,
  ...props
}: SidebarMenuProps) => {
  const menuClass = useMemo(() => {
    return className ? `${s.menu} ${className}` : s.menu;
  }, [className]);

  return (
    <nav {...props} className={menuClass} aria-label={title || "Menu"}>
      {title && <h3 className={s.title}>{title}</h3>}
      <ul className={s.list}>
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <li key={item.id} className={s.item}>
              <Button
                variant="ghost"
                onClick={item.onClick}
                disabled={item.disabled}
                className={`${s.button} ${isActive ? s.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon && (
                  <span className={s.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className={s.label}>{item.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
