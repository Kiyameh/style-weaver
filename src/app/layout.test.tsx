import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "./layout";

// Mock Next.js fonts
vi.mock("next/font/google", () => ({
  Outfit: () => ({
    variable: "--font-outfit",
    className: "outfit-font",
  }),
  Pacifico: () => ({
    variable: "--font-pacifico",
    className: "pacifico-font",
  }),
  Cascadia_Code: () => ({
    variable: "--font-cascadia",
    className: "cascadia-font",
  }),
}));

// Mock ThemeProvider
vi.mock("@/contexts/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock MainHeader
vi.mock("@/components/organism/MainHeader/MainHeader", () => ({
  default: () => <header data-testid="main-header">Main Header</header>,
}));

describe("RootLayout", () => {
  describe("Metadata", () => {
    it("exports correct metadata title", () => {
      expect(metadata.title).toBe("StyleWeaver - Your styling bird");
    });

    it("exports correct metadata description", () => {
      expect(metadata.description).toBe(
        "A modern Tool for styling your website",
      );
    });
  });

  describe("Structure", () => {
    it("renders the layout component", () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      // Layout should render without errors
      expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    });
  });

  describe("Component Rendering", () => {
    it("renders ThemeProvider", () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    });

    it("renders MainHeader", () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId("main-header")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Test Child Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
      expect(screen.getByText("Test Child Content")).toBeInTheDocument();
    });
  });

  describe("Component Hierarchy", () => {
    it("wraps children in ThemeProvider", () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Test Content</div>
        </RootLayout>,
      );

      const themeProvider = screen.getByTestId("theme-provider");
      const child = screen.getByTestId("test-child");

      expect(themeProvider).toContainElement(child);
    });

    it("renders MainHeader before children", () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Test Content</div>
        </RootLayout>,
      );

      const themeProvider = screen.getByTestId("theme-provider");
      const header = screen.getByTestId("main-header");
      const child = screen.getByTestId("test-child");

      // Check that header comes before child in DOM order
      expect(themeProvider.children[0]).toBe(header);
      expect(themeProvider.children[1]).toBe(child);
    });

    it("maintains correct nesting: ThemeProvider contains MainHeader and children", () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Test Content</div>
        </RootLayout>,
      );

      const themeProvider = screen.getByTestId("theme-provider");
      const header = screen.getByTestId("main-header");
      const child = screen.getByTestId("test-child");

      expect(themeProvider).toContainElement(header);
      expect(themeProvider).toContainElement(child);
    });
  });

  describe("Multiple Children", () => {
    it("renders multiple children correctly", () => {
      render(
        <RootLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </RootLayout>,
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("accepts children as a prop", () => {
      const TestChild = () => <div>Test Child Component</div>;

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>,
      );

      expect(screen.getByText("Test Child Component")).toBeInTheDocument();
    });

    it("handles empty children", () => {
      render(<RootLayout>{null}</RootLayout>);

      // Should still render the layout structure
      expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
      expect(screen.getByTestId("main-header")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("provides complete layout structure for app", () => {
      render(
        <RootLayout>
          <main>
            <h1>Page Content</h1>
          </main>
        </RootLayout>,
      );

      // Check complete structure exists
      expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
      expect(screen.getByTestId("main-header")).toBeInTheDocument();
      expect(screen.getByText("Page Content")).toBeInTheDocument();
    });

    it("renders all components in correct order", () => {
      render(
        <RootLayout>
          <div data-testid="page-content">Page</div>
        </RootLayout>,
      );

      const themeProvider = screen.getByTestId("theme-provider");
      const header = screen.getByTestId("main-header");
      const content = screen.getByTestId("page-content");

      // Verify all components are present
      expect(themeProvider).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();

      // Verify hierarchy
      expect(themeProvider).toContainElement(header);
      expect(themeProvider).toContainElement(content);
    });
  });
});
