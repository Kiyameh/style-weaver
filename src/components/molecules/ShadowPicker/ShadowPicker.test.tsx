import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CssShadowValue } from "@/components/atoms/CssShadowInput";
import { ShadowPicker } from "./ShadowPicker";

// Mock Popover to simplify testing
vi.mock("@/components/atoms/Popover", () => ({
  default: ({
    trigger,
    children,
    style,
  }: {
    trigger: React.ReactElement;
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div data-testid="popover" style={style}>
      {trigger}
      <div data-testid="popover-content">{children}</div>
    </div>
  ),
}));

// Mock CssShadowInput
vi.mock("@/components/atoms/CssShadowInput", () => ({
  default: ({
    onShadowChange,
  }: {
    onShadowChange: (s: CssShadowValue) => void;
  }) => (
    <div data-testid="css-shadow-input">
      <button
        type="button"
        onClick={() =>
          onShadowChange({
            offsetX: { value: 4, unit: "px" },
            offsetY: { value: 4, unit: "px" },
            blur: { value: 8, unit: "px" },
            color: new Color("oklch", [0.5, 0.1, 180]),
            inset: false,
          })
        }
      >
        Change Shadow
      </button>
    </div>
  ),
}));

describe("ShadowPicker", () => {
  const mockOnChange = vi.fn();
  const defaultShadow: CssShadowValue = {
    offsetX: { value: 2, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0.5, 0.1, 200]),
    inset: false,
  };

  // Helper to get the trigger button (first button in the DOM)
  const getTriggerButton = () => screen.getAllByRole("button")[0];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      expect(screen.getByTestId("popover")).toBeInTheDocument();
      expect(screen.getAllByRole("button")[0]).toBeInTheDocument();
    });

    it("should render trigger button with correct attributes", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          name="Medium"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("title", "Medium");
      expect(button).toHaveAttribute("aria-label", "Select box shadow Medium");
    });

    it("should render name in popover content", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          name="Large Shadow"
        />,
      );

      expect(screen.getByText("shadow-Large Shadow")).toBeInTheDocument();
    });

    it("should render CssShadowInput inside popover", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should apply shadow to trigger button", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toBeTruthy();
    });

    it("should set popover max width", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const popover = screen.getByTestId("popover");
      expect(popover.style.maxWidth).toBe("480px");
    });
  });

  describe("Shadow String Generation", () => {
    it("should generate correct shadow string for basic shadow", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      const shadow = button.style.boxShadow;
      expect(shadow).toContain("2px 2px 4px");
      expect(shadow).toContain("oklch");
    });

    it("should include inset in shadow string when true", () => {
      const insetShadow: CssShadowValue = {
        ...defaultShadow,
        inset: true,
      };
      render(<ShadowPicker value={insetShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("inset");
    });

    it("should include spread in shadow string when provided", () => {
      const shadowWithSpread: CssShadowValue = {
        ...defaultShadow,
        spread: { value: 2, unit: "px" },
      };
      render(<ShadowPicker value={shadowWithSpread} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("2px");
    });

    it("should format color in OKLCH format", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      const shadow = button.style.boxShadow;
      expect(shadow).toContain("oklch");
      expect(shadow).toMatch(/oklch\([^)]+\)/);
    });

    it("should include alpha in color when not 1", () => {
      const shadowWithAlpha: CssShadowValue = {
        ...defaultShadow,
        color: new Color("oklch", [0.5, 0.1, 200], 0.5),
      };
      render(<ShadowPicker value={shadowWithAlpha} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("/");
    });
  });

  describe("Variants", () => {
    it("should handle different CSS units", () => {
      const remShadow: CssShadowValue = {
        offsetX: { value: 0.5, unit: "rem" },
        offsetY: { value: 0.5, unit: "rem" },
        blur: { value: 1, unit: "rem" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };
      render(<ShadowPicker value={remShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("rem");
    });

    it("should handle shadow without blur", () => {
      const shadowWithoutBlur: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };
      render(
        <ShadowPicker
          value={shadowWithoutBlur}
          onChange={mockOnChange}
          showBlur={false}
        />,
      );

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should handle shadow with spread", () => {
      const shadowWithSpread: CssShadowValue = {
        ...defaultShadow,
        spread: { value: 1, unit: "px" },
      };
      render(
        <ShadowPicker
          value={shadowWithSpread}
          onChange={mockOnChange}
          showSpread={true}
        />,
      );

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should handle negative offset values", () => {
      const negativeShadow: CssShadowValue = {
        offsetX: { value: -2, unit: "px" },
        offsetY: { value: -2, unit: "px" },
        blur: { value: 4, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };
      render(<ShadowPicker value={negativeShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("-2px");
    });
  });

  describe("Functionality", () => {
    it("should call onChange when shadow changes", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const changeButton = screen.getByText("Change Shadow");
      fireEvent.click(changeButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const calledShadow = mockOnChange.mock.calls[0][0];
      expect(calledShadow).toHaveProperty("offsetX");
      expect(calledShadow).toHaveProperty("offsetY");
      expect(calledShadow).toHaveProperty("blur");
      expect(calledShadow).toHaveProperty("color");
    });

    it("should pass showBlur prop to CssShadowInput", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          showBlur={false}
        />,
      );

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should pass showSpread prop to CssShadowInput", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          showSpread={true}
        />,
      );

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should forward min, max, step props to CssShadowInput", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          min={-50}
          max={50}
          step={1}
        />,
      );

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward value prop to CssShadowInput", () => {
      const customShadow: CssShadowValue = {
        offsetX: { value: 10, unit: "px" },
        offsetY: { value: 10, unit: "px" },
        blur: { value: 20, unit: "px" },
        color: new Color("oklch", [0.3, 0.2, 90]),
        inset: true,
      };
      render(<ShadowPicker value={customShadow} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should handle missing name prop", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).not.toHaveAttribute("title");
    });

    it("should use default showBlur value", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });

    it("should use default showSpread value", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      expect(screen.getByTestId("css-shadow-input")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply trigger CSS class", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button).toHaveClass("trigger");
    });

    it("should apply box-shadow style to trigger", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toBeTruthy();
    });

    it("should update shadow when value changes", () => {
      const { rerender } = render(
        <ShadowPicker value={defaultShadow} onChange={mockOnChange} />,
      );

      const newShadow: CssShadowValue = {
        offsetX: { value: 8, unit: "px" },
        offsetY: { value: 8, unit: "px" },
        blur: { value: 16, unit: "px" },
        color: new Color("oklch", [0.3, 0.15, 120]),
        inset: false,
      };

      rerender(<ShadowPicker value={newShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("8px 8px 16px");
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<ShadowPicker value={defaultShadow} onChange={mockOnChange} />);

      expect(getTriggerButton()).toBeInTheDocument();
    });

    it("should have descriptive aria-label", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          name="Small"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("aria-label", "Select box shadow Small");
    });

    it("should have title attribute for tooltip", () => {
      render(
        <ShadowPicker
          value={defaultShadow}
          onChange={mockOnChange}
          name="Extra Large"
        />,
      );

      const button = getTriggerButton();
      expect(button).toHaveAttribute("title", "Extra Large");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero offset values", () => {
      const zeroShadow: CssShadowValue = {
        offsetX: { value: 0, unit: "px" },
        offsetY: { value: 0, unit: "px" },
        blur: { value: 4, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };
      render(<ShadowPicker value={zeroShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("0px 0px");
    });

    it("should handle very large shadow values", () => {
      const largeShadow: CssShadowValue = {
        offsetX: { value: 100, unit: "px" },
        offsetY: { value: 100, unit: "px" },
        blur: { value: 200, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };
      render(<ShadowPicker value={largeShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("100px 100px 200px");
    });

    it("should handle transparent colors", () => {
      const transparentShadow: CssShadowValue = {
        ...defaultShadow,
        color: new Color("oklch", [0.5, 0.1, 200], 0),
      };
      render(
        <ShadowPicker value={transparentShadow} onChange={mockOnChange} />,
      );

      const button = getTriggerButton();
      expect(button.style.boxShadow).toContain("/ 0");
    });

    it("should handle colors with high chroma", () => {
      const vibrantShadow: CssShadowValue = {
        ...defaultShadow,
        color: new Color("oklch", [0.7, 0.35, 120]),
      };
      render(<ShadowPicker value={vibrantShadow} onChange={mockOnChange} />);

      const button = getTriggerButton();
      expect(button.style.boxShadow).toBeTruthy();
    });
  });
});
