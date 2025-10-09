"use client";

import { useEffect, useState } from "react";
import CodeBoxHeader from "@/components/organism/CssCodeBox/CodeBoxHeader";
import CssCodeBox from "@/components/organism/CssCodeBox/CssCodeBox";
import SidebarContent from "@/components/organism/SidebarContent/SidebarContent";
import DEFAULT_THEME from "@/themes/default";
import type { Theme } from "@/types/Theme";
import { generateCssCode } from "@/utils/theme";
import { getThemeFromUrl, updateUrlWithTheme } from "@/utils/urlState";
import s from "./page.module.css";

export default function CssPreviewPage() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [previewColors, setPreviewColors] = useState<boolean>(true);

  useEffect(() => {
    // Try to get the theme from the URL:
    const urlTheme = getThemeFromUrl();

    if (urlTheme) {
      setCurrentTheme(urlTheme);
    } else {
      // If no theme is in the URL, apply the default theme:
      setCurrentTheme(DEFAULT_THEME);
      updateUrlWithTheme(DEFAULT_THEME);
    }
  }, []);

  // TODO: Connection to update the theme:
  const updateTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    updateUrlWithTheme(newTheme);
  };

  return (
    <div className={s.container}>
      <aside className={s.sidebar}>
        {currentTheme && (
          <SidebarContent
            currentTheme={currentTheme}
            updateTheme={updateTheme}
          />
        )}
      </aside>
      <main className={s.main}>
        {currentTheme && (
          <div className={s.content}>
            <CodeBoxHeader
              cssCode={generateCssCode(currentTheme)}
              previewColors={previewColors}
              setPreviewColors={setPreviewColors}
            />
            <CssCodeBox
              currentTheme={currentTheme}
              previewColors={previewColors}
            />
          </div>
        )}
      </main>
    </div>
  );
}
