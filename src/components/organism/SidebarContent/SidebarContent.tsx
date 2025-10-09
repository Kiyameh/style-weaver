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
  const handleChangeColor = (
    newColor: Color,
    colorGroup: string,
    colorKey: string | number,
  ) => {
    if (!currentTheme) return;

    const newTheme: Theme = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [colorGroup]: {
          ...currentTheme.colors[colorGroup],
          [colorKey]: newColor,
        },
      },
    };

    updateTheme(newTheme);
  };

  // Helper function to create color change handlers for specific color paths
  const createColorChangeHandler = (
    colorGroup: string,
    colorKey: string | number,
  ) => {
    return (newColor: Color) =>
      handleChangeColor(newColor, colorGroup, colorKey);
  };

  if (!currentTheme) return null;

  return (
    <>
      <h3>Colors</h3>
      {Object.entries(currentTheme.colors).map(([colorGroup, colors]) => (
        <div key={colorGroup}>
          <h4>{colorGroup}</h4>
          <div className={s.colorGroup}>
            {Object.entries(colors).map(([colorKey, color]) =>
              colorGroup.includes("content") || colorKey.includes("content") ? (
                <ContentColorPicker
                  key={`${colorGroup}-${colorKey}`}
                  name={`${colorGroup}-${colorKey}`}
                  contentValue={color}
                  surfaceValue={Object.values(colors)[0]}
                  onChange={createColorChangeHandler(colorGroup, colorKey)}
                />
              ) : (
                <SurfaceColorPicker
                  key={`${colorGroup}-${colorKey}`}
                  name={`${colorGroup}-${colorKey}`}
                  value={color}
                  onChange={createColorChangeHandler(colorGroup, colorKey)}
                />
              ),
            )}

            <button
              type="button"
              className={s.addColorButton}
              onClick={() => {
                console.log(`add color to ${colorGroup}`);
              }}
            >
              <Plus />
            </button>
            <button
              type="button"
              className={s.addColorButton}
              onClick={() => {
                console.log(`remove color from ${colorGroup}`);
              }}
            >
              <Minus />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default SidebarContent;
