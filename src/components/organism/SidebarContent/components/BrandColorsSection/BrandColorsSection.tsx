import type Color from "colorjs.io";
import { useState } from "react";
import { ColorPicker } from "@/components/molecules/ColorPicker/ColorPicker";
import { useTheme } from "@/contexts/ThemeContext";
import { getNumericVariantCount, sortColorsWithContentFirst } from "../../utils";
import { ColorGroupHeader } from "../ColorGroupHeader";
import s from "./BrandColorsSection.module.css";

export const BrandColorsSection = () => {
  const {
    currentTheme,
    updateBrandColor,
    addColorToGroup,
    removeLastColorFromGroup,
    addContentColorToGroup,
    removeContentColorFromGroup,
    changeColorGroupName,
  } = useTheme();

  const [lightnessIncrement] = useState<number>(0.2);
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [tempGroupName, setTempGroupName] = useState<string>("");

  if (!currentTheme) return null;

  const createBrandColorChangeHandler = (
    colorGroup: string,
    colorKey: string | number,
  ) => {
    return (newColor: Color) =>
      updateBrandColor(colorGroup, colorKey, newColor);
  };

  const handleVariantAdd = (groupName: string) => {
    addColorToGroup(groupName, true, lightnessIncrement);
  };

  const handleVariantRemove = (groupName: string) => {
    removeLastColorFromGroup(groupName, true);
  };

  const handleNameChange = (oldName: string, newName: string) => {
    changeColorGroupName(oldName, newName);
    setEditingGroupName(null);
    setTempGroupName("");
  };

  const handleContentToggle = (groupName: string, checked: boolean) => {
    if (checked) {
      addContentColorToGroup(groupName);
    } else {
      removeContentColorFromGroup(groupName);
    }
  };

  return (
    <section className={s.section}>
      <h3>Brand Colors</h3>
      {Object.entries(currentTheme.brandColors).map(([colorGroup, colors]) => {
        const numericCount = getNumericVariantCount(Object.keys(colors));
        const hasContent = Object.keys(colors).includes("content");

        return (
          <div key={colorGroup}>
            <ColorGroupHeader
              groupName={colorGroup}
              currentCount={numericCount}
              maxVariants={10}
              minVariants={1}
              onVariantAdd={() => handleVariantAdd(colorGroup)}
              onVariantRemove={() => handleVariantRemove(colorGroup)}
              onNameChange={(newName) => handleNameChange(colorGroup, newName)}
              editable={true}
              showContentCheckbox={true}
              hasContent={hasContent}
              onContentToggle={(checked) =>
                handleContentToggle(colorGroup, checked)
              }
              isEditing={editingGroupName === colorGroup}
              onEditStart={() => {
                setEditingGroupName(colorGroup);
                setTempGroupName(colorGroup);
              }}
              tempName={tempGroupName}
              onTempNameChange={setTempGroupName}
            />
            <div className={s.colorGroup}>
              {sortColorsWithContentFirst(Object.entries(colors)).map(
                ([colorKey, color]) => (
                  <ColorPicker
                    key={`${colorGroup}-${colorKey}`}
                    name={`${colorGroup}-${colorKey}`}
                    onChange={createBrandColorChangeHandler(
                      colorGroup,
                      colorKey,
                    )}
                    value={color as Color}
                    background={Object.values(colors)[0] as Color}
                    mode={colorKey.includes("content") ? "content" : "surface"}
                  />
                ),
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};
