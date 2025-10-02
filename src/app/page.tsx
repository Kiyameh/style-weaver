"use client";

import { useEffect, useState } from "react";
import CodeBoxHeader from "@/components/organism/CssCodeBox/CodeBoxHeader";
import CssCodeBox from "@/components/organism/CssCodeBox/CssCodeBox";
import DEFAULT_THEME from "@/themes/default";
import type { Theme } from "@/types/Theme";
import { generateCssCode } from "@/utils/theme";
import { getThemeFromUrl, updateUrlWithTheme } from "@/utils/urlState";

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
    <>
      {currentTheme && (
        <>
          <CodeBoxHeader
            cssCode={generateCssCode(currentTheme)}
            previewColors={previewColors}
            setPreviewColors={setPreviewColors}
          />
          <CssCodeBox
            currentTheme={currentTheme}
            previewColors={previewColors}
          />
        </>
      )}
    </>
  );
}
