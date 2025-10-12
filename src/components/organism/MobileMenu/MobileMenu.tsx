"use client";

import { Book, Heart, Menu, Plane, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import s from "./MobileMenu.module.css";

interface MobileMenuProps {
  onResetTheme: () => void;
}

const MobileMenu = ({ onResetTheme }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Burger button */}
      <button
        type="button"
        className={s.burgerButton}
        onClick={toggleMenu}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <Menu size={24} aria-hidden="true" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className={s.overlay} onClick={closeMenu} aria-hidden="true" />
      )}

      {/* Menu dropdown */}
      <nav
        className={`${s.menu} ${isOpen ? s.open : ""}`}
        aria-label="Menú móvil"
      >
        <div className={s.menuContent}>
          <Button
            variant="primary"
            aria-label="Ir a la biblioteca de componentes"
            onClick={closeMenu}
          >
            <Book size={20} aria-hidden="true" />
            Library
          </Button>
          <Button
            variant="secondary"
            aria-label="Reset theme to default"
            onClick={() => {
              onResetTheme();
              closeMenu();
            }}
          >
            <RotateCcw size={20} aria-hidden="true" />
            Reset theme
          </Button>

          <Button
            variant="secondary"
            aria-label="Support this project"
            onClick={() => {
              window.open(
                "https://buymeacoffee.com/kiyameh",
                "_blank",
                "noopener,noreferrer",
              );
              closeMenu();
            }}
          >
            <Heart size={20} aria-hidden="true" />
            <span>Support</span>
          </Button>

          <Button
            variant="secondary"
            aria-label="Back to Kiyameh portfolio"
            onClick={() => {
              window.open("https://kiyameh.com");
              closeMenu();
            }}
          >
            <Plane size={20} aria-hidden="true" />
            <span>Back to Kiyameh.com</span>
          </Button>

          <span className={s.version}>version 1.0</span>
        </div>
      </nav>
    </>
  );
};

export default MobileMenu;

// Named export for testing
export { MobileMenu };
