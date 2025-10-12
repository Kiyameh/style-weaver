import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import MainHeader from "./MainHeader";

// Mock resetTheme function
const mockResetTheme = vi.fn();

// Mock current theme
const mockCurrentTheme: Theme = {
  name: "Test Theme",
  description: "Test description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1, 0, 0]),
    },
    content: {
      100: new Color("oklch", [0, 0, 0]),
    },
    border: {
      100: new Color("oklch", [0.5, 0, 0]),
    },
  },
  brandColors: {},
  radius: {},
  shadows: {},
};

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    resetTheme: mockResetTheme,
    currentTheme: mockCurrentTheme,
  }),
}));

describe("MainHeader", () => {
  describe("Rendering", () => {
    it("renders the main header component", () => {
      render(<MainHeader />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders the logo and title", () => {
      render(<MainHeader />);

      const logo = screen.getByAltText("Style Weaver logo");
      const title = screen.getByRole("heading", { name: "Style Weaver" });

      expect(logo).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it("renders navigation with back link", () => {
      render(<MainHeader />);

      const nav = screen.getByRole("navigation", {
        name: "Navegación principal",
      });
      const backLink = screen.getByRole("link", {
        name: "Back to Kiyameh portfolio",
      });

      expect(nav).toBeInTheDocument();
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "https://kiyameh.com");
    });

    it("renders support link with icon", () => {
      render(<MainHeader />);

      const supportLink = screen.getByRole("link", {
        name: "Support this project",
      });

      expect(supportLink).toBeInTheDocument();
      expect(supportLink).toHaveAttribute(
        "href",
        "https://buymeacoffee.com/kiyameh",
      );
      expect(supportLink).toHaveAttribute("target", "_blank");
      expect(supportLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders version text", () => {
      render(<MainHeader />);

      const versions = screen.getAllByText("version 1.0");
      expect(versions).toHaveLength(2); // One in desktop nav, one in mobile menu
      versions.forEach((version) => {
        expect(version).toBeInTheDocument();
      });
    });

    it("renders action buttons with proper labels", () => {
      render(<MainHeader />);

      // Reset button appears twice (desktop + mobile menu)
      const resetButtons = screen.getAllByRole("button", {
        name: "Reset theme to default",
      });
      // Library button appears twice (desktop + mobile menu)
      const libraryButtons = screen.getAllByRole("button", {
        name: "Open theme library",
      });

      expect(resetButtons).toHaveLength(2);
      expect(libraryButtons).toHaveLength(2);
      resetButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
      libraryButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      const { container } = render(<MainHeader />);

      // Check for proper semantic elements
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("nav")).toBeInTheDocument();
      expect(container.querySelector("h1")).toBeInTheDocument();
    });

    it("has proper heading hierarchy", () => {
      render(<MainHeader />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Style Weaver");
    });

    it("has proper ARIA labels for navigation", () => {
      render(<MainHeader />);

      // There are two nav elements: desktop and mobile menu
      const desktopNav = screen.getByRole("navigation", {
        name: "Navegación principal",
      });
      const mobileNav = screen.getByRole("navigation", {
        name: "Menú móvil",
      });

      expect(desktopNav).toHaveAttribute("aria-label", "Navegación principal");
      expect(mobileNav).toHaveAttribute("aria-label", "Menú móvil");
    });

    it("has decorative icon properly hidden from screen readers", () => {
      render(<MainHeader />);

      // The Plane icon should be hidden from screen readers
      const planeIcon = document.querySelector('[aria-hidden="true"]');
      expect(planeIcon).toBeInTheDocument();
    });

    it("has proper alt text for logo image", () => {
      render(<MainHeader />);

      const logo = screen.getByRole("img", { name: "Style Weaver logo" });
      expect(logo).toHaveAttribute("alt", "Style Weaver logo");
    });

    it("has descriptive aria-labels for all interactive elements", () => {
      render(<MainHeader />);

      const backLinks = screen.getAllByLabelText("Back to Kiyameh portfolio");
      const supportLinks = screen.getAllByLabelText("Support this project");
      const resetButtons = screen.getAllByLabelText("Reset theme to default");
      const libraryButtons = screen.getAllByLabelText(
        "Open theme library",
      );

      // Each element appears in desktop nav/actions and mobile menu
      expect(backLinks.length).toBeGreaterThan(0);
      expect(supportLinks.length).toBeGreaterThan(0);
      expect(resetButtons).toHaveLength(2);
      expect(libraryButtons).toHaveLength(2);
    });
  });

  describe("Keyboard Navigation", () => {
    it("all interactive elements are focusable", () => {
      render(<MainHeader />);

      const backLinks = screen.getAllByRole("link", {
        name: "Back to Kiyameh portfolio",
      });
      const supportLinks = screen.getAllByRole("link", {
        name: "Support this project",
      });
      const resetButtons = screen.getAllByRole("button", {
        name: "Reset theme to default",
      });
      const libraryButtons = screen.getAllByRole("button", {
        name: "Open theme library",
      });

      const focusableElements = [
        ...backLinks,
        ...supportLinks,
        ...resetButtons,
        ...libraryButtons,
      ];

      focusableElements.forEach((element) => {
        expect(element).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("Functionality", () => {
    it("reset theme button calls resetTheme when clicked", () => {
      render(<MainHeader />);

      const resetButtons = screen.getAllByRole("button", {
        name: "Reset theme to default",
      });

      // Test the first button (desktop version)
      fireEvent.click(resetButtons[0]);

      expect(mockResetTheme).toHaveBeenCalled();
    });
  });
});
