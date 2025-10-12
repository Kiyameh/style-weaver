import { FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import type { ProjectSelectorProps } from "../../types";
import s from "./ProjectSelector.module.css";

const ProjectSelector = ({
  projects,
  selectedProject,
  onProjectSelect,
  onAddProject,
  className,
  ...props
}: ProjectSelectorProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewProjectName("");
    setIsAdding(false);
  };

  return (
    <div {...props} className={`${s.container} ${className || ""}`}>
      <div className={s.header}>
        <FolderPlus size={18} aria-hidden="true" />
        <span className={s.title}>Project</span>
      </div>

      {isAdding ? (
        <form className={s.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={s.input}
            placeholder="Project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            aria-label="New project name"
          />
          <div className={s.formActions}>
            <button
              type="submit"
              className={s.submitButton}
              disabled={!newProjectName.trim()}
              aria-label="Add project"
            >
              Add
            </button>
            <button
              type="button"
              className={s.cancelButton}
              onClick={handleCancel}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={s.content}>
          <select
            className={s.select}
            value={selectedProject || ""}
            onChange={(e) => onProjectSelect(e.target.value)}
            aria-label="Select project"
          >
            <option value="">No Project</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={s.addButton}
            onClick={() => setIsAdding(true)}
            aria-label="Create new project"
          >
            <Plus size={16} aria-hidden="true" />
            <span>New</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
