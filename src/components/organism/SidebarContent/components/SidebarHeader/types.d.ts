export interface SidebarHeaderProps {
	/**
	 * Current theme name
	 */
	themeName: string;

	/**
	 * Current theme description
	 */
	themeDescription: string;

	/**
	 * Current color mode
	 */
	colorMode: "dark" | "light" | undefined;

	/**
	 * Callback when theme name changes
	 */
	onNameChange: (newName: string) => void;

	/**
	 * Callback when theme description changes
	 */
	onDescriptionChange: (newDescription: string) => void;

	/**
	 * Callback when color mode changes
	 */
	onColorModeChange: (newMode: "dark" | "light" | undefined) => void;
}
