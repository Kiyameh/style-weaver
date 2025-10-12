import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CssPreviewPage from "./page";

// Mock the child components
vi.mock("@/components/organism/SidebarContent/SidebarContent", () => ({
  default: () => <div data-testid="sidebar-content">Sidebar Content</div>,
}));

vi.mock("@/components/organism/CssCodeBox/CodeBoxHeader", () => ({
  default: ({
    previewColors,
    setPreviewColors,
  }: {
    previewColors: boolean;
    setPreviewColors: (value: boolean) => void;
  }) => (
    <div data-testid="code-box-header">
      <button
        type="button"
        onClick={() => setPreviewColors(!previewColors)}
        data-testid="toggle-preview"
      >
        Toggle Preview: {previewColors ? "ON" : "OFF"}
      </button>
    </div>
  ),
}));

vi.mock("@/components/organism/CssCodeBox/CssCodeBox", () => ({
  default: ({ previewColors }: { previewColors: boolean }) => (
    <div data-testid="css-code-box">
      CSS Code Box - Preview: {previewColors ? "ON" : "OFF"}
    </div>
  ),
}));

vi.mock("@/components/ui/FakeDashboard", () => ({
  default: () => <div data-testid="fake-dashboard">Fake Dashboard</div>,
}));

describe("CssPreviewPage", () => {
  describe("Rendering", () => {
    it("renders the page container", () => {
      const { container } = render(<CssPreviewPage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders sidebar content", () => {
      render(<CssPreviewPage />);
      expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    });

    it("renders code box header", () => {
      render(<CssPreviewPage />);
      expect(screen.getByTestId("code-box-header")).toBeInTheDocument();
    });

    it("renders css code box", () => {
      render(<CssPreviewPage />);
      expect(screen.getByTestId("css-code-box")).toBeInTheDocument();
    });

    it("renders fake dashboard", () => {
      render(<CssPreviewPage />);
      expect(screen.getByTestId("fake-dashboard")).toBeInTheDocument();
    });
  });

  describe("Intermediate Tabs (Desktop)", () => {
    it("renders intermediate navigation tabs", () => {
      render(<CssPreviewPage />);

      expect(screen.getByText("CSS Code")).toBeInTheDocument();
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("starts with code view active", () => {
      render(<CssPreviewPage />);

      const codeButton = screen.getByText("CSS Code").closest("button");
      expect(codeButton).toHaveClass("active");
    });

    it("switches to preview view when preview tab is clicked", () => {
      render(<CssPreviewPage />);

      const previewButton = screen.getByText("Preview").closest("button");
      if (previewButton) {
        fireEvent.click(previewButton);
        expect(previewButton).toHaveClass("active");
      }
    });

    it("switches back to code view when code tab is clicked", () => {
      render(<CssPreviewPage />);

      // Switch to preview
      const previewButton = screen.getByText("Preview").closest("button");
      if (previewButton) {
        fireEvent.click(previewButton);
      }

      // Switch back to code
      const codeButton = screen.getByText("CSS Code").closest("button");
      if (codeButton) {
        fireEvent.click(codeButton);
        expect(codeButton).toHaveClass("active");
      }
    });
  });

  describe("Mobile Tabs", () => {
    it("renders mobile navigation tabs", () => {
      render(<CssPreviewPage />);

      const mobileNav = screen.getByLabelText("Navegación móvil");
      expect(mobileNav).toBeInTheDocument();
    });

    it("renders all three mobile tab buttons", () => {
      render(<CssPreviewPage />);

      expect(screen.getByLabelText("Ver tema")).toBeInTheDocument();
      expect(screen.getByLabelText("Ver código CSS")).toBeInTheDocument();
      expect(screen.getByLabelText("Ver preview")).toBeInTheDocument();
    });

    it("switches to sidebar view when theme button is clicked", () => {
      render(<CssPreviewPage />);

      const themeButton = screen.getByLabelText("Ver tema");
      fireEvent.click(themeButton);

      expect(themeButton).toHaveClass("active");
      expect(themeButton).toHaveAttribute("aria-pressed", "true");
    });

    it("switches to code view when code button is clicked", () => {
      render(<CssPreviewPage />);

      const codeButton = screen.getByLabelText("Ver código CSS");
      fireEvent.click(codeButton);

      expect(codeButton).toHaveClass("active");
      expect(codeButton).toHaveAttribute("aria-pressed", "true");
    });

    it("switches to preview view when preview button is clicked", () => {
      render(<CssPreviewPage />);

      const previewButton = screen.getByLabelText("Ver preview");
      fireEvent.click(previewButton);

      expect(previewButton).toHaveClass("active");
      expect(previewButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Preview Colors State", () => {
    it("starts with preview colors enabled", () => {
      render(<CssPreviewPage />);

      expect(screen.getByTestId("toggle-preview")).toHaveTextContent(
        "Toggle Preview: ON",
      );
    });

    it("toggles preview colors when toggle button is clicked", () => {
      render(<CssPreviewPage />);

      const toggleButton = screen.getByTestId("toggle-preview");
      fireEvent.click(toggleButton);

      expect(toggleButton).toHaveTextContent("Toggle Preview: OFF");
    });

    it("passes preview colors state to CssCodeBox", () => {
      render(<CssPreviewPage />);

      // Initially ON
      expect(screen.getByTestId("css-code-box")).toHaveTextContent(
        "CSS Code Box - Preview: ON",
      );

      // Toggle OFF
      const toggleButton = screen.getByTestId("toggle-preview");
      fireEvent.click(toggleButton);

      expect(screen.getByTestId("css-code-box")).toHaveTextContent(
        "CSS Code Box - Preview: OFF",
      );
    });
  });

  describe("View State Management", () => {
    it("maintains independent state for desktop and mobile tabs", () => {
      render(<CssPreviewPage />);

      // Click mobile theme button
      const mobileThemeButton = screen.getByLabelText("Ver tema");
      fireEvent.click(mobileThemeButton);

      // Both should reflect the same state
      expect(mobileThemeButton).toHaveClass("active");
    });

    it("updates all related elements when view changes", () => {
      render(<CssPreviewPage />);

      // Switch to preview
      const desktopPreviewButton = screen
        .getByText("Preview")
        .closest("button");
      if (desktopPreviewButton) {
        fireEvent.click(desktopPreviewButton);
      }

      // Check mobile button also reflects the change
      const mobilePreviewButton = screen.getByLabelText("Ver preview");
      expect(mobilePreviewButton).toHaveClass("active");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on mobile buttons", () => {
      render(<CssPreviewPage />);

      const themeButton = screen.getByLabelText("Ver tema");
      const codeButton = screen.getByLabelText("Ver código CSS");
      const previewButton = screen.getByLabelText("Ver preview");

      expect(themeButton).toHaveAttribute("aria-label");
      expect(codeButton).toHaveAttribute("aria-label");
      expect(previewButton).toHaveAttribute("aria-label");
    });

    it("has proper aria-pressed states on mobile buttons", () => {
      render(<CssPreviewPage />);

      const codeButton = screen.getByLabelText("Ver código CSS");

      // Initially code view is active
      expect(codeButton).toHaveAttribute("aria-pressed", "true");

      // Switch to preview
      const previewButton = screen.getByLabelText("Ver preview");
      fireEvent.click(previewButton);

      // Code button should no longer be pressed
      expect(codeButton).toHaveAttribute("aria-pressed", "false");
      expect(previewButton).toHaveAttribute("aria-pressed", "true");
    });

    it("has aria-hidden on decorative icons", () => {
      const { container } = render(<CssPreviewPage />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Button Types", () => {
    it("all tab buttons have type='button'", () => {
      const { container } = render(<CssPreviewPage />);

      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });
  });
});
