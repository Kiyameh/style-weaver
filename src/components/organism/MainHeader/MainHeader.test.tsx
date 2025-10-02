import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MainHeader from "./MainHeader";

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
        name: "Volver al portfolio de Kiyameh",
      });

      expect(nav).toBeInTheDocument();
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "https://kiyameh.com");
    });

    it("renders action buttons with proper labels", () => {
      render(<MainHeader />);

      const libraryButton = screen.getByRole("button", {
        name: "Ir a la biblioteca de componentes",
      });
      const loginButton = screen.getByRole("button", {
        name: "Iniciar sesión en tu cuenta",
      });
      const registerButton = screen.getByRole("button", {
        name: "Crear una nueva cuenta",
      });

      expect(libraryButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
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

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Navegación principal");
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

      const backLink = screen.getByLabelText("Volver al portfolio de Kiyameh");
      const libraryButton = screen.getByLabelText(
        "Ir a la biblioteca de componentes",
      );
      const loginButton = screen.getByLabelText("Iniciar sesión en tu cuenta");
      const registerButton = screen.getByLabelText("Crear una nueva cuenta");

      expect(backLink).toBeInTheDocument();
      expect(libraryButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("all interactive elements are focusable", () => {
      render(<MainHeader />);

      const focusableElements = [
        screen.getByRole("link", {
          name: "Volver al portfolio de Kiyameh",
        }),
        screen.getByRole("button", {
          name: "Ir a la biblioteca de componentes",
        }),
        screen.getByRole("button", { name: "Iniciar sesión en tu cuenta" }),
        screen.getByRole("button", { name: "Crear una nueva cuenta" }),
      ];

      focusableElements.forEach((element) => {
        expect(element).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });
});
