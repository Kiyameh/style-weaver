import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextField from "./TextField";

describe("TextField Component", () => {
  describe("Rendering", () => {
    it("renders a text input", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe("INPUT");
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders with label text", () => {
      render(<TextField label="Username" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      const { container } = render(<TextField />);
      const label = container.querySelector("label");
      expect(label).not.toBeInTheDocument();
    });

    it("associates label with input via id", () => {
      render(<TextField label="Email" id="email-input" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email");
      expect(input).toHaveAttribute("id", "email-input");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("generates unique id when not provided", () => {
      const { container } = render(<TextField label="Test" />);
      const input = container.querySelector("input");
      const label = container.querySelector("label");
      expect(input).toHaveAttribute("id");
      expect(label).toHaveAttribute("for");
      expect(input?.getAttribute("id")).toBe(label?.getAttribute("for"));
    });

    it("renders with helper text", () => {
      render(<TextField helperText="Enter your email address" />);
      expect(screen.getByText("Enter your email address")).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      render(<TextField placeholder="john@example.com" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "john@example.com");
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("input", "inputPrimary");
    });

    it("applies primary variant when explicitly set", () => {
      render(<TextField variant="primary" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("input", "inputPrimary");
    });

    it("applies secondary variant correctly", () => {
      render(<TextField variant="secondary" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("input", "inputSecondary");
      expect(input).not.toHaveClass("inputPrimary");
    });
  });

  describe("States", () => {
    it("can receive text input", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "Hello World" } });
      expect(input.value).toBe("Hello World");
    });

    it("can be controlled with value prop", () => {
      const { rerender } = render(<TextField value="Initial" readOnly />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Initial");

      rerender(<TextField value="Updated" readOnly />);
      expect(input.value).toBe("Updated");
    });

    it("can be disabled", () => {
      render(<TextField disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("applies error state", () => {
      render(<TextField error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("inputError");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("applies error styling to helper text", () => {
      render(<TextField error helperText="This field is required" />);
      const helperText = screen.getByText("This field is required");
      expect(helperText).toHaveClass("helperText", "helperTextError");
    });

    it("can have both variant and error state", () => {
      render(<TextField variant="secondary" error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("inputSecondary", "inputError");
    });
  });

  describe("Layout", () => {
    it("applies fullWidth class when prop is true", () => {
      const { container } = render(<TextField fullWidth />);
      const containerDiv = container.querySelector(".container");
      expect(containerDiv).toHaveClass("fullWidth");
    });

    it("does not apply fullWidth class by default", () => {
      const { container } = render(<TextField />);
      const containerDiv = container.querySelector(".container");
      expect(containerDiv).not.toHaveClass("fullWidth");
    });
  });

  describe("Functionality", () => {
    it("calls onChange when text is entered", () => {
      const handleChange = vi.fn();
      render(<TextField onChange={handleChange} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("calls onFocus when input is focused", () => {
      const handleFocus = vi.fn();
      render(<TextField onFocus={handleFocus} />);
      const input = screen.getByRole("textbox");

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when input loses focus", () => {
      const handleBlur = vi.fn();
      render(<TextField onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");

      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("respects disabled state", () => {
      render(<TextField disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Input Types", () => {
    it("defaults to text type", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("accepts email type", () => {
      render(<TextField type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("accepts password type", () => {
      render(<TextField type="password" />);
      const input = document.querySelector("input[type='password']");
      expect(input).toBeInTheDocument();
    });

    it("accepts number type", () => {
      render(<TextField type="number" />);
      const input = document.querySelector("input[type='number']");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard input attributes", () => {
      render(
        <TextField
          name="username"
          required
          maxLength={50}
          data-testid="custom-input"
        />,
      );
      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("name", "username");
      expect(input).toHaveAttribute("required");
      expect(input).toHaveAttribute("maxLength", "50");
      expect(input).toHaveAttribute("data-testid", "custom-input");
    });

    it("applies custom className", () => {
      render(<TextField className="custom-class" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("input", "inputPrimary", "custom-class");
    });

    it("applies multiple custom classes", () => {
      render(<TextField className="class-one class-two" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass(
        "input",
        "inputPrimary",
        "class-one",
        "class-two",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper textbox role", () => {
      render(<TextField />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<TextField aria-label="Search query" />);
      const input = screen.getByRole("textbox", { name: "Search query" });
      expect(input).toBeInTheDocument();
    });

    it("associates helper text with aria-describedby", () => {
      render(<TextField helperText="Must be at least 8 characters" />);
      const input = screen.getByRole("textbox");
      const helperTextId = input.getAttribute("aria-describedby");

      expect(helperTextId).toBeTruthy();
      const helperText = document.getElementById(helperTextId!);
      expect(helperText).toHaveTextContent("Must be at least 8 characters");
    });

    it("sets aria-invalid when error is true", () => {
      render(<TextField error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("is keyboard accessible", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");

      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it("label is properly associated for screen readers", () => {
      render(<TextField label="Full Name" id="fullname" />);
      const input = screen.getByRole("textbox", { name: "Full Name" });
      expect(input).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty label gracefully", () => {
      render(<TextField label="" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles empty helper text gracefully", () => {
      render(<TextField helperText="" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles defaultValue prop", () => {
      render(<TextField defaultValue="Initial value" />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Initial value");
    });

    it("maintains value across re-renders", () => {
      const { rerender } = render(<TextField label="Test" />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      fireEvent.change(input, { target: { value: "Persistent" } });
      expect(input.value).toBe("Persistent");

      rerender(<TextField label="Test Updated" />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
