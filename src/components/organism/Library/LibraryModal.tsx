import { Library, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FilterBar from "./components/FilterBar";
import ProjectBadges from "./components/ProjectBadges";
import ProjectSelector from "./components/ProjectSelector";
import ThemeCard from "./components/ThemeCard";
import s from "./LibraryModal.module.css";
import type { LibraryModalProps, SavedTheme } from "./types";
import { filterThemes, sortThemesByDate } from "./utils/filterThemes";
import {
  addProject,
  deleteProject,
  deleteTheme,
  getProjects,
  getSavedThemes,
  saveTheme,
} from "./utils/localStorage";

const LibraryModal = ({
  isOpen,
  onClose,
  currentTheme,
  onLoadTheme,
  className,
  ...props
}: LibraryModalProps) => {
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectsFilter, setSelectedProjectsFilter] = useState<
    string[]
  >([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedProjectForSave, setSelectedProjectForSave] = useState<
    string | undefined
  >();

  const loadData = useCallback(() => {
    setSavedThemes(getSavedThemes());
    setProjects(getProjects());
  }, []);

  // Load themes and projects on mount
  useEffect(() => {
    if (isOpen) {
      loadData();
      setShowSaveDialog(false);
      setSelectedProjectForSave(undefined);
    }
  }, [isOpen, loadData]);

  const handleSaveTheme = () => {
    const saved = saveTheme(currentTheme, selectedProjectForSave);
    if (saved) {
      loadData();
      setShowSaveDialog(false);
      setSelectedProjectForSave(undefined);
    }
  };

  const handleOpenSaveDialog = () => {
    setShowSaveDialog(true);
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setSelectedProjectForSave(undefined);
  };

  const handleDeleteTheme = (id: string) => {
    if (deleteTheme(id)) {
      loadData();
    }
  };

  const handleLoadTheme = (theme: typeof currentTheme) => {
    onLoadTheme(theme);
    onClose();
  };

  const handleAddProject = (projectName: string) => {
    if (addProject(projectName)) {
      loadData();
    }
  };

  const handleProjectToggle = (project: string) => {
    setSelectedProjectsFilter((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project],
    );
  };

  const handleProjectDelete = (project: string) => {
    if (deleteProject(project)) {
      // Remove from selected filters
      setSelectedProjectsFilter((prev) => prev.filter((p) => p !== project));
      loadData();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredThemes = sortThemesByDate(
    filterThemes(savedThemes, searchQuery, selectedProjectsFilter),
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <Modal overlay>
    <div
      {...props}
      className={`${s.overlay} ${className || ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-modal-title"
    >
      <div className={s.modal}>
        <button
          type="button"
          className={s.closeButton}
          onClick={onClose}
          aria-label="Close library"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className={s.header}>
          <div className={s.titleRow}>
            <Library size={24} aria-hidden="true" />
            <h2 id="library-modal-title" className={s.title}>
              Theme Library
            </h2>
          </div>
          <p className={s.subtitle}>
            Manage your saved themes and organize them by project
          </p>
        </div>

        <div className={s.controls}>
          {showSaveDialog ? (
            <div className={s.saveDialog}>
              <p className={s.saveDialogTitle}>
                Select a project for this theme
              </p>
              <div className={s.saveDialogContent}>
                <ProjectSelector
                  projects={projects}
                  selectedProject={selectedProjectForSave}
                  onProjectSelect={setSelectedProjectForSave}
                  onAddProject={handleAddProject}
                />
                <div className={s.saveDialogActions}>
                  <button
                    type="button"
                    className={s.saveConfirmButton}
                    onClick={handleSaveTheme}
                    aria-label="Confirm save theme"
                  >
                    <Plus size={18} aria-hidden="true" />
                    <span>Save Theme</span>
                  </button>
                  <button
                    type="button"
                    className={s.saveCancelButton}
                    onClick={handleCancelSave}
                    aria-label="Cancel save"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={s.saveButton}
              onClick={handleOpenSaveDialog}
              aria-label="Save current theme to library"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Save Current Theme</span>
            </button>
          )}

          <div className={s.filterSection}>
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <ProjectBadges
              projects={projects}
              selectedProjects={selectedProjectsFilter}
              onProjectToggle={handleProjectToggle}
              onProjectDelete={handleProjectDelete}
            />
          </div>
        </div>

        <div className={s.content}>
          {filteredThemes.length === 0 ? (
            <div className={s.empty}>
              <Library size={48} aria-hidden="true" />
              <p className={s.emptyTitle}>No themes found</p>
              <p className={s.emptyText}>
                {savedThemes.length === 0
                  ? "Save your first theme to get started"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className={s.grid}>
              {filteredThemes.map((savedTheme) => (
                <ThemeCard
                  key={savedTheme.id}
                  savedTheme={savedTheme}
                  onDelete={handleDeleteTheme}
                  onLoad={handleLoadTheme}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
