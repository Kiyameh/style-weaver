import type Color from "colorjs.io";
import { Minus, Plus, Trash } from "lucide-react";
import ContentColorPicker from "@/components/molecules/ContentColorPicker/ContentColorPicker";
import SurfaceColorPicker from "@/components/molecules/SurfaceColorPicker/SurfaceColorPicker";
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
              {Object.entries(colors).map(([colorKey, color]) =>
                colorGroup.includes("content") ||
                colorKey.includes("content") ? (
                  <ContentColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    contentValue={color as Color}
                    surfaceValue={Object.values(colors)[0] as Color}
                    onChange={createMainColorChangeHandler(
                      colorGroup as keyof Theme["mainColors"],
                      colorKey,
                    )}
                  />
                ) : (
                  <SurfaceColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    value={color as Color}
                    onChange={createMainColorChangeHandler(
                      colorGroup as keyof Theme["mainColors"],
                      colorKey,
                    )}
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
                {Object.entries(colors).map(([colorKey, color]) =>
                  colorGroup.includes("content") ||
                  colorKey.includes("content") ? (
                    <ContentColorPicker
                      key={`${colorGroup}-${colorKey}`}
                      name={`${colorGroup}-${colorKey}`}
                      contentValue={color as Color}
                      surfaceValue={Object.values(colors)[0] as Color}
                      onChange={createBrandColorChangeHandler(
                        colorGroup,
                        colorKey,
                      )}
                    />
                  ) : (
                    <SurfaceColorPicker
                      key={`${colorGroup}-${colorKey}`}
                      name={`${colorGroup}-${colorKey}`}
                      value={color as Color}
                      onChange={createBrandColorChangeHandler(
                        colorGroup,
                        colorKey,
                      )}
                    />
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </section>
    </>
  );
};

export default SidebarContent;
