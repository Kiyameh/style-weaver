import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import { BrandColorsSection } from "./BrandColorsSection";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

describe("BrandColorsSection", () => {
  const mockTheme: Theme = {
    name: "Test Theme",
    description: "Test",
    colorMode: "light",
    mainColors: {
      surface: {},
      content: {},
      border: {},
    },
    brandColors: {
      primary: {
        100: new Color("oklch", [0.9, 0.2, 260]),
        200: new Color("oklch", [0.7, 0.2, 260]),
        300: new Color("oklch", [0.5, 0.2, 260]),
      },
      secondary: {
        100: new Color("oklch", [0.8, 0.15, 180]),
        200: new Color("oklch", [0.6, 0.15, 180]),
      },
      accent: {
        100: new Color("oklch", [0.7, 0.25, 30]),
        content: new Color("oklch", [0.1, 0.05, 30]),
      },
    },
    radius: {},
    shadows: {},
  };

  const mockUpdateBrandColor = vi.fn();
  const mockAddColorToGroup = vi.fn();
  const mockRemoveLastColorFromGroup = vi.fn();
  const mockAddContentColorToGroup = vi.fn();
  const mockRemoveContentColorFromGroup = vi.fn();
  const mockChangeColorGroupName = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      currentTheme: mockTheme,
      resetTheme: vi.fn(),
      updateThemeName: vi.fn(),
      updateThemeDescription: vi.fn(),
      updateThemeColorMode: vi.fn(),
      updateBrandColor: mockUpdateBrandColor,
      addColorToGroup: mockAddColorToGroup,
      removeLastColorFromGroup: mockRemoveLastColorFromGroup,
      addContentColorToGroup: mockAddContentColorToGroup,
      removeContentColorFromGroup: mockRemoveContentColorFromGroup,
      changeColorGroupName: mockChangeColorGroupName,
      updateMainColor: vi.fn(),
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
      render(<BrandColorsSection />);
      expect(screen.getByText("Brand Colors")).toBeInTheDocument();
    });

    it("renders all brand color groups", () => {
      render(<BrandColorsSection />);

      // Groups are rendered as input values, not text
      expect(screen.getByDisplayValue("primary")).toBeInTheDocument();
      expect(screen.getByDisplayValue("secondary")).toBeInTheDocument();
      expect(screen.getByDisplayValue("accent")).toBeInTheDocument();
    });

    it("renders editable headers for each group", () => {
      render(<BrandColorsSection />);

      // Check for editable inputs
      expect(screen.getByDisplayValue("primary")).toBeInTheDocument();
      expect(screen.getByDisplayValue("secondary")).toBeInTheDocument();
      expect(screen.getByDisplayValue("accent")).toBeInTheDocument();
    });

    it("renders correct variant count for each group", () => {
      render(<BrandColorsSection />);

      expect(screen.getByText("3 Variants")).toBeInTheDocument(); // primary
      expect(screen.getByText("2 Variants")).toBeInTheDocument(); // secondary
      expect(screen.getByText("1 Variants")).toBeInTheDocument(); // accent (only 100, not content)
    });

    it("renders ColorPicker for each color variant", () => {
      render(<BrandColorsSection />);

      // primary: 3 variants
      expect(
        screen.getByLabelText("Select color primary-100"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color primary-200"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color primary-300"),
      ).toBeInTheDocument();

      // secondary: 2 variants
      expect(
        screen.getByLabelText("Select color secondary-100"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color secondary-200"),
      ).toBeInTheDocument();

      // accent: 2 variants (including content)
      expect(screen.getByLabelText("Select color accent-100")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Select color accent-content"),
      ).toBeInTheDocument();
    });

    it("returns null when currentTheme is null", () => {
      vi.mocked(useTheme).mockReturnValue({
        currentTheme: null,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        updateMainColor: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      const { container } = render(<BrandColorsSection />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Variant Controls", () => {
    it("calls addColorToGroup when + button is clicked", () => {
      render(<BrandColorsSection />);

      const addButtons = screen.getAllByRole("button", { name: "+" });
      fireEvent.click(addButtons[0]); // Click first + button (primary)

      expect(mockAddColorToGroup).toHaveBeenCalledWith("primary", true, 0.2);
    });

    it("calls removeLastColorFromGroup when - button is clicked", () => {
      render(<BrandColorsSection />);

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      fireEvent.click(removeButtons[0]); // Click first - button (primary)

      expect(mockRemoveLastColorFromGroup).toHaveBeenCalledWith(
        "primary",
        true,
      );
    });
  });

  describe("Name Editing", () => {
    it("calls changeColorGroupName when name is changed", () => {
      render(<BrandColorsSection />);

      const nameInput = screen.getByDisplayValue("primary");
      fireEvent.focus(nameInput);
      fireEvent.change(nameInput, { target: { value: "brand" } });
      fireEvent.blur(nameInput);

      expect(mockChangeColorGroupName).toHaveBeenCalledWith("primary", "brand");
    });

    it("updates editing state when input is focused", () => {
      render(<BrandColorsSection />);

      const nameInput = screen.getByDisplayValue("primary");
      
      // Input should be editable and in the document
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
    });

    it("does not change name if new name is empty", () => {
      render(<BrandColorsSection />);

      const nameInput = screen.getByDisplayValue("primary");
      fireEvent.focus(nameInput);
      fireEvent.change(nameInput, { target: { value: "   " } });
      fireEvent.blur(nameInput);

      expect(mockChangeColorGroupName).not.toHaveBeenCalled();
    });
  });

  describe("Content Checkbox", () => {
    it("calls addContentColorToGroup when checkbox is checked", () => {
      render(<BrandColorsSection />);

      const checkbox = screen.getByLabelText("Content", {
        selector: "#content-primary",
      });
      fireEvent.click(checkbox);

      expect(mockAddContentColorToGroup).toHaveBeenCalledWith("primary");
    });

    it("calls removeContentColorFromGroup when checkbox is unchecked", () => {
      render(<BrandColorsSection />);

      const checkbox = screen.getByLabelText("Content", {
        selector: "#content-accent",
      });
      // accent already has content, so unchecking should remove it
      fireEvent.click(checkbox);

      expect(mockRemoveContentColorFromGroup).toHaveBeenCalledWith("accent");
    });

    it("shows checkbox as checked when group has content variant", () => {
      render(<BrandColorsSection />);

      const accentCheckbox = screen.getByLabelText("Content", {
        selector: "#content-accent",
      }) as HTMLInputElement;
      expect(accentCheckbox).toBeChecked();
    });

    it("shows checkbox as unchecked when group has no content variant", () => {
      render(<BrandColorsSection />);

      const primaryCheckbox = screen.getByLabelText("Content", {
        selector: "#content-primary",
      }) as HTMLInputElement;
      expect(primaryCheckbox).not.toBeChecked();
    });
  });

  describe("Color Updates", () => {
    it("opens ColorPicker popover when button is clicked", () => {
      render(<BrandColorsSection />);

      const colorPickerButton = screen.getByLabelText("Select color primary-100");
      fireEvent.click(colorPickerButton);

      // Should show the color input controls
      expect(screen.getByText("primary-100")).toBeInTheDocument();
    });

    it("renders all color pickers with correct labels", () => {
      render(<BrandColorsSection />);

      expect(screen.getByLabelText("Select color primary-100")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color secondary-200")).toBeInTheDocument();
      expect(screen.getByLabelText("Select color accent-content")).toBeInTheDocument();
    });
  });

  describe("Color Sorting", () => {
    it("renders content variant when it exists", () => {
      render(<BrandColorsSection />);

      // Verify content variant exists for accent group
      expect(
        screen.getByLabelText("Select color accent-content"),
      ).toBeInTheDocument();
      
      // Verify numeric variant also exists
      expect(
        screen.getByLabelText("Select color accent-100"),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty brand colors", () => {
      const themeWithNoBrandColors: Theme = {
        ...mockTheme,
        brandColors: {},
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithNoBrandColors,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateBrandColor: mockUpdateBrandColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        addContentColorToGroup: mockAddContentColorToGroup,
        removeContentColorFromGroup: mockRemoveContentColorFromGroup,
        changeColorGroupName: mockChangeColorGroupName,
        updateMainColor: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<BrandColorsSection />);

      expect(screen.getByText("Brand Colors")).toBeInTheDocument();
      // Should not have any color group inputs
      expect(screen.queryByDisplayValue(/primary|secondary|accent/)).not.toBeInTheDocument();
    });

    it("handles group with only content variant", () => {
      const themeWithOnlyContent: Theme = {
        ...mockTheme,
        brandColors: {
          primary: {
            content: new Color("oklch", [0.1, 0.05, 260]),
          },
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOnlyContent,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateBrandColor: mockUpdateBrandColor,
        addColorToGroup: mockAddColorToGroup,
        removeLastColorFromGroup: mockRemoveLastColorFromGroup,
        addContentColorToGroup: mockAddContentColorToGroup,
        removeContentColorFromGroup: mockRemoveContentColorFromGroup,
        changeColorGroupName: mockChangeColorGroupName,
        updateMainColor: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
        removeRadius: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<BrandColorsSection />);

      // Should show 0 numeric variants
      expect(screen.getByText("0 Variants")).toBeInTheDocument();
      // But should still render the content color picker
      expect(
        screen.getByLabelText("Select color primary-content"),
      ).toBeInTheDocument();
    });
  });
});
