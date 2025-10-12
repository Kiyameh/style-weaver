export interface ProjectBadgesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** List of available projects */
  projects: string[];
  /** List of currently selected projects */
  selectedProjects: string[];
  /** Callback when a project is toggled */
  onProjectToggle: (project: string) => void;
  /** Callback when a project is deleted */
  onProjectDelete: (project: string) => void;
}
