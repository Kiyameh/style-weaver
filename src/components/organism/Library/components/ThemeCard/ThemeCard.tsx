import { Check, Moon, Send, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ThemeCardProps } from "../../types";
import { calculateThemeStats } from "../../utils/themeStats";
import s from "./ThemeCard.module.css";

const ThemeCard = ({ savedTheme, onDelete, onLoad }: ThemeCardProps) => {
  const stats = calculateThemeStats(savedTheme.theme);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (confirmingDelete) {
      const timer = setTimeout(() => {
        setConfirmingDelete(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [confirmingDelete]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirmingDelete) {
      // Confirm delete
      onDelete(savedTheme.id);
      setConfirmingDelete(false);
    } else {
      // Start confirmation
      setConfirmingDelete(true);
    }
  };

  const handleLoad = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLoad(savedTheme.theme);
  };

  return (
    <article className={s.card}>
      <div className={s.header}>
        <div className={s.titleRow}>
          <h3 className={s.title}>{savedTheme.theme.name}</h3>
          {savedTheme.theme.colorMode && (
            <div className={s.colorMode}>
              {savedTheme.theme.colorMode === "light" ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </div>
          )}
        </div>
        <p className={s.description}>{savedTheme.theme.description}</p>
      </div>

      {savedTheme.project && (
        <div className={s.project}>
          <span className={s.projectLabel}>Project:</span>
          <span className={s.projectName}>{savedTheme.project}</span>
        </div>
      )}

      <div className={s.stats}>
        <div className={s.stat}>
          <span className={s.statLabel}>Main colors</span>
          <span className={s.statValue}>{stats.mainColorsCount}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statLabel}>Brand colors</span>
          <span className={s.statValue}>{stats.brandColorsCount}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statLabel}>Shadows</span>
          <span className={s.statValue}>{stats.shadowsCount}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statLabel}>Radius</span>
          <span className={s.statValue}>{stats.radiusCount}</span>
        </div>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          className={s.loadButton}
          onClick={handleLoad}
          aria-label={`Load theme ${savedTheme.theme.name}`}
        >
          <Send size={16} aria-hidden="true" />
          <span>Load</span>
        </button>
        <button
          type="button"
          className={`${s.deleteButton} ${confirmingDelete ? s.confirming : ""}`}
          onClick={handleDelete}
          aria-label={
            confirmingDelete
              ? `Confirm delete theme ${savedTheme.theme.name}`
              : `Delete theme ${savedTheme.theme.name}`
          }
        >
          {confirmingDelete ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Trash2 size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
};

export default ThemeCard;
