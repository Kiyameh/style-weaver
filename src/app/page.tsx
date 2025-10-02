"use client";

import { Clipboard, Download, Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import DEFAULT_THEME from "@/themes/default";
import type { Theme } from "@/types/Theme";
import { getThemeFromUrl, updateUrlWithTheme } from "@/utils/urlState";
import s from "./page.module.css";
import "../styles/code.css";

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

  // Function to generate CSS custom properties from theme
  const generateCSSVariables = (theme: Theme): Record<string, string> => {
    const cssVars: Record<string, string> = {};

    // Add color variables
    Object.entries(theme.colors).forEach(([colorName, colorStack]) => {
      Object.entries(colorStack).forEach(([stackName, color]) => {
        cssVars[`--${colorName}-${stackName}`] = color.toString();
      });
    });

    // Add radius variables
    Object.entries(theme.radius).forEach(([name, value]) => {
      cssVars[`--radius-${name}`] = value;
    });

    // Add shadow variables
    Object.entries(theme.shadows).forEach(([name, value]) => {
      cssVars[`--shadow-${name}`] = value;
    });

    return cssVars;
  };

  // TODO: Connection to update the theme:
  const updateTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    updateUrlWithTheme(newTheme);
  };

  return (
    <div className={s.container}>
      <header className={s.header}>
        <button type="button" className={s.iconButton}>
          <Clipboard size={22} />
        </button>
        <button type="button" className={s.iconButton}>
          <Download size={22} />
        </button>
        <button
          type="button"
          className={s.iconButton}
          onClick={() => setPreviewColors(!previewColors)}
        >
          {previewColors ? <Eye size={22} /> : <EyeClosed size={22} />}
        </button>
      </header>
      <main
        className={s.codeBox}
        style={currentTheme ? generateCSSVariables(currentTheme) : {}}
      >
        {currentTheme && (
          <>
            {/* Theme info */}
            <h4 className="css-comment">{`/* Name: ${currentTheme.name} */`}</h4>
            <p className="css-comment">{`/* Description: ${currentTheme.description} */`}</p>
            <p className="css-comment">{`/* Color Mode: ${currentTheme.colorMode} */`}</p>
            <br />
            <br />
            {/* Theme content */}
            <p>
              <span className="css-selector">{`:root{`}</span>
            </p>
            {/* Colors */}
            <div className="indented">
              {Object.entries(currentTheme.colors).map(([name, colorStack]) => (
                <div key={name}>
                  {Object.entries(colorStack).map(([surname, value]) => (
                    <p key={`--${name}-${surname}`} className="css-line">
                      <span className="css-keyword">{`--${name}-${surname}`}</span>
                      <span>{`: `}</span>
                      <span
                        style={{
                          backgroundColor: previewColors
                            ? value.toString()
                            : "var(--surface-100)",
                          padding: "2px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        <span className="css-value">{value.toString()}</span>
                      </span>
                    </p>
                  ))}
                  <br />
                </div>
              ))}
            </div>

            {/* Radius */}
            <div className="indented">
              {Object.entries(currentTheme.radius).map(([name, value]) => (
                <p key={name}>
                  <span className="css-keyword">{`--radius-${name}`}</span>
                  <span>{`: `}</span>
                  <span className="css-value">{value}</span>
                </p>
              ))}
            </div>

            <br />

            {/* Shadows */}
            <div className="indented">
              {Object.entries(currentTheme.shadows).map(([name, value]) => (
                <p key={name}>
                  <span className="css-keyword">{`--shadow-${name}`}</span>
                  <span>{`: `}</span>
                  <span className="css-value">{value}</span>
                </p>
              ))}
            </div>

            <p>
              <span className="css-selector">{`}`}</span>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
