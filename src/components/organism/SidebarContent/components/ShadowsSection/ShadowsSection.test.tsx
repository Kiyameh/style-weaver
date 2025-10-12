import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import { ShadowsSection } from "./ShadowsSection";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

describe("ShadowsSection", () => {
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
    radius: {},
    shadows: {
      sm: "0 1px 2px oklch(0 0 0 / 0.1)",
      md: "0 2px 4px oklch(0 0 0 / 0.1)",
      lg: "0 4px 8px oklch(0 0 0 / 0.1)",
    },
  };

  const mockUpdateShadow = vi.fn();
  const mockRemoveShadow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      currentTheme: mockTheme,
      resetTheme: vi.fn(),
      updateThemeName: vi.fn(),
      updateThemeDescription: vi.fn(),
      updateThemeColorMode: vi.fn(),
      updateShadow: mockUpdateShadow,
      removeShadow: mockRemoveShadow,
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
      removeRadius: vi.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders section title", () => {
      render(<ShadowsSection />);
      expect(screen.getByText("Box Shadows")).toBeInTheDocument();
    });

    it("renders variant count", () => {
      render(<ShadowsSection />);
      expect(screen.getByText("3 Variants")).toBeInTheDocument();
    });

    it("renders ShadowPicker for each shadow variant", () => {
      render(<ShadowsSection />);

      expect(screen.getByLabelText("Select box shadow sm")).toBeInTheDocument();
      expect(screen.getByLabelText("Select box shadow md")).toBeInTheDocument();
      expect(screen.getByLabelText("Select box shadow lg")).toBeInTheDocument();
    });

    it("renders variant control buttons", () => {
      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      const removeButton = screen.getByRole("button", { name: "-" });

      expect(addButton).toBeInTheDocument();
      expect(removeButton).toBeInTheDocument();
    });

    it("returns null when currentTheme is null", () => {
      vi.mocked(useTheme).mockReturnValue({
        currentTheme: null,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: vi.fn(),
        removeShadow: vi.fn(),
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
        removeRadius: vi.fn(),
      });

      const { container } = render(<ShadowsSection />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Variant Controls", () => {
    it("calls updateShadow when + button is clicked", () => {
      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateShadow).toHaveBeenCalledWith(
        "xl",
        "0 4px 8px oklch(0 0 0 / 0.1)",
      );
    });

    it("calls removeShadow when - button is clicked", () => {
      render(<ShadowsSection />);

      const removeButton = screen.getByRole("button", { name: "-" });
      fireEvent.click(removeButton);

      expect(mockRemoveShadow).toHaveBeenCalledWith("lg");
    });

    it("disables - button when only 1 variant exists", () => {
      const themeWithOneVariant: Theme = {
        ...mockTheme,
        shadows: {
          sm: "0 1px 2px oklch(0 0 0 / 0.1)",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneVariant,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      const removeButton = screen.getByRole("button", { name: "-" });
      expect(removeButton).toBeDisabled();
    });

    it("disables + button when 10 variants exist", () => {
      const themeWithTenVariants: Theme = {
        ...mockTheme,
        shadows: {
          sm: "0 1px 2px oklch(0 0 0 / 0.1)",
          md: "0 2px 4px oklch(0 0 0 / 0.1)",
          lg: "0 4px 8px oklch(0 0 0 / 0.1)",
          xl: "0 8px 16px oklch(0 0 0 / 0.1)",
          "2xl": "0 16px 32px oklch(0 0 0 / 0.1)",
          "3xl": "0 24px 48px oklch(0 0 0 / 0.1)",
          "4xl": "0 32px 64px oklch(0 0 0 / 0.1)",
          "5xl": "0 40px 80px oklch(0 0 0 / 0.1)",
          "6xl": "0 48px 96px oklch(0 0 0 / 0.1)",
          "7xl": "0 56px 112px oklch(0 0 0 / 0.1)",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithTenVariants,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      expect(addButton).toBeDisabled();
    });

    it("uses default value when adding first variant", () => {
      const themeWithNoShadows: Theme = {
        ...mockTheme,
        shadows: {},
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithNoShadows,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateShadow).toHaveBeenCalledWith(
        "sm",
        "0 2px 4px oklch(0 0 0 / 0.1)",
      );
    });

    it("generates next key correctly", () => {
      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      // Current keys: sm, md, lg -> next should be xl
      expect(mockUpdateShadow).toHaveBeenCalledWith(
        "xl",
        "0 4px 8px oklch(0 0 0 / 0.1)",
      );
    });

    it("copies value from last variant when adding", () => {
      const themeWithCustomValue: Theme = {
        ...mockTheme,
        shadows: {
          sm: "0 1px 2px oklch(0 0 0 / 0.1)",
          md: "inset 0 4px 8px oklch(0.5 0.1 180 / 0.5)", // Custom value
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithCustomValue,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(mockUpdateShadow).toHaveBeenCalledWith(
        "lg",
        "inset 0 4px 8px oklch(0.5 0.1 180 / 0.5)",
      );
    });
  });

  describe("Shadow Updates", () => {
    it("opens ShadowPicker popover when button is clicked", () => {
      render(<ShadowsSection />);

      const shadowPickerButton = screen.getByLabelText("Select box shadow sm");
      fireEvent.click(shadowPickerButton);

      // Should show the shadow input controls
      expect(screen.getByText("shadow-sm")).toBeInTheDocument();
    });

    it("renders all shadow pickers with correct labels", () => {
      render(<ShadowsSection />);

      expect(screen.getByLabelText("Select box shadow sm")).toBeInTheDocument();
      expect(screen.getByLabelText("Select box shadow md")).toBeInTheDocument();
      expect(screen.getByLabelText("Select box shadow lg")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty shadows object", () => {
      const themeWithNoShadows: Theme = {
        ...mockTheme,
        shadows: {},
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithNoShadows,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      expect(screen.getByText("0 Variants")).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Select box shadow/),
      ).not.toBeInTheDocument();
    });

    it("handles single shadow variant", () => {
      const themeWithOneShadow: Theme = {
        ...mockTheme,
        shadows: {
          md: "0 2px 4px oklch(0 0 0 / 0.1)",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithOneShadow,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      expect(screen.getByText("1 Variants")).toBeInTheDocument();
      expect(screen.getByLabelText("Select box shadow md")).toBeInTheDocument();
    });

    it("handles extended keys beyond predefined", () => {
      const themeWithExtendedKeys: Theme = {
        ...mockTheme,
        shadows: {
          "7xl": "0 56px 112px oklch(0 0 0 / 0.1)",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithExtendedKeys,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      // Should generate 8xl
      expect(mockUpdateShadow).toHaveBeenCalledWith(
        "8xl",
        "0 56px 112px oklch(0 0 0 / 0.1)",
      );
    });

    it("handles inset shadows", () => {
      const themeWithInsetShadow: Theme = {
        ...mockTheme,
        shadows: {
          sm: "inset 0 1px 2px oklch(0 0 0 / 0.1)",
        },
      };

      vi.mocked(useTheme).mockReturnValue({
        currentTheme: themeWithInsetShadow,
        resetTheme: vi.fn(),
        updateThemeName: vi.fn(),
        updateThemeDescription: vi.fn(),
        updateThemeColorMode: vi.fn(),
        updateShadow: mockUpdateShadow,
        removeShadow: mockRemoveShadow,
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
        removeRadius: vi.fn(),
      });

      render(<ShadowsSection />);

      expect(screen.getByLabelText("Select box shadow sm")).toBeInTheDocument();
    });
  });
});
