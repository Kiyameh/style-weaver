import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CssRadiusValue } from "@/components/atoms/CssRadiusInput";
import { RadiusPicker } from "./RadiusPicker";

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

// Mock CssRadiusInput
vi.mock("@/components/atoms/CssRadiusInput", () => ({
  default: ({
    value,
    onRadiusChange,
  }: {
    value: CssRadiusValue;
    onRadiusChange: (r: CssRadiusValue) => void;
  }) => (
    <div data-testid="css-radius-input">
      <button
        type="button"
        onClick={() => onRadiusChange({ value: 1, unit: "rem" })}
      >
        Change Radius {value.value}
        {value.unit}
      </button>
    </div>
  ),
}));

describe("RadiusPicker", () => {
  const mockOnChange = vi.fn();
  const defaultRadius: CssRadiusValue = { value: 0.5, unit: "rem" };

  // Helper to get the trigger button (first button in the DOM)
  const getTriggerButton = () => screen.getAllByRole("button")[0];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      expect(screen.getByTestId("popover")).toBeInTheDocument();
      expect(getTriggerButton()).toBeInTheDocument();
    });

    it("should render trigger button with correct attributes", () => {
      render(
        <RadiusPicker
          value={defaultRadius}
          onChange={mockOnChange}
          name="Medium"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("title", "Medium");
      expect(button).toHaveAttribute(
        "aria-label",
        "Select border radius Medium",
      );
    });

    it("should render name in popover content", () => {
      render(
        <RadiusPicker
          value={defaultRadius}
          onChange={mockOnChange}
          name="Large Radius"
        />,
      );

      expect(screen.getByText("Large Radius")).toBeInTheDocument();
    });

    it("should render CssRadiusInput inside popover", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-radius-input")).toBeInTheDocument();
    });

    it("should render preview box inside trigger", () => {
      const { container } = render(
        <RadiusPicker value={defaultRadius} onChange={mockOnChange} />,
      );

      const previewBox = container.querySelector(".previewBox");
      expect(previewBox).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should handle different CSS units", () => {
      const pxRadius: CssRadiusValue = { value: 16, unit: "px" };
      render(<RadiusPicker value={pxRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("16px");
    });

    it("should handle rem units", () => {
      const remRadius: CssRadiusValue = { value: 1.5, unit: "rem" };
      render(<RadiusPicker value={remRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("1.5rem");
    });

    it("should handle em units", () => {
      const emRadius: CssRadiusValue = { value: 2, unit: "em" };
      render(<RadiusPicker value={emRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("2em");
    });

    it("should handle percentage units", () => {
      const percentRadius: CssRadiusValue = { value: 50, unit: "%" };
      render(<RadiusPicker value={percentRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("50%");
    });

    it("should handle zero radius", () => {
      const zeroRadius: CssRadiusValue = { value: 0, unit: "px" };
      render(<RadiusPicker value={zeroRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("0px");
    });
  });

  describe("Functionality", () => {
    it("should call onChange when radius changes", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      const changeButton = screen.getByText(/Change Radius/);
      fireEvent.click(changeButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const calledRadius = mockOnChange.mock.calls[0][0];
      expect(calledRadius).toEqual({ value: 1, unit: "rem" });
    });

    it("should pass correct value to CssRadiusInput", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      expect(screen.getByText(/Change Radius 0.5rem/)).toBeInTheDocument();
    });

    it("should forward min, max, step props to CssRadiusInput", () => {
      render(
        <RadiusPicker
          value={defaultRadius}
          onChange={mockOnChange}
          min={0}
          max={5}
          step={0.25}
        />,
      );

      expect(screen.getByTestId("css-radius-input")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward value prop to CssRadiusInput", () => {
      const customRadius: CssRadiusValue = { value: 2.5, unit: "rem" };
      render(<RadiusPicker value={customRadius} onChange={mockOnChange} />);

      expect(screen.getByText(/Change Radius 2.5rem/)).toBeInTheDocument();
    });

    it("should handle missing name prop", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).not.toHaveAttribute("title");
    });

    it("should handle missing optional props", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-radius-input")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS custom property for radius", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      const radiusValue = button.style.getPropertyValue("--radius-value");
      expect(radiusValue).toBe("0.5rem");
    });

    it("should apply trigger CSS class", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).toHaveClass("trigger");
    });

    it("should generate correct radius string", () => {
      const testCases: CssRadiusValue[] = [
        { value: 0.25, unit: "rem" },
        { value: 8, unit: "px" },
        { value: 1.5, unit: "em" },
        { value: 100, unit: "%" },
      ];

      testCases.forEach((radius) => {
        const { container } = render(
          <RadiusPicker value={radius} onChange={mockOnChange} />,
        );
        const button = container.querySelector("button");
        const radiusValue = button?.style.getPropertyValue("--radius-value");
        expect(radiusValue).toBe(`${radius.value}${radius.unit}`);
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<RadiusPicker value={defaultRadius} onChange={mockOnChange} />);

      expect(getTriggerButton()).toBeInTheDocument();
    });

    it("should have descriptive aria-label", () => {
      render(
        <RadiusPicker
          value={defaultRadius}
          onChange={mockOnChange}
          name="Small"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute(
        "aria-label",
        "Select border radius Small",
      );
    });

    it("should have title attribute for tooltip", () => {
      render(
        <RadiusPicker
          value={defaultRadius}
          onChange={mockOnChange}
          name="Extra Large"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("title", "Extra Large");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large radius values", () => {
      const largeRadius: CssRadiusValue = { value: 999, unit: "px" };
      render(<RadiusPicker value={largeRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("999px");
    });

    it("should handle decimal values", () => {
      const decimalRadius: CssRadiusValue = { value: 0.125, unit: "rem" };
      render(<RadiusPicker value={decimalRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("0.125rem");
    });

    it("should handle negative values (if allowed)", () => {
      const negativeRadius: CssRadiusValue = { value: -1, unit: "px" };
      render(<RadiusPicker value={negativeRadius} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.getPropertyValue("--radius-value")).toBe("-1px");
    });
  });
});
