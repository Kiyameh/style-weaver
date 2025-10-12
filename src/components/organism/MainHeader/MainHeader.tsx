"use client";

import { Heart, Plane } from "lucide-react";
import MobileMenu from "@/components/organism/MobileMenu";
import Button from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import s from "./MainHeader.module.css";

const MainHeader = () => {
  const { resetTheme } = useTheme();

  return (
    <header className={s.header}>
      <div className={s.logoContainer} role="img" aria-label="Logo container">
        <img src="logo.svg" alt="Style Weaver logo" className={s.logo} />
        <h1 className={s.title}>Style Weaver</h1>
      </div>

      <div className={s.banner}>
        {/* Desktop navigation */}
        <nav className={s.navContainer} aria-label="Navegación principal">
          <Plane aria-hidden="true" />
          <a
            href="https://kiyameh.com"
            className={s.backLink}
            aria-label="Back to Kiyameh portfolio"
          >
            <span>Back to Kiyameh.com</span>
          </a>
          <a
            href="https://buymeacoffee.com/kiyameh"
            className={s.supportLink}
            aria-label="Support this project"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Heart size={16} aria-hidden="true" />
            <span>Support</span>
          </a>
          <span className={s.version}>version 1.0</span>
        </nav>

        {/* Desktop actions */}
        <div className={s.actionsContainer}>
          <Button
            variant="ghost"
            aria-label="Reset theme to default"
            onClick={resetTheme}
          >
            Reset theme
          </Button>
          <Button aria-label="Ir a la biblioteca de componentes">
            Library
          </Button>
        </div>

        {/* Mobile menu */}
        <MobileMenu onResetTheme={resetTheme} />
      </div>
    </header>
  );
};

export default MainHeader;

// Named export for testing
export { MainHeader };
