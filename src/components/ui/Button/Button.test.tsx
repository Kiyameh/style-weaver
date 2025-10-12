import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole("button", { name: "Click me" }),
      ).toBeInTheDocument();
    });

    it("renders with JSX children", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      render(<Button>Primary Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "buttonPrimary");
    });

    it("applies primary variant when explicitly set", () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "buttonPrimary");
    });

    it("applies secondary variant correctly", () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "buttonSecondary");
      expect(button).not.toHaveClass("buttonPrimary");
    });

    it("applies ghost variant correctly", () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "buttonGhost");
      expect(button).not.toHaveClass("buttonPrimary", "buttonSecondary");
    });

    it("changes variant classes when variant prop changes", () => {
      const { rerender } = render(<Button variant="primary">Button</Button>);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("buttonPrimary");

      rerender(<Button variant="secondary">Button</Button>);
      expect(button).toHaveClass("buttonSecondary");
      expect(button).not.toHaveClass("buttonPrimary");

      rerender(<Button variant="ghost">Button</Button>);
      expect(button).toHaveClass("buttonGhost");
      expect(button).not.toHaveClass("buttonPrimary", "buttonSecondary");
    });
  });

  describe("Functionality", () => {
    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles multiple clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Multi-click Button</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("does not trigger click when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });

    it('supports form submission when type="submit"', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  // PROPS FORWARDING TESTS
  describe("Props Forwarding", () => {
    it("forwards HTML button attributes", () => {
      render(
        <Button
          id="test-button"
          data-testid="custom-button"
          aria-label="Custom label"
          title="Button title"
        >
          Test Button
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveAttribute("data-testid", "custom-button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
      expect(button).toHaveAttribute("title", "Button title");
    });

    it("forwards event handlers", () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(
        <Button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Event Button
        </Button>,
      );

      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);

      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("preserves custom className alongside variant classes", () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("button", "buttonPrimary", "custom-class");
    });

    it("applies custom className with different variants", () => {
      const { rerender } = render(
        <Button variant="primary" className="my-custom-class">
          Button
        </Button>,
      );
      const button = screen.getByRole("button");

      expect(button).toHaveClass("button", "buttonPrimary", "my-custom-class");

      rerender(
        <Button variant="secondary" className="my-custom-class">
          Button
        </Button>,
      );
      expect(button).toHaveClass(
        "button",
        "buttonSecondary",
        "my-custom-class",
      );
      expect(button).not.toHaveClass("buttonPrimary");

      rerender(
        <Button variant="ghost" className="my-custom-class">
          Button
        </Button>,
      );
      expect(button).toHaveClass("button", "buttonGhost", "my-custom-class");
      expect(button).not.toHaveClass("buttonPrimary", "buttonSecondary");
    });

    it("applies multiple custom classes", () => {
      render(
        <Button className="class-one class-two class-three">Button</Button>,
      );
      const button = screen.getByRole("button");

      expect(button).toHaveClass(
        "button",
        "buttonPrimary",
        "class-one",
        "class-two",
        "class-three",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      render(<Button>Accessible Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Button aria-describedby="help-text">Submit</Button>
          <div id="help-text">This will submit the form</div>
        </div>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "help-text");
    });

    it("is focusable by default", () => {
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole("button");

      button.focus();
      expect(button).toHaveFocus();
    });

    it("is not focusable when disabled", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("Edge Cases", () => {
    it("should not render when children is empty", () => {
      // @ts-expect-error
      const { container } = render(<Button />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when children is null", () => {
      const { container } = render(<Button>{null}</Button>);
      expect(container.firstChild).toBeNull();
    });

    it("maintains consistent className structure across re-renders", () => {
      const { rerender } = render(<Button variant="primary">Button</Button>);
      const button = screen.getByRole("button");
      const initialClassName = button.className;

      // Re-render with same props
      rerender(<Button variant="primary">Button</Button>);
      expect(button.className).toBe(initialClassName);
    });
  });
});
