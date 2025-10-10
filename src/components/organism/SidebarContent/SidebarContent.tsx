import type Color from "colorjs.io";
import { ColorPicker } from "@/components/molecules/ColorPicker/ColorPicker";
import type { Theme } from "@/types/Theme";
import s from "./SidebarContent.module.css";

const SidebarContent = ({
  currentTheme,
  updateTheme,
}: {
  currentTheme: Theme | null;
  updateTheme: (newTheme: Theme) => void;
}) => {
  const handleChangeMainColor = (
    newColor: Color,
    colorGroup: keyof Theme["mainColors"],
    colorKey: string | number,
  ) => {
    if (!currentTheme) return;

    const newTheme: Theme = {
      ...currentTheme,
      mainColors: {
        ...currentTheme.mainColors,
        [colorGroup]: {
          ...currentTheme.mainColors[colorGroup],
          [colorKey]: newColor,
        },
      },
    };

    updateTheme(newTheme);
  };

  const handleChangeBrandColor = (
    newColor: Color,
    colorGroup: string,
    colorKey: string | number,
  ) => {
    if (!currentTheme) return;

    const newTheme: Theme = {
      ...currentTheme,
      brandColors: {
        ...currentTheme.brandColors,
        [colorGroup]: {
          ...currentTheme.brandColors[colorGroup],
          [colorKey]: newColor,
        },
      },
    };

    updateTheme(newTheme);
  };

  // Helper function to create color change handlers for main colors
  const createMainColorChangeHandler = (
    colorGroup: keyof Theme["mainColors"],
    colorKey: string | number,
  ) => {
    return (newColor: Color) =>
      handleChangeMainColor(newColor, colorGroup, colorKey);
  };

  // Helper function to create color change handlers for brand colors
  const createBrandColorChangeHandler = (
    colorGroup: string,
    colorKey: string | number,
  ) => {
    return (newColor: Color) =>
      handleChangeBrandColor(newColor, colorGroup, colorKey);
  };

  if (!currentTheme) return null;

  return (
    <>
      <section className={s.section}>
        <h3>Main Colors</h3>
        {Object.entries(currentTheme.mainColors).map(([colorGroup, colors]) => (
          <div key={colorGroup}>
            <header className={s.colorHeader}>
              <p>{colorGroup}</p>
              <select value={Object.keys(colors).length}>
                <option value="1">1 variant</option>
                <option value="2">2 variants</option>
                <option value="3">3 variants</option>
                <option value="4">4 variants</option>
                <option value="5">5 variants</option>
              </select>
            </header>
            <div className={s.colorGroup}>
              {Object.entries(colors as Record<string, Color>).map(
                ([colorKey, color]) => (
                  <ColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    onChange={createMainColorChangeHandler(
                      colorGroup as keyof Theme["mainColors"],
                      colorKey,
                    )}
                    value={color}
                    background={currentTheme.mainColors.surface["100"]}
                    mode={colorGroup as "surface" | "content" | "border"}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </section>

      <section className={s.section}>
        <h3>Brand Colors</h3>
        {Object.entries(currentTheme.brandColors).map(
          ([colorGroup, colors]) => (
            <div key={colorGroup}>
              <header className={s.colorHeader}>
                <input type="text" value={colorGroup} maxLength={14} />
                <select
                  value={
                    Object.keys(colors).filter((key) => key.includes("00"))
                      .length
                  }
                >
                  <option value="1">1 variant</option>
                  <option value="2">2 variants</option>
                  <option value="3">3 variants</option>
                  <option value="4">4 variants</option>
                  <option value="5">5 variants</option>
                </select>
                <label htmlFor="content">content</label>
                <input
                  type="checkbox"
                  id="content"
                  checked={Object.keys(colors).includes("content")}
                />
              </header>
              <div className={s.colorGroup}>
                {Object.entries(colors).map(([colorKey, color]) => (
                  <ColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    onChange={createBrandColorChangeHandler(
                      colorGroup,
                      colorKey,
                    )}
                    value={color}
                    background={Object.values(colors)[0]}
                    mode={colorKey.includes("content") ? "content" : "surface"}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </section>
    </>
  );
};

export default SidebarContent;
