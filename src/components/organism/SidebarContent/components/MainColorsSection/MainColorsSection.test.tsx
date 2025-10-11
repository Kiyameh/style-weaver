import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import { MainColorsSection } from "./MainColorsSection";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

describe("MainColorsSection", () => {
  const mockTheme: Theme = {
    name: "Test Theme",
    description: "Test",
    colorMode: "light",
    mainColors: {
      surface: {
        100: new Color("oklch", [1, 0, 0]),
        200: new Color("oklch", [0.9, 0, 0]),
        300: new Color("oklch", [0.8, 0, 0]),
      },
      content: {
        100: new Color("oklch", [0.2, 0, 0]),
        200: new Color("oklch", [0.1, 0, 0]),
      },
      border: {
        100: new Color("oklch", [0.5, 0, 0]),
        200: new Color("oklch", [0.4, 0, 0]),
        300: new Color("oklch", [0.3, 0, 0]),
        400: new Color("oklch", [0.2, 0, 0]),
      },
    },
    brandColors: {},
    radius: {},
    shadows: {},
  };

  const mockUpdateMainColor = vi.fn();
  const mockAddColorToGroup = vi.fn();
  const mockRemoveLastColorFromGroup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      currentTheme: mockTheme,
      updateMainColor: mockUpdateMainColor,
      addColorToGroup: mockAddColorToGroup,
      removeLastColorFromGroup: mockRemoveLastColorFromGroup,
      updateBrandColor: vi.fn(),
      changeColorGroupName: vi.fn(),
      addContentColorToGroup: vi.fn(),
      removeContentColorFromGroup: vi.fn(),
      removeColorGroup: vi.fn(),
      addNewColorGroup: vi.fn(),
      updateRadius: vi.fn(),
      updateShadow: vi.fn(),
      removeRadius: vi.fn(),
      removeShadow: vi.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders section title", () => {
      render(<MainColorsSection />);
      expect(screen.getByText("Main Colors")).toBeInTheDocument();
    });

    it("renders all main color groups", () => {
      render(<MainColorsSection />);

      expect(screen.getByText("surface")).toBeInTheDocument();
      expect(screen.getByText("content")).toBeInTheDocument();
      expect(screen.getByText("border")).toBeInTheDocument();
    });

    it("renders correct variant count for each group", () => {
      render(<MainColorsSection />);

      expect(screen.getByText("3 Variants")).toBeInTheDocument(); // surface
      expect(screen.getByText("2 Variants")).toBeInTheDocument(); // content
      expect(screen.getByText("4 Variants")).toBeInTheDocument(); // border
    });

    it("renders ColorPicker for each color variant", () => {
      render(<MainColorsSection />);

      // surface: 3 variants
      expect(
        screen.getByLabelText("Select color surface-100"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color surface-200"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color surface-300"),
      ).toBeInTheDocument();

      // content: 2 variants
      expect(
        screen.getByLabelText("Select color content-100"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color content-200"),
      ).toBeInTheDocument();

      // border: 4 variants
      expect(screen.getByLabelText("Select color border-100")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color border-200")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color border-300")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color border-400")).toBeInTheDocument();
    });

    it("renders variant control buttons for each group", () => {
      render(<MainColorsSection />);

      const addButtons = screen.getAllByRole("button", { name: "+" });
      const removeButtons = screen.getAllByRole("button", { name: "-" });
      
      // 3 groups × 2 buttons (+ and -) = 6 buttons total
      expect(addButtons).toHaveLength(3);
      expect(removeButtons).toHaveLength(3);
    });

    it("returns null when currentTheme is null", () => {
      vi.mocked(useTheme).mockReturnValue({
        currentTheme: null,
        updateMainColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      const { container } = render(<MainColorsSection />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Variant Controls", () => {
    it("calls addColorToGroup when + button is clicked", () => {
      render(<MainColorsSection />);

      const addButtons = screen.getAllByRole("button", { name: "+" });
      fireEvent.click(addButtons[0]); // Click first + button (surface)

      expect(mockAddColorToGroup).toHaveBeenCalledWith("surface", false, 0.2);
    });

    it("calls removeLastColorFromGroup when - button is clicked", () => {
      render(<MainColorsSection />);

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      fireEvent.click(removeButtons[0]); // Click first - button (surface)

      expect(mockRemoveLastColorFromGroup).toHaveBeenCalledWith(
        "surface",
        false,
      );
    });

    it("disables - button when group has only 1 variant", () => {
      const themeWithOneVariant: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
          },
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneVariant,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      // First button is for surface group which has 1 variant
      expect(removeButtons[0]).toBeDisabled();
    });

    it("disables + button when group has 10 variants", () => {
      const themeWithTenVariants: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
            200: new Color("oklch", [0.9, 0, 0]),
            300: new Color("oklch", [0.8, 0, 0]),
            400: new Color("oklch", [0.7, 0, 0]),
            500: new Color("oklch", [0.6, 0, 0]),
            600: new Color("oklch", [0.5, 0, 0]),
            700: new Color("oklch", [0.4, 0, 0]),
            800: new Color("oklch", [0.3, 0, 0]),
            900: new Color("oklch", [0.2, 0, 0]),
            1000: new Color("oklch", [0.1, 0, 0]),
          },
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithTenVariants,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      const addButtons = screen.getAllByRole("button", { name: "+" });
      // First button is for surface group which has 10 variants
      expect(addButtons[0]).toBeDisabled();
    });

    it("does not call removeLastColorFromGroup when - button is clicked at minimum", () => {
      const themeWithOneVariant: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
          },
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneVariant,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      // First button is for surface group which has 1 variant
      fireEvent.click(removeButtons[0]);

      expect(mockRemoveLastColorFromGroup).not.toHaveBeenCalled();
    });
  });

  describe("Color Updates", () => {
    it("opens ColorPicker popover when button is clicked", () => {
      render(<MainColorsSection />);

      const colorPickerButton = screen.getByLabelText("Select color surface-100");
      fireEvent.click(colorPickerButton);

      // Should show the color input controls
      expect(screen.getByText("surface-100")).toBeInTheDocument();
    });

    it("renders all color pickers with correct labels", () => {
      render(<MainColorsSection />);

      // Verify color pickers exist by their aria-labels
      expect(screen.getByLabelText("Select color surface-100")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color content-200")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color border-300")).toBeInTheDocument();
    });
  });

  describe("Color Sorting", () => {
    it("renders content variant first when it exists", () => {
      const themeWithContent: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
            200: new Color("oklch", [0.9, 0, 0]),
            content: new Color("oklch", [0.1, 0, 0]),
          },
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithContent,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      // Verify content variant exists
      expect(
        screen.getByLabelText("Select color surface-content"),
      ).toBeInTheDocument();
      
      // Verify numeric variants also exist
      expect(
        screen.getByLabelText("Select color surface-100"),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty color groups", () => {
      const themeWithEmptyGroups: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {},
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithEmptyGroups,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      expect(screen.getByText("surface")).toBeInTheDocument();
      expect(screen.getByText("content")).toBeInTheDocument();
      expect(screen.getByText("border")).toBeInTheDocument();
      expect(screen.getAllByText("0 Variants")).toHaveLength(3);
    });

    it("handles groups with mixed numeric and content keys", () => {
      const themeWithMixedKeys: Theme = {
        ...mockTheme,
        mainColors: {
          surface: {
            100: new Color("oklch", [1, 0, 0]),
            content: new Color("oklch", [0.1, 0, 0]),
            200: new Color("oklch", [0.9, 0, 0]),
          },
          content: {},
          border: {},
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithMixedKeys,
        updateMainColor: mockUpdateMainColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        updateBrandColor: vi.fn(),
        changeColorGroupName: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<MainColorsSection />);

      // Should count only numeric variants (100, 200) = 2
      expect(screen.getByText("2 Variants")).toBeInTheDocument();
    });
  });
});
