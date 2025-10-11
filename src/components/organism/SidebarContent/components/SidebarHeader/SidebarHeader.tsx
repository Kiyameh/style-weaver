import { Pencil } from "lucide-react";
import {
  MAX_THEME_DESCRIPTION_LENGTH,
  MAX_THEME_NAME_LENGTH,
} from "../../utils";
import s from "./SidebarHeader.module.css";
import type { SidebarHeaderProps } from "./types";

/**
 * SidebarHeader - Header component for theme metadata editing
 *
 * Allows editing of theme name, description, and color mode.
 * Follows the same input style as ColorGroupHeader for consistency.
 */
export const SidebarHeader = ({
  themeName,
  themeDescription,
  colorMode,
  onNameChange,
  onDescriptionChange,
  onColorModeChange,
}: SidebarHeaderProps) => {
  return (
    <header className={s.header}>
      <div className={s.inputContainer}>
        <input
          type="text"
          id="theme-name"
          className={s.input}
          value={themeName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="A fancy name"
          maxLength={MAX_THEME_NAME_LENGTH}
        />
        <label htmlFor="theme-name">
          <Pencil size={14} className={s.pencilIcon} />
        </label>
      </div>
      <textarea
        id="theme-description"
        className={s.textarea}
        value={themeDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="¿What is this theme about?"
        maxLength={MAX_THEME_DESCRIPTION_LENGTH}
      />
      <select
        id="theme-color-mode"
        className={s.select}
        value={colorMode || ""}
        onChange={(e) => {
          const value = e.target.value;
          onColorModeChange(
            value === "" ? undefined : (value as "dark" | "light"),
          );
        }}
      >
        <option value="">No preference</option>
        <option value="light">Better for light</option>
        <option value="dark">Better for dark</option>
      </select>
    </header>
  );
};
