import { fireEvent, render, screen } from "@testing-library/react";
import { Bell } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import Alert from "./Alert";

describe("Alert Component", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<Alert>This is an alert message</Alert>);
      expect(screen.getByText("This is an alert message")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Alert>Test</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert?.tagName).toBe("DIV");
    });

    it("renders with title", () => {
      render(<Alert title="Important">Message content</Alert>);
      expect(screen.getByText("Important")).toBeInTheDocument();
      expect(screen.getByText("Message content")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      const { container } = render(<Alert>Just a message</Alert>);
      const title = container.querySelector(".title");
      expect(title).not.toBeInTheDocument();
    });

    it("renders default icon based on variant", () => {
      const { container } = render(<Alert variant="info">Info message</Alert>);
      const icon = container.querySelector(".icon");
      expect(icon).toBeInTheDocument();
      expect(icon?.querySelector("svg")).toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      render(
        <Alert icon={<Bell data-testid="custom-icon" />}>
          Custom icon alert
        </Alert>,
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders without icon when icon prop is null", () => {
      const { container } = render(<Alert icon={null}>No icon</Alert>);
      const icon = container.querySelector(".icon");
      expect(icon).not.toBeInTheDocument();
    });

    it("renders close button when onClose is provided", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Closeable alert</Alert>);
      const closeButton = screen.getByRole("button", { name: "Close alert" });
      expect(closeButton).toBeInTheDocument();
    });

    it("does not render close button when onClose is not provided", () => {
      render(<Alert>Not closeable</Alert>);
      const closeButton = screen.queryByRole("button");
      expect(closeButton).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies info variant by default", () => {
      const { container } = render(<Alert>Info alert</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertInfo");
    });

    it("applies info variant when explicitly set", () => {
      const { container } = render(<Alert variant="info">Info alert</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertInfo");
    });

    it("applies success variant correctly", () => {
      const { container } = render(<Alert variant="success">Success!</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertSuccess");
      expect(alert).not.toHaveClass("alertInfo");
    });

    it("applies warning variant correctly", () => {
      const { container } = render(<Alert variant="warning">Warning!</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertWarning");
    });

    it("applies error variant correctly", () => {
      const { container } = render(<Alert variant="error">Error!</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertError");
    });
  });

  describe("Functionality", () => {
    it("calls onClose when close button is clicked", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Closeable</Alert>);
      const closeButton = screen.getByRole("button");

      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("can have onClick handler on the alert itself", () => {
      const handleClick = vi.fn();
      render(<Alert onClick={handleClick}>Clickable alert</Alert>);
      const alert = screen.getByRole("status");

      fireEvent.click(alert);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <Alert data-testid="custom-alert" title="Test">
          Message
        </Alert>,
      );
      const alert = screen.getByTestId("custom-alert");
      expect(alert).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Alert className="custom-class">Message</Alert>,
      );
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertInfo", "custom-class");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(
        <Alert className="class-one class-two">Message</Alert>,
      );
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert", "alertInfo", "class-one", "class-two");
    });
  });

  describe("Accessibility", () => {
    it("has status role for info variant", () => {
      render(<Alert variant="info">Info message</Alert>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has status role for success variant", () => {
      render(<Alert variant="success">Success message</Alert>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has alert role for warning variant", () => {
      render(<Alert variant="warning">Warning message</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("has alert role for error variant", () => {
      render(<Alert variant="error">Error message</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("close button has descriptive aria-label", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Message</Alert>);
      const closeButton = screen.getByRole("button", { name: "Close alert" });
      expect(closeButton).toBeInTheDocument();
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(<Alert variant="info">Message</Alert>);
      const icon = container.querySelector(".icon svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("close button icon is hidden from screen readers", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Message</Alert>);
      const closeButton = screen.getByRole("button");
      const svg = closeButton.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("close button is keyboard accessible", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Message</Alert>);
      const closeButton = screen.getByRole("button");

      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe("Content Structure", () => {
    it("renders JSX children correctly", () => {
      render(
        <Alert>
          <span>Line 1</span>
          <span>Line 2</span>
        </Alert>,
      );
      expect(screen.getByText("Line 1")).toBeInTheDocument();
      expect(screen.getByText("Line 2")).toBeInTheDocument();
    });

    it("renders with both title and complex content", () => {
      render(
        <Alert title="Notification">
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </Alert>,
      );
      expect(screen.getByText("Notification")).toBeInTheDocument();
      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    });

    it("maintains proper structure with all features", () => {
      const handleClose = vi.fn();
      render(
        <Alert
          variant="warning"
          title="Warning Title"
          onClose={handleClose}
          icon={<Bell />}
        >
          Warning message content
        </Alert>,
      );

      expect(screen.getByText("Warning Title")).toBeInTheDocument();
      expect(screen.getByText("Warning message content")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children gracefully", () => {
      const { container } = render(<Alert>{""}</Alert>);
      const alert = container.querySelector(".alert");
      expect(alert).toBeInTheDocument();
    });

    it("handles empty title gracefully", () => {
      render(<Alert title="">Message</Alert>);
      expect(screen.getByText("Message")).toBeInTheDocument();
    });

    it("handles very long messages", () => {
      const longMessage =
        "This is a very long alert message that might wrap across multiple lines and should still be displayed correctly with proper formatting and styling.";
      render(<Alert>{longMessage}</Alert>);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("renders correctly with all props combined", () => {
      const handleClose = vi.fn();
      const handleClick = vi.fn();
      render(
        <Alert
          variant="error"
          title="Error Title"
          onClose={handleClose}
          onClick={handleClick}
          icon={<Bell />}
          className="custom"
        >
          Error message
        </Alert>,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass("custom");
    });
  });
});
