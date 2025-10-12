import type { Theme } from "@/types/Theme";

/**
 * Represents a saved theme in the library with metadata
 */
export interface SavedTheme {
  /** Unique identifier for the saved theme */
  id: string;
  /** The theme data */
  theme: Theme;
  /** Project name this theme belongs to */
  project?: string;
  /** Timestamp when the theme was saved */
  savedAt: number;
}

/**
 * Props for the LibraryModal component
 */
export interface LibraryModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Current theme to be saved */
  currentTheme: Theme;
  /** Callback when a theme is loaded from library */
  onLoadTheme: (theme: Theme) => void;
}

/**
 * Props for the ThemeCard component
 */
export interface ThemeCardProps {
  /** The saved theme to display */
  savedTheme: SavedTheme;
  /** Callback when delete button is clicked */
  onDelete: (id: string) => void;
  /** Callback when load button is clicked */
  onLoad: (theme: Theme) => void;
}

/**
 * Props for the FilterBar component
 */
export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
}

/**
 * Props for the ProjectSelector component
 */
export interface ProjectSelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Available projects */
  projects: string[];
  /** Currently selected project */
  selectedProject?: string;
  /** Callback when project is selected */
  onProjectSelect: (project: string) => void;
  /** Callback to add a new project */
  onAddProject: (projectName: string) => void;
}

/**
 * Theme statistics for display
 */
export interface ThemeStats {
  /** Number of main colors */
  mainColorsCount: number;
  /** Number of brand colors */
  brandColorsCount: number;
  /** Number of shadow variants */
  shadowsCount: number;
  /** Number of radius variants */
  radiusCount: number;
}
