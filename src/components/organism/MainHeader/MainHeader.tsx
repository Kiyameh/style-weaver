"use client";

import { Heart, Plane } from "lucide-react";
import { useState } from "react";
import LibraryModal from "@/components/organism/Library";
import MobileMenu from "@/components/organism/MobileMenu";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import { updateUrlWithTheme } from "@/utils/url-persistence";
import s from "./MainHeader.module.css";

const MainHeader = () => {
  const { resetTheme, currentTheme } = useTheme();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const handleLoadTheme = (theme: Theme) => {
    // Update URL with the loaded theme and reload to apply it
    updateUrlWithTheme(theme);
    window.location.reload();
  };

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
          <button
            type="button"
            className={`${s.button} ${s.resetButton}`}
            aria-label="Reset theme to default"
            onClick={resetTheme}
          >
            Reset theme
          </button>
          <button
            type="button"
            className={`${s.button} ${s.libraryButton}`}
            aria-label="Open theme library"
            onClick={() => setIsLibraryOpen(true)}
          >
            Library
          </button>
        </div>

        {/* Mobile menu */}
        <MobileMenu
          onResetTheme={resetTheme}
          onOpenLibrary={() => setIsLibraryOpen(true)}
        />
      </div>

      {/* Library Modal */}
      {currentTheme && (
        <LibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          currentTheme={currentTheme}
          onLoadTheme={handleLoadTheme}
        />
      )}
    </header>
  );
};

export default MainHeader;

// Named export for testing
export { MainHeader };
