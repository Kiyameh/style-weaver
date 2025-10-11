import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import { RadiusSection } from "./RadiusSection";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

describe("RadiusSection", () => {
  const mockTheme: Theme = {
    name: "Test Theme",
    description: "Test",
    colorMode: "light",
    mainColors: {
      surface: {},
      content: {},
      border: {},
    },
    brandColors: {},
    radius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
    },
    shadows: {},
  };

  const mockUpdateRadius = vi.fn();
  const mockRemoveRadius = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      currentTheme: mockTheme,
      updateRadius: mockUpdateRadius,
      removeRadius: mockRemoveRadius,
      updateMainColor: vi.fn(),
      updateBrandColor: vi.fn(),
      addColorToGroup: vi.fn(),
      removeLastColorFromGroup: vi.fn(),
      addContentColorToGroup: vi.fn(),
      removeContentColorFromGroup: vi.fn(),
      changeColorGroupName: vi.fn(),
      removeColorGroup: vi.fn(),
      addNewColorGroup: vi.fn(),
      updateShadow: vi.fn(),
      removeShadow: vi.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders section title", () => {
      render(<RadiusSection />);
      expect(screen.getByText("Border Radius")).toBeInTheDocument();
    });

    it("renders variant count", () => {
      render(<RadiusSection />);
      expect(screen.getByText("3 Variants")).toBeInTheDocument();
    });

    it("renders RadiusPicker for each radius variant", () => {
      render(<RadiusSection />);

      expect(screen.getByLabelText("Select border radius radius-sm")).toBeInTheDocument();
      expect(screen.getByLabelText("Select border radius radius-md")).toBeInTheDocument();
      expect(screen.getByLabelText("Select border radius radius-lg")).toBeInTheDocument();
    });

    it("renders variant control buttons", () => {
      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      const removeButton = screen.getByRole("button", { name: "-" });
      
      expect(addButton).toBeInTheDocument();
      expect(removeButton).toBeInTheDocument();
    });

    it("returns null when currentTheme is null", () => {
      vi.mocked(useTheme).mockReturnValue({
        currentTheme: null,
        updateRadius: vi.fn(),
        removeRadius: vi.fn(),
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      const { container } = render(<RadiusSection />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Variant Controls", () => {
    it("calls updateRadius when + button is clicked", () => {
      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateRadius).toHaveBeenCalledWith("xl", "1rem");
    });

    it("calls removeRadius when - button is clicked", () => {
      render(<RadiusSection />);

      const removeButton = screen.getByRole("button", { name: "-" });
      fireEvent.click(removeButton);

      expect(mockRemoveRadius).toHaveBeenCalledWith("lg");
    });

    it("disables - button when only 1 variant exists", () => {
      const themeWithOneVariant: Theme = {
        ...mockTheme,
        radius: {
          sm: "0.25rem",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneVariant,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      const removeButton = screen.getByRole("button", { name: "-" });
      expect(removeButton).toBeDisabled();
    });

    it("disables + button when 10 variants exist", () => {
      const themeWithTenVariants: Theme = {
        ...mockTheme,
        radius: {
          sm: "0.25rem",
          md: "0.5rem",
          lg: "1rem",
          xl: "1.5rem",
          "2xl": "2rem",
          "3xl": "2.5rem",
          "4xl": "3rem",
          "5xl": "3.5rem",
          "6xl": "4rem",
          "7xl": "4.5rem",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithTenVariants,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      expect(addButton).toBeDisabled();
    });

    it("uses default value when adding first variant", () => {
      const themeWithNoRadius: Theme = {
        ...mockTheme,
        radius: {},
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithNoRadius,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateRadius).toHaveBeenCalledWith("sm", "0.5rem");
    });

    it("generates next key correctly", () => {
      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      // Current keys: sm, md, lg -> next should be xl
      expect(mockUpdateRadius).toHaveBeenCalledWith("xl", "1rem");
    });

    it("copies value from last variant when adding", () => {
      const themeWithCustomValue: Theme = {
        ...mockTheme,
        radius: {
          sm: "0.25rem",
          md: "2rem", // Custom value
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithCustomValue,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateRadius).toHaveBeenCalledWith("lg", "2rem");
    });
  });

  describe("Radius Updates", () => {
    it("opens RadiusPicker popover when button is clicked", () => {
      render(<RadiusSection />);

      const radiusPickerButton = screen.getByLabelText("Select border radius radius-sm");
      fireEvent.click(radiusPickerButton);

      // Should show the radius input controls
      expect(screen.getByText("radius-sm")).toBeInTheDocument();
    });

    it("renders all radius pickers with correct labels", () => {
      render(<RadiusSection />);

      expect(screen.getByLabelText("Select border radius radius-sm")).toBeInTheDocument();
      expect(screen.getByLabelText("Select border radius radius-md")).toBeInTheDocument();
      expect(screen.getByLabelText("Select border radius radius-lg")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty radius object", () => {
      const themeWithNoRadius: Theme = {
        ...mockTheme,
        radius: {},
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithNoRadius,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      expect(screen.getByText("0 Variants")).toBeInTheDocument();
      expect(screen.queryByLabelText(/Select border radius/)).not.toBeInTheDocument();
    });

    it("handles single radius variant", () => {
      const themeWithOneRadius: Theme = {
        ...mockTheme,
        radius: {
          md: "0.5rem",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneRadius,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      expect(screen.getByText("1 Variants")).toBeInTheDocument();
      expect(screen.getByLabelText("Select border radius radius-md")).toBeInTheDocument();
    });

    it("handles extended keys beyond predefined", () => {
      const themeWithExtendedKeys: Theme = {
        ...mockTheme,
        radius: {
          "7xl": "4.5rem",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithExtendedKeys,
        updateRadius: mockUpdateRadius,
        removeRadius: mockRemoveRadius,
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        changeColorGroupName: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
      });

      render(<RadiusSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      // Should generate 8xl
      expect(mockUpdateRadius).toHaveBeenCalledWith("8xl", "4.5rem");
    });
  });
});
