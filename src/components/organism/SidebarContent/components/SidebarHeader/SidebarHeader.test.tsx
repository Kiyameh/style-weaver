import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarHeader } from "./SidebarHeader";

describe("SidebarHeader", () => {
	const mockOnNameChange = vi.fn();
	const mockOnDescriptionChange = vi.fn();
	const mockOnColorModeChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders all fields", () => {
			render(
				<SidebarHeader
					themeName="Test Theme"
					themeDescription="Test Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			expect(screen.getByPlaceholderText("A fancy name")).toBeInTheDocument();
			expect(
				screen.getByPlaceholderText("¿What is this theme about?"),
			).toBeInTheDocument();
			expect(screen.getByDisplayValue("Test Theme")).toBeInTheDocument();
			expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
		});

		it("renders theme name input with value", () => {
			render(
				<SidebarHeader
					themeName="My Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByDisplayValue("My Theme");
			expect(nameInput).toHaveValue("My Theme");
		});

		it("renders description textarea with value", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="A beautiful theme"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByDisplayValue("A beautiful theme");
			expect(descriptionInput).toHaveValue("A beautiful theme");
		});

		it("renders color mode select with value", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="dark"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const colorModeSelect = screen.getByDisplayValue("Better for dark");
			expect(colorModeSelect).toHaveValue("dark");
		});

		it("renders color mode select with empty value when undefined", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode={undefined}
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const colorModeSelect = screen.getByDisplayValue("No preference");
			expect(colorModeSelect).toHaveValue("");
		});
	});

	describe("Theme Name Input", () => {
		it("calls onNameChange when name input changes", () => {
			render(
				<SidebarHeader
					themeName="Old Name"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByDisplayValue("Old Name");
			fireEvent.change(nameInput, { target: { value: "New Name" } });

			expect(mockOnNameChange).toHaveBeenCalledWith("New Name");
			expect(mockOnNameChange).toHaveBeenCalledTimes(1);
		});

		it("has maxLength of 50", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByPlaceholderText("A fancy name");
			expect(nameInput).toHaveAttribute("maxLength", "50");
		});

		it("has placeholder text", () => {
			render(
				<SidebarHeader
					themeName=""
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByPlaceholderText("A fancy name");
			expect(nameInput).toHaveAttribute("placeholder", "A fancy name");
		});
	});

	describe("Description Textarea", () => {
		it("calls onDescriptionChange when description changes", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Old Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByDisplayValue("Old Description");
			fireEvent.change(descriptionInput, {
				target: { value: "New Description" },
			});

			expect(mockOnDescriptionChange).toHaveBeenCalledWith("New Description");
			expect(mockOnDescriptionChange).toHaveBeenCalledTimes(1);
		});

		it("has maxLength of 200", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByDisplayValue("Description");
			expect(descriptionInput).toHaveAttribute("maxLength", "200");
		});

		it("has placeholder text", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription=""
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByPlaceholderText(
				"¿What is this theme about?",
			);
			expect(descriptionInput).toHaveAttribute(
				"placeholder",
				"¿What is this theme about?",
			);
		});

		it("does not have rows attribute (uses field-sizing)", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByDisplayValue("Description");
			expect(descriptionInput).not.toHaveAttribute("rows");
		});
	});

	describe("Color Mode Select", () => {
		it("calls onColorModeChange with 'light' when light is selected", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="dark"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const colorModeSelect = screen.getByDisplayValue("Better for dark");
			fireEvent.change(colorModeSelect, { target: { value: "light" } });

			expect(mockOnColorModeChange).toHaveBeenCalledWith("light");
			expect(mockOnColorModeChange).toHaveBeenCalledTimes(1);
		});

		it("calls onColorModeChange with 'dark' when dark is selected", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const colorModeSelect = screen.getByDisplayValue("Better for light");
			fireEvent.change(colorModeSelect, { target: { value: "dark" } });

			expect(mockOnColorModeChange).toHaveBeenCalledWith("dark");
			expect(mockOnColorModeChange).toHaveBeenCalledTimes(1);
		});

		it("calls onColorModeChange with undefined when No preference is selected", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const colorModeSelect = screen.getByDisplayValue("Better for light");
			fireEvent.change(colorModeSelect, { target: { value: "" } });

			expect(mockOnColorModeChange).toHaveBeenCalledWith(undefined);
			expect(mockOnColorModeChange).toHaveBeenCalledTimes(1);
		});

		it("renders all color mode options", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			expect(
				screen.getByRole("option", { name: "No preference" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Better for light" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Better for dark" }),
			).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has proper IDs for inputs", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByDisplayValue("Theme");
			const descriptionInput = screen.getByDisplayValue("Description");
			const colorModeSelect = screen.getByDisplayValue("Better for light");

			expect(nameInput).toHaveAttribute("id", "theme-name");
			expect(descriptionInput).toHaveAttribute("id", "theme-description");
			expect(colorModeSelect).toHaveAttribute("id", "theme-color-mode");
		});

		it("has proper input types", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByDisplayValue("Theme");
			expect(nameInput).toHaveAttribute("type", "text");
		});
	});

	describe("Edge Cases", () => {
		it("handles empty theme name", () => {
			render(
				<SidebarHeader
					themeName=""
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByPlaceholderText("A fancy name");
			expect(nameInput).toHaveValue("");
		});

		it("handles empty description", () => {
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription=""
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByPlaceholderText(
				"¿What is this theme about?",
			);
			expect(descriptionInput).toHaveValue("");
		});

		it("handles long theme name", () => {
			const longName = "A".repeat(50);
			render(
				<SidebarHeader
					themeName={longName}
					themeDescription="Description"
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const nameInput = screen.getByDisplayValue(longName);
			expect(nameInput).toHaveValue(longName);
		});

		it("handles long description", () => {
			const longDescription = "A".repeat(200);
			render(
				<SidebarHeader
					themeName="Theme"
					themeDescription={longDescription}
					colorMode="light"
					onNameChange={mockOnNameChange}
					onDescriptionChange={mockOnDescriptionChange}
					onColorModeChange={mockOnColorModeChange}
				/>,
			);

			const descriptionInput = screen.getByDisplayValue(longDescription);
			expect(descriptionInput).toHaveValue(longDescription);
		});
	});
});
