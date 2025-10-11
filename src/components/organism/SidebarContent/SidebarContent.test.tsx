import { render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import SidebarContent from "./SidebarContent";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
	useTheme: vi.fn(),
}));

describe("SidebarContent", () => {
	const mockTheme: Theme = {
		name: "Test Theme",
		description: "Test Description",
		colorMode: "light",
		mainColors: {
			surface: {
				100: new Color("oklch", [1, 0, 0]),
			},
			content: {
				100: new Color("oklch", [0.2, 0, 0]),
			},
			border: {
				100: new Color("oklch", [0.5, 0, 0]),
			},
		},
		brandColors: {
			primary: {
				100: new Color("oklch", [0.7, 0.2, 260]),
			},
		},
		radius: {
			sm: "0.25rem",
		},
		shadows: {
			sm: "0 1px 2px oklch(0 0 0 / 0.1)",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders all sections when theme exists", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			// Verify all section titles are present
			expect(screen.getByText("Main Colors")).toBeInTheDocument();
			expect(screen.getByText("Brand Colors")).toBeInTheDocument();
			expect(screen.getByText("Border Radius")).toBeInTheDocument();
			expect(screen.getByText("Box Shadows")).toBeInTheDocument();
		});

		it("renders MainColorsSection with correct groups", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			// Main color groups
			expect(screen.getByText("surface")).toBeInTheDocument();
			expect(screen.getByText("content")).toBeInTheDocument();
			expect(screen.getByText("border")).toBeInTheDocument();
		});

		it("renders BrandColorsSection with correct groups", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			// Brand color group (editable input)
			expect(screen.getByDisplayValue("primary")).toBeInTheDocument();
		});

		it("renders RadiusSection with variants", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			// Radius picker
			expect(
				screen.getByLabelText("Select border radius radius-sm"),
			).toBeInTheDocument();
		});

		it("renders ShadowsSection with variants", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			// Shadow picker
			expect(
				screen.getByLabelText("Select box shadow sm"),
			).toBeInTheDocument();
		});
	});

	describe("Null Theme", () => {
		it("returns null when currentTheme is null", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: null,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			const { container } = render(<SidebarContent />);
			expect(container.firstChild).toBeNull();
		});

		it("does not render any sections when theme is null", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: null,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			render(<SidebarContent />);

			expect(screen.queryByText("Main Colors")).not.toBeInTheDocument();
			expect(screen.queryByText("Brand Colors")).not.toBeInTheDocument();
			expect(screen.queryByText("Border Radius")).not.toBeInTheDocument();
			expect(screen.queryByText("Box Shadows")).not.toBeInTheDocument();
		});
	});

	describe("Integration", () => {
		it("renders all sections in correct order", () => {
			vi.mocked(useTheme).mockReturnValue({
				currentTheme: mockTheme,
				updateMainColor: vi.fn(),
				updateBrandColor: vi.fn(),
				addColorToGroup: vi.fn(),
				removeLastColorFromGroup: vi.fn(),
				addContentColorToGroup: vi.fn(),
				removeContentColorFromGroup: vi.fn(),
				changeColorGroupName: vi.fn(),
				removeColorGroup: vi.fn(),
				addNewColorGroup: vi.fn(),
				updateRadius: vi.fn(),
				updateShadow: vi.fn(),
				removeRadius: vi.fn(),
				removeShadow: vi.fn(),
			});

			const { container } = render(<SidebarContent />);

			const sections = container.querySelectorAll("section");
			expect(sections).toHaveLength(4);

			// Verify order
			expect(sections[0].querySelector("h3")?.textContent).toBe("Main Colors");
			expect(sections[1].querySelector("h3")?.textContent).toBe("Brand Colors");
			expect(sections[2].querySelector("h3")?.textContent).toBe("Border Radius");
			expect(sections[3].querySelector("h3")?.textContent).toBe("Box Shadows");
		});
	});
});
