import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DEFAULT_THEME from "@/themes/default";
import type { Theme } from "@/types/Theme";
import CssCodeBox from "./CssCodeBox";

// Mock the entire module
vi.mock("@/utils/theme", () => ({
  generateCssVariables: vi.fn(() => ({})),
}));

describe("CssCodeBox", () => {
  describe("Rendering", () => {
    it("renders the component with theme information", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      expect(screen.getByRole("document")).toBeInTheDocument();
      expect(screen.getByTitle("name")).toBeInTheDocument();
      expect(screen.getByTitle("description")).toBeInTheDocument();
      expect(screen.getByTitle("colorMode")).toBeInTheDocument();
    });
    it("renders CSS root selector", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      const rootSelectors = screen.getAllByText(":root{");
      expect(rootSelectors).toHaveLength(1);

      const closingBraces = screen.getAllByText("}");
      expect(closingBraces).toHaveLength(1);
    });
    it("renders color variables correctly", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      // Check color variables are rendered
      expect(screen.getByText("--primary-100")).toBeInTheDocument();
      expect(screen.getByText("--accent-300")).toBeInTheDocument();
      expect(screen.getByText("--secondary-200")).toBeInTheDocument();
    });
    it("renders radius variables correctly", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      // Check radius variables
      expect(screen.getByText("--radius-s")).toBeInTheDocument();
      expect(screen.getByText("--radius-m")).toBeInTheDocument();
      expect(screen.getByText("--radius-l")).toBeInTheDocument();

      // Check radius values
      expect(screen.getByText("1rem")).toBeInTheDocument();
    });
    it("renders shadow variables correctly", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      // Check shadow variables
      expect(screen.getByText("--shadow-s")).toBeInTheDocument();
      expect(screen.getByText("--shadow-m")).toBeInTheDocument();
      expect(screen.getByText("--shadow-l")).toBeInTheDocument();
    });
  });

  describe("Accesibility", () => {
    it("renders with proper accessibility attributes", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      // Check main section has proper aria-label
      expect(screen.getByLabelText("Código del tema css")).toBeInTheDocument();

      // Check fieldsets have proper aria-labels
      expect(screen.getByLabelText("Variables del tema")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Variables de colores CSS"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Variables de radio CSS"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Variables de sombra CSS"),
      ).toBeInTheDocument();
    });
  });

  describe("functionality", () => {
    it("applies color preview when previewColors is true", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={true} />);

      const colorSpan = screen.getByTitle("Color: oklch(80% 0.25 9)");
      expect(colorSpan).toBeInTheDocument();
      expect(colorSpan).toHaveStyle({
        backgroundColor: "oklch(80% 0.25 9)",
      });
    });

    it("does not apply color preview when previewColors is false", () => {
      render(<CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />);

      const colorSpan = screen.getByTitle("Color: oklch(80% 0.25 9)");
      expect(colorSpan).toBeInTheDocument();
      expect(colorSpan).toHaveStyle({
        backgroundColor: "var(--surface-100)",
      });
    });
  });

  describe("Edge cases", () => {
    it("handles theme with undefined colorMode", () => {
      const themeWithUndefinedMode: Theme = {
        ...DEFAULT_THEME,
        colorMode: undefined,
      };

      render(
        <CssCodeBox
          currentTheme={themeWithUndefinedMode}
          previewColors={false}
        />,
      );

      expect(
        screen.getByText("/* Color Mode: undefined */"),
      ).toBeInTheDocument();
    });

    it("handles empty color stacks", () => {
      const themeWithEmptyColors: Theme = {
        ...DEFAULT_THEME,
        colors: {},
      };

      render(
        <CssCodeBox
          currentTheme={themeWithEmptyColors}
          previewColors={false}
        />,
      );

      // Should still render the structure
      expect(screen.getByLabelText("Código del tema css")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Variables de colores CSS"),
      ).toBeInTheDocument();
    });

    it("handles empty radius and shadows", () => {
      const themeWithEmptyValues: Theme = {
        ...DEFAULT_THEME,
        radius: {},
        shadows: {},
      };

      render(
        <CssCodeBox
          currentTheme={themeWithEmptyValues}
          previewColors={false}
        />,
      );

      // Should still render the structure
      expect(
        screen.getByLabelText("Variables de radio CSS"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Variables de sombra CSS"),
      ).toBeInTheDocument();
    });

    it("applies CSS module classes correctly", () => {
      const { container } = render(
        <CssCodeBox currentTheme={DEFAULT_THEME} previewColors={false} />,
      );

      // Check that CSS module classes are applied
      const codeBox = container.querySelector("section");
      expect(codeBox).toHaveClass("codeBox");

      const commentDiv = container.querySelector(".comment");
      expect(commentDiv).toBeInTheDocument();

      const selectorElements = container.querySelectorAll(".selector");
      expect(selectorElements.length).toBeGreaterThan(0);

      const keywordElements = container.querySelectorAll(".keyword");
      expect(keywordElements.length).toBeGreaterThan(0);

      const valueElements = container.querySelectorAll(".value");
      expect(valueElements.length).toBeGreaterThan(0);

      const indentedElements = container.querySelectorAll(".indented");
      expect(indentedElements.length).toBeGreaterThan(0);
    });
  });
});
