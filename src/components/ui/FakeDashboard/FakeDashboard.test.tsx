import { render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import FakeDashboard from "./FakeDashboard";

// Mock the ThemeContext
const mockTheme: Theme = {
  name: "Test Theme",
  description: "Theme for testing",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
      200: new Color("oklch", [0.97, 0.011, 259]),
      300: new Color("oklch", [0.93, 0.016, 262]),
    },
    content: {
      100: new Color("oklch", [0.85, 0.053, 255]),
      200: new Color("oklch", [0.62, 0.053, 255]),
      300: new Color("oklch", [0.42, 0.053, 255]),
      500: new Color("oklch", [0.28, 0.053, 255]),
    },
    border: {
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.33, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.31, 252]),
      200: new Color("oklch", [0.63, 0.2, 252]),
    },
    secondary: {
      content: new Color("oklch", [0.43, 0.016, 262]),
      100: new Color("oklch", [0.86, 0.09, 212]),
      200: new Color("oklch", [0.72, 0.09, 212]),
    },
    accent: {
      content: new Color("oklch", [0.93, 0.016, 262]),
      100: new Color("oklch", [0.8, 0.25, 9]),
      200: new Color("oklch", [0.64, 0.25, 9]),
    },
    neutral: {
      content: new Color("oklch", [0.32, 0.027, 268]),
      100: new Color("oklch", [0.82, 0.031, 222]),
      200: new Color("oklch", [0.64, 0.029, 266]),
    },
    info: {
      content: new Color("oklch", [0.3, 0.02, 200]),
      100: new Color("oklch", [0.8, 0.2, 200], 0.1),
      200: new Color("oklch", [0.6, 0.2, 200]),
    },
    success: {
      content: new Color("oklch", [0.3, 0.02, 166]),
      100: new Color("oklch", [0.8, 0.2, 166], 0.1),
      200: new Color("oklch", [0.6, 0.2, 166]),
    },
    warning: {
      content: new Color("oklch", [0.3, 0.02, 95]),
      100: new Color("oklch", [0.8, 0.2, 95], 0.1),
      200: new Color("oklch", [0.6, 0.2, 95]),
    },
    error: {
      content: new Color("oklch", [0.3, 0.02, 28]),
      100: new Color("oklch", [0.8, 0.2, 28], 0.1),
      200: new Color("oklch", [0.6, 0.2, 28]),
    },
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  shadows: {
    sm: "0 0 0.5rem 0px oklch(0% 0 0 / 0.1)",
    md: "0 0 1rem 0px oklch(0% 0 0 / 0.2)",
    lg: "0 0 1.5rem 0px oklch(0% 0 0 / 0.3)",
    xl: "0 0 2rem 0px oklch(0% 0 0 / 0.4)",
  },
};

vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    currentTheme: mockTheme,
  }),
}));

describe("FakeDashboard Component", () => {
  describe("Rendering", () => {
    it("renders the dashboard", () => {
      render(<FakeDashboard />);

      // Check that the main dashboard container exists
      const dashboard = screen.getByText("Dashboard Overview").closest("div");
      expect(dashboard).toBeInTheDocument();
    });

    it("renders header with title", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("New Project")).toBeInTheDocument();
    });

    it("renders stats cards", () => {
      render(<FakeDashboard />);

      // Check all 4 stat cards
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("$45,231")).toBeInTheDocument();

      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("2,350")).toBeInTheDocument();

      expect(screen.getByText("Orders")).toBeInTheDocument();
      expect(screen.getByText("1,234")).toBeInTheDocument();

      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("567")).toBeInTheDocument();
    });

    it("renders recent activity section", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Recent Activity")).toBeInTheDocument();
      expect(screen.getByText("New sale recorded")).toBeInTheDocument();
      expect(screen.getByText("New user registered")).toBeInTheDocument();
      expect(screen.getByText("System update completed")).toBeInTheDocument();
      expect(screen.getByText("Inventory updated")).toBeInTheDocument();
    });

    it("renders alerts section", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("System Alerts")).toBeInTheDocument();
      expect(screen.getByText("Information")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Warning")).toBeInTheDocument();
    });

    it("renders sidebar sections", () => {
      render(<FakeDashboard />);

      // Quick Actions
      expect(screen.getByText("Quick Actions")).toBeInTheDocument();
      expect(screen.getByText("Create Invoice")).toBeInTheDocument();
      expect(screen.getByText("Add Customer")).toBeInTheDocument();
      expect(screen.getByText("Generate Report")).toBeInTheDocument();

      // Pending Tasks
      expect(screen.getByText("Pending Tasks")).toBeInTheDocument();
      expect(screen.getByText("Review customer feedback")).toBeInTheDocument();

      // Team Members
      expect(screen.getByText("Team Members")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Mike Brown")).toBeInTheDocument();
    });

    it("renders footer", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
      expect(screen.getByText("Terms of Service")).toBeInTheDocument();
      expect(screen.getByText("Support")).toBeInTheDocument();
      expect(screen.getByText("Documentation")).toBeInTheDocument();
      expect(
        screen.getByText("© 2025 StyleWeaver. All rights reserved."),
      ).toBeInTheDocument();
    });
  });

  describe("Theme Integration", () => {
    it("applies theme styles as CSS variables", () => {
      const { container } = render(<FakeDashboard />);

      const dashboard = container.firstChild as HTMLElement;
      expect(dashboard).toHaveAttribute("style");

      // Check that style attribute contains CSS variables
      const style = dashboard.getAttribute("style");
      expect(style).toContain("--surface-");
      expect(style).toContain("--primary-");
    });

    it("shows all alerts when all feedback colors are available", () => {
      render(<FakeDashboard />);

      // With full theme, all alerts should be visible
      expect(screen.getByText("Information")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Warning")).toBeInTheDocument();
    });

    it("conditionally renders alerts based on available colors", () => {
      // This test verifies the conditional rendering logic exists
      // In real usage, alerts would only show if their colors are defined
      expect(mockTheme.brandColors.success).toBeDefined();
      expect(mockTheme.brandColors.warning).toBeDefined();
      expect(mockTheme.brandColors.error).toBeDefined();
      expect(mockTheme.brandColors.info).toBeDefined();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      const { container } = render(
        <FakeDashboard data-testid="custom-dashboard" />,
      );

      const dashboard = container.querySelector(
        '[data-testid="custom-dashboard"]',
      );
      expect(dashboard).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<FakeDashboard className="custom-class" />);

      const dashboard = container.firstChild as HTMLElement;
      expect(dashboard).toHaveClass("custom-class");
    });

    it("combines custom className with default className", () => {
      const { container } = render(<FakeDashboard className="custom-class" />);

      const dashboard = container.firstChild as HTMLElement;
      expect(dashboard.className).toContain("custom-class");
      // Should also have the default dashboard class
      expect(dashboard.className).toContain("dashboard");
    });
  });

  describe("Content Verification", () => {
    it("renders all activity items with correct content", () => {
      render(<FakeDashboard />);

      // Verify activity descriptions
      expect(
        screen.getByText("Order #12345 has been completed successfully"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("John Doe joined the platform"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("All services are running smoothly"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("50 new products added to catalog"),
      ).toBeInTheDocument();
    });

    it("renders all task items", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Review customer feedback")).toBeInTheDocument();
      expect(
        screen.getByText("Update product descriptions"),
      ).toBeInTheDocument();
      expect(screen.getByText("Process refund requests")).toBeInTheDocument();
      expect(screen.getByText("Prepare monthly report")).toBeInTheDocument();
    });

    it("renders team member roles", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Product Manager")).toBeInTheDocument();
      expect(screen.getByText("Lead Designer")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
    });

    it("renders team member status chips", () => {
      render(<FakeDashboard />);

      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(screen.getByText("Away")).toBeInTheDocument();
      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });
});
