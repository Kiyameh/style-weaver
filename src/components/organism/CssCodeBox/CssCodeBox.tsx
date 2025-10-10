import type Color from "colorjs.io";
import { useTheme } from "@/contexts/ThemeContext";
import s from "./CssCodeBox.module.css";

const CssCodeBox = ({
  previewColors,
}: {
  previewColors: boolean;
}) => {
  const { currentTheme } = useTheme();

  if (!currentTheme) return null;
  return (
    <section
      className={s.codeBox}
      aria-label="Código del tema css"
      role="document"
    >
      {/* Theme info */}
      <div className={s.comment}>
        <h2 title="name">{`/* Name: ${currentTheme.name} */`}</h2>
        <p title="description">{`/* Description: ${currentTheme.description} */`}</p>
        <p title="colorMode">{`/* Color Mode: ${currentTheme.colorMode} */`}</p>
      </div>
      {/* Theme content */}
      <fieldset aria-label="Variables del tema">
        <p aria-hidden className={s.selector}>{`:root{`}</p>

        {/* Main Colors */}
        <fieldset aria-label="Variables de colores principales CSS">
          {Object.entries(currentTheme.mainColors).map(([name, colorStack]) => (
            <div key={name} className={s.indented}>
              {Object.entries(colorStack).map(([surname, value]) => (
                <p key={`--${name}-${surname}`}>
                  <span className={s.keyword}>{`--${name}-${surname}`}</span>
                  <span>{`: `}</span>
                  <span
                    style={{
                      backgroundColor: previewColors
                        ? (value as Color).toString()
                        : "var(--surface-100)",
                      padding: "2px 5px",
                      borderRadius: "4px",
                    }}
                    title={`Color: ${(value as Color).toString()}`}
                  >
                    <span className={s.value}>
                      {(value as Color).toString()}
                    </span>
                  </span>
                </p>
              ))}
            </div>
          ))}
        </fieldset>

        {/* Brand Colors */}
        <fieldset aria-label="Variables de colores de marca CSS">
          {Object.entries(currentTheme.brandColors).map(
            ([name, colorStack]) => (
              <div key={name} className={s.indented}>
                {Object.entries(colorStack).map(([surname, value]) => (
                  <p key={`--${name}-${surname}`}>
                    <span className={s.keyword}>{`--${name}-${surname}`}</span>
                    <span>{`: `}</span>
                    <span
                      style={{
                        backgroundColor: previewColors
                          ? (value as Color).toString()
                          : "var(--surface-100)",
                        padding: "2px 5px",
                        borderRadius: "4px",
                      }}
                      title={`Color: ${(value as Color).toString()}`}
                    >
                      <span className={s.value}>
                        {(value as Color).toString()}
                      </span>
                    </span>
                  </p>
                ))}
              </div>
            ),
          )}
        </fieldset>

        {/* Radius */}
        <fieldset aria-label="Variables de radio CSS" className={s.indented}>
          {Object.entries(currentTheme.radius).map(([name, value]) => (
            <p key={name}>
              <span className={s.keyword}>{`--radius-${name}`}</span>
              <span>{`: `}</span>
              <span className={s.value}>{value}</span>
            </p>
          ))}
        </fieldset>

        {/* Shadows */}
        <fieldset aria-label="Variables de sombra CSS" className={s.indented}>
          {Object.entries(currentTheme.shadows).map(([name, value]) => (
            <p key={name}>
              <span className={s.keyword}>{`--shadow-${name}`}</span>
              <span>{`: `}</span>
              <span className={s.value}>{value}</span>
            </p>
          ))}
        </fieldset>

        <p aria-hidden className={s.selector}>{`}`}</p>
      </fieldset>
    </section>
  );
};

export default CssCodeBox;
