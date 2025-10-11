import { Pencil } from "lucide-react";
import s from "./ColorGroupHeader.module.css";
import type { ColorGroupHeaderProps } from "./types";

export const ColorGroupHeader = ({
  groupName,
  currentCount,
  maxVariants = 10,
  minVariants = 1,
  onVariantAdd,
  onVariantRemove,
  onNameChange,
  editable = false,
  showContentCheckbox = false,
  hasContent = false,
  onContentToggle,
  isEditing = false,
  onEditStart,
  tempName = "",
  onTempNameChange,
}: ColorGroupHeaderProps) => {
  const handleNameBlur = () => {
    if (onNameChange && tempName.trim() && tempName.trim() !== groupName) {
      onNameChange(tempName.trim());
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <header className={s.groupHeader}>
      {editable ? (
        <div className={s.editableHeader}>
          <input
            type="text"
            id={`colorName-${groupName}`}
            value={isEditing ? tempName : groupName}
            maxLength={14}
            onFocus={() => {
              if (onEditStart) onEditStart();
            }}
            onChange={(e) => {
              if (onTempNameChange) onTempNameChange(e.target.value);
            }}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
          />
          <label htmlFor={`colorName-${groupName}`}>
            <Pencil size={14} className={s.pencilIcon} />
          </label>
        </div>
      ) : (
        <h4>{groupName}</h4>
      )}

      <div className={s.variantControl}>
        <button
          type="button"
          onClick={() => {
            if (currentCount > minVariants) {
              onVariantRemove();
            }
          }}
          disabled={currentCount <= minVariants}
        >
          -
        </button>
        <span>{currentCount} Variants</span>
        <button
          type="button"
          onClick={onVariantAdd}
          disabled={currentCount >= maxVariants}
        >
          +
        </button>
      </div>

      {showContentCheckbox && (
        <div className={s.contentCheckbox}>
          <label htmlFor={`content-${groupName}`}>Content</label>
          <input
            type="checkbox"
            id={`content-${groupName}`}
            checked={hasContent}
            onChange={(e) => {
              if (onContentToggle) onContentToggle(e.target.checked);
            }}
          />
        </div>
      )}
    </header>
  );
};
