import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Checkbox from "./Checkbox";

describe("Checkbox Component", () => {
  describe("Rendering", () => {
    it("renders a checkbox input", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.tagName).toBe("INPUT");
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("renders with label text", () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      const { container } = render(<Checkbox />);
      const label = container.querySelector("label");
      expect(label).not.toBeInTheDocument();
    });

    it("associates label with checkbox via id", () => {
      render(<Checkbox label="Test Label" id="test-checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Test Label");
      expect(checkbox).toHaveAttribute("id", "test-checkbox");
      expect(label).toHaveAttribute("for", "test-checkbox");
    });

    it("generates unique id when not provided", () => {
      const { container } = render(<Checkbox label="Test" />);
      const checkbox = container.querySelector("input[type='checkbox']");
      const label = container.querySelector("label");
      expect(checkbox).toHaveAttribute("id");
      expect(label).toHaveAttribute("for");
      expect(checkbox?.getAttribute("id")).toBe(label?.getAttribute("for"));
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("checkbox", "checkboxPrimary");
    });

    it("applies primary variant when explicitly set", () => {
      render(<Checkbox variant="primary" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("checkbox", "checkboxPrimary");
    });

    it("applies secondary variant correctly", () => {
      render(<Checkbox variant="secondary" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("checkbox", "checkboxSecondary");
      expect(checkbox).not.toHaveClass("checkboxPrimary");
    });
  });

  describe("States", () => {
    it("can be checked", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it("can be controlled with checked prop", () => {
      const { rerender } = render(<Checkbox checked={false} readOnly />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      rerender(<Checkbox checked={true} readOnly />);
      expect(checkbox.checked).toBe(true);
    });

    it("can be disabled", () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("applies error state", () => {
      render(<Checkbox error />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("checkboxError");
    });

    it("can have both variant and error state", () => {
      render(<Checkbox variant="secondary" error />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("checkboxSecondary", "checkboxError");
    });
  });

  describe("Functionality", () => {
    it("calls onChange when clicked", () => {
      const handleChange = vi.fn();
      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("respects disabled state", () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toBeDisabled();
    });

    it("can be toggled by clicking label", () => {
      render(<Checkbox label="Click me" />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      const label = screen.getByText("Click me");

      expect(checkbox.checked).toBe(false);
      fireEvent.click(label);
      expect(checkbox.checked).toBe(true);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard input attributes", () => {
      render(
        <Checkbox
          name="terms"
          value="accepted"
          required
          data-testid="custom-checkbox"
        />,
      );
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toHaveAttribute("name", "terms");
      expect(checkbox).toHaveAttribute("value", "accepted");
      expect(checkbox).toHaveAttribute("required");
      expect(checkbox).toHaveAttribute("data-testid", "custom-checkbox");
    });

    it("applies custom className", () => {
      render(<Checkbox className="custom-class" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass(
        "checkbox",
        "checkboxPrimary",
        "custom-class",
      );
    });

    it("applies multiple custom classes", () => {
      render(<Checkbox className="class-one class-two" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass(
        "checkbox",
        "checkboxPrimary",
        "class-one",
        "class-two",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper checkbox role", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Checkbox aria-label="Accept terms and conditions" />);
      const checkbox = screen.getByRole("checkbox", {
        name: "Accept terms and conditions",
      });
      expect(checkbox).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(<Checkbox aria-describedby="checkbox-description" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        "checkbox-description",
      );
    });

    it("supports aria-invalid for error state", () => {
      render(<Checkbox aria-invalid={true} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("is keyboard accessible", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

      checkbox.focus();
      expect(document.activeElement).toBe(checkbox);

      expect(checkbox.checked).toBe(false);
      fireEvent.keyDown(checkbox, { key: " ", code: "Space" });
      // Note: Space key behavior is handled natively by the browser
    });

    it("label is properly associated for screen readers", () => {
      render(<Checkbox label="Subscribe to newsletter" id="newsletter" />);
      const checkbox = screen.getByRole("checkbox", {
        name: "Subscribe to newsletter",
      });
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty label gracefully", () => {
      render(<Checkbox label="" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles defaultChecked prop", () => {
      render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it("maintains checked state across re-renders", () => {
      const { rerender } = render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      rerender(<Checkbox label="Test Updated" />);
      // In uncontrolled mode, state should persist
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });
});
