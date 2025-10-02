import type { Theme } from "@/types/Theme";
import { generateCssVariables } from "@/utils/theme";
import s from "./CssCodeBox.module.css";

const CssCodeBox = ({
  currentTheme,
  previewColors,
}: {
  currentTheme: Theme;
  previewColors: boolean;
}) => {
  return (
    <main className={s.codeBox} style={generateCssVariables(currentTheme)}>
      {/* Theme info */}
      <div className={s.comment}>
        <h4>{`/* Name: ${currentTheme.name} */`}</h4>
        <p>{`/* Description: ${currentTheme.description} */`}</p>
        <p>{`/* Color Mode: ${currentTheme.colorMode} */`}</p>
      </div>
      {/* Theme content */}
      <p className={s.selector}>{`:root{`}</p>
      {/* Colors */}
      {Object.entries(currentTheme.colors).map(([name, colorStack]) => (
        <div key={name} className={s.indented}>
          {Object.entries(colorStack).map(([surname, value]) => (
            <p key={`--${name}-${surname}`}>
              <span className={s.keyword}>{`--${name}-${surname}`}</span>
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
                <span className={s.value}>{value.toString()}</span>
              </span>
            </p>
          ))}
        </div>
      ))}

      {/* Radius */}
      <div className={s.indented}>
        {Object.entries(currentTheme.radius).map(([name, value]) => (
          <p key={name}>
            <span className={s.keyword}>{`--radius-${name}`}</span>
            <span>{`: `}</span>
            <span className={s.value}>{value}</span>
          </p>
        ))}
      </div>

      {/* Shadows */}
      <div className={s.indented}>
        {Object.entries(currentTheme.shadows).map(([name, value]) => (
          <p key={name}>
            <span className={s.keyword}>{`--shadow-${name}`}</span>
            <span>{`: `}</span>
            <span className={s.value}>{value}</span>
          </p>
        ))}
      </div>

      <p className={s.selector}>{`}`}</p>
    </main>
  );
};

export default CssCodeBox;
