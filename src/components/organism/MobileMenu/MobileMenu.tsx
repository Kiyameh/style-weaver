"use client";

import { Book, Heart, Menu, Plane, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import s from "./MobileMenu.module.css";

interface MobileMenuProps {
  onResetTheme: () => void;
  onOpenLibrary?: () => void;
}

const MobileMenu = ({ onResetTheme, onOpenLibrary }: MobileMenuProps) => {
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
          <button
            type="button"
            className={s.button}
            aria-label="Open theme library"
            onClick={() => {
              onOpenLibrary?.();
              closeMenu();
            }}
          >
            <Book size={20} aria-hidden="true" />
            Library
          </button>
          <button
            type="button"
            className={s.button}
            aria-label="Reset theme to default"
            onClick={() => {
              onResetTheme();
              closeMenu();
            }}
          >
            <RotateCcw size={20} aria-hidden="true" />
            Reset theme
          </button>

          <button
            type="button"
            className={s.button}
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
          </button>

          <button
            type="button"
            className={s.button}
            aria-label="Back to Kiyameh portfolio"
            onClick={() => {
              window.open("https://kiyameh.com");
              closeMenu();
            }}
          >
            <Plane size={20} aria-hidden="true" />
            <span>Back to Kiyameh.com</span>
          </button>

          <span className={s.version}>version 1.0</span>
        </div>
      </nav>
    </>
  );
};

export default MobileMenu;

// Named export for testing
export { MobileMenu };
