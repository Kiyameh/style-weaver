import { X } from "lucide-react";
import { useMemo } from "react";
import s from "./Chip.module.css";
import type { ChipProps } from "./types";

const Chip = ({
  label,
  variant = "primary",
  onDelete,
  icon,
  disabled = false,
  className,
  ...props
}: ChipProps) => {
  const chipClass = useMemo(() => {
    const baseClass = (() => {
      switch (variant) {
        case "primary":
          return `${s.chip} ${s.chipPrimary}`;
        case "secondary":
          return `${s.chip} ${s.chipSecondary}`;
        case "ghost":
          return `${s.chip} ${s.chipGhost}`;
      }
    })();

    const disabledClass = disabled ? s.chipDisabled : "";
    const classes = [baseClass, disabledClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [variant, disabled, className]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: <is not a output>
    <div
      {...props}
      className={chipClass}
      role="status"
      aria-disabled={disabled}
    >
      {icon && (
        <span className={s.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={s.label}>{label}</span>
      {onDelete && (
        <button
          type="button"
          className={s.deleteButton}
          onClick={handleDelete}
          disabled={disabled}
          aria-label={`Remove ${label}`}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Chip;
