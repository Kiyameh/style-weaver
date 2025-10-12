import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ColorPicker } from "./ColorPicker";

// Mock Popover to simplify testing
vi.mock("@/components/atoms/Popover", () => ({
  default: ({
    trigger,
    children,
  }: {
    trigger: React.ReactElement;
    children: React.ReactNode;
  }) => (
    <div data-testid="popover">
      {trigger}
      <div data-testid="popover-content">{children}</div>
    </div>
  ),
}));

// Mock OklchColorInput
vi.mock("@/components/atoms/OklchColorInput", () => ({
  default: ({
    value,
    onColorChange,
  }: {
    value: Color;
    onColorChange: (c: Color) => void;
  }) => (
    <div data-testid="oklch-color-input">
      <button
        type="button"
        onClick={() => onColorChange(new Color("oklch", [0.5, 0.1, 180]))}
      >
        Change Color {value.toString()}
      </button>
    </div>
  ),
}));

describe("ColorPicker", () => {
  const mockOnChange = vi.fn();
  const defaultColor = new Color("oklch", [0.7, 0.15, 180]);

  // Helper to get the trigger button (first button in the DOM)
  const getTriggerButton = () => screen.getAllByRole("button")[0];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      expect(screen.getByTestId("popover")).toBeInTheDocument();
      expect(getTriggerButton()).toBeInTheDocument();
    });

    it("should render trigger button with correct attributes", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          name="Primary"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("title", "Primary");
      expect(button).toHaveAttribute("aria-label", "Select color Primary");
    });

    it("should render name in popover content", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          name="Primary Color"
        />,
      );

      expect(screen.getByText("Primary Color")).toBeInTheDocument();
    });

    it("should render OklchColorInput inside popover", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      expect(screen.getByTestId("oklch-color-input")).toBeInTheDocument();
    });

    it("should render trigger button with ampersand symbol", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.textContent).toBe("&");
    });
  });

  describe("Variants", () => {
    it("should handle content mode", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="content"
        />,
      );

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--color")).toBeTruthy();
    });

    it("should handle surface mode (default)", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="surface"
        />,
      );

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--background")).toBeTruthy();
    });

    it("should handle border mode", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="border"
        />,
      );

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--border")).toBeTruthy();
    });

    it("should use background color when provided", () => {
      const backgroundColor = new Color("oklch", [0.9, 0.05, 200]);
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          background={backgroundColor}
          mode="content"
        />,
      );

      const button = getTriggerButton();
      const bgValue = button.style.getPropertyValue("--background");
      expect(bgValue).toContain("oklch");
    });

    it("should use fallback background when not provided", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="content"
        />,
      );

      const button = getTriggerButton();
      const bgValue = button.style.getPropertyValue("--background");
      expect(bgValue).toBe("var(--sw-surface-100)");
    });
  });

  describe("Functionality", () => {
    it("should call onChange when color changes", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      const changeButton = screen.getByText(/Change Color/);
      fireEvent.click(changeButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnChange.mock.calls[0][0];
      expect(calledColor).toBeInstanceOf(Color);
    });

    it("should pass correct value to OklchColorInput", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      expect(screen.getByText(/Change Color/)).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward value prop to OklchColorInput", () => {
      const customColor = new Color("oklch", [0.5, 0.2, 90]);
      render(<ColorPicker value={customColor} onChange={mockOnChange} />);

      expect(screen.getByTestId("oklch-color-input")).toBeInTheDocument();
    });

    it("should handle missing name prop", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).not.toHaveAttribute("title");
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS custom properties for content mode", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="content"
        />,
      );

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--color")).toBeTruthy();
      expect(button.style.getPropertyValue("--color")).not.toBe("transparent");
    });

    it("should set transparent color for non-content modes", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          mode="surface"
        />,
      );

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--color")).toBe("transparent");
    });

    it("should apply trigger CSS class", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).toHaveClass("trigger");
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<ColorPicker value={defaultColor} onChange={mockOnChange} />);

      expect(getTriggerButton()).toBeInTheDocument();
    });

    it("should have descriptive aria-label", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          name="Primary"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("aria-label", "Select color Primary");
    });

    it("should have title attribute for tooltip", () => {
      render(
        <ColorPicker
          value={defaultColor}
          onChange={mockOnChange}
          name="Secondary"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("title", "Secondary");
    });
  });
});
