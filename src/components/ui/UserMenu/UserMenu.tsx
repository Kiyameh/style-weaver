import { ChevronDown, LogOut } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { UserMenuProps } from "./types";
import s from "./UserMenu.module.css";

const UserMenu = ({
  userName,
  userEmail,
  avatarSrc,
  menuItems = [],
  onLogout,
  className,
  ...props
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const containerClass = useMemo(() => {
    return className ? `${s.container} ${className}` : s.container;
  }, [className]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleItemClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
    closeMenu();
  };

  return (
    <div {...props} className={containerClass} ref={menuRef}>
      <button
        type="button"
        className={s.trigger}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <Avatar src={avatarSrc} fallback={userName} size="small" />
        <span className={s.userName}>{userName}</span>
        <ChevronDown
          size={16}
          className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div className={s.overlay} onClick={closeMenu} aria-hidden="true" />
          <div className={s.menu} role="menu">
            <div className={s.header}>
              <div className={s.headerName}>{userName}</div>
              {userEmail && <div className={s.headerEmail}>{userEmail}</div>}
            </div>

            {menuItems.length > 0 && (
              <div className={s.menuItems}>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${s.menuItem} ${item.variant === "danger" ? s.menuItemDanger : ""}`}
                    onClick={() => handleItemClick(item.onClick)}
                    role="menuitem"
                  >
                    {item.icon && (
                      <span className={s.menuIcon} aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {onLogout && (
              <>
                <div className={s.divider} />
                <Button
                  variant="ghost"
                  onClick={() => handleItemClick(onLogout)}
                  className={s.logoutButton}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
