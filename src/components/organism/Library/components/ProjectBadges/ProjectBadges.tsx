import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import s from "./ProjectBadges.module.css";
import type { ProjectBadgesProps } from "./types";

const ProjectBadges = ({
  projects,
  selectedProjects,
  onProjectToggle,
  onProjectDelete,
}: ProjectBadgesProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  useEffect(() => {
    if (confirmingDelete) {
      const timer = setTimeout(() => {
        setConfirmingDelete(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [confirmingDelete]);

  const handleBadgeClick = (project: string) => {
    // Don't toggle if we're in delete confirmation mode
    if (confirmingDelete === project) return;
    onProjectToggle(project);
  };

  const handleDeleteClick = (e: React.MouseEvent, project: string) => {
    e.stopPropagation();

    if (confirmingDelete === project) {
      // Confirm delete
      onProjectDelete(project);
      setConfirmingDelete(null);
    } else {
      // Start confirmation
      setConfirmingDelete(project);
    }
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className={s.container}>
      {projects.map((project) => {
        const isSelected = selectedProjects.includes(project);
        const isConfirming = confirmingDelete === project;

        return (
          <button
            key={project}
            type="button"
            className={`${s.badge} ${isSelected ? s.selected : ""} ${isConfirming ? s.confirming : ""}`}
            onClick={() => handleBadgeClick(project)}
            aria-label={`${isSelected ? "Deselect" : "Select"} project ${project}`}
            aria-pressed={isSelected}
          >
            <span className={s.name}>{project}</span>
            <button
              type="button"
              className={s.deleteButton}
              onClick={(e) => handleDeleteClick(e, project)}
              aria-label={
                isConfirming
                  ? `Confirm delete project ${project}`
                  : `Delete project ${project}`
              }
            >
              {isConfirming ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Trash2 size={14} aria-hidden="true" />
              )}
            </button>
          </button>
        );
      })}
    </div>
  );
};

export default ProjectBadges;
