import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CssShadowInput, { type CssShadowValue } from "./CssShadowInput";

// Mock OklchColorInput to avoid complex color input testing
vi.mock("../OklchColorInput/OklchColorInput", () => ({
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

describe("CssShadowInput", () => {
  const mockOnShadowChange = vi.fn();
  const defaultShadow: CssShadowValue = {
    offsetX: { value: 2, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0.5, 0.1, 200]),
    inset: false,
  };

  beforeEach(() => {
    mockOnShadowChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByText("Box Shadow")).toBeInTheDocument();
    });

    it("should render all required controls", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByLabelText(/Offset X:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Offset Y:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Blur:/)).toBeInTheDocument();
      expect(screen.getByLabelText("Inset")).toBeInTheDocument();
    });

    it("should render visual preview box with shadow", () => {
      const { container } = render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      // The preview box should be visible and have box-shadow style
      const previewBox = container.querySelector('[style*="box-shadow"]');
      expect(previewBox).toBeInTheDocument();
    });

    it("should render color input section", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      // Shadow Color title is hidden but color input is rendered
      expect(screen.getByTestId("oklch-color-input")).toBeInTheDocument();
    });

    it("should render global unit selector with all options", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      // Should have only one unit selector (global)
      const selects = screen.getAllByRole("combobox");
      expect(selects).toHaveLength(1);

      // Check it has all unit options
      const unitSelect = selects[0];
      const options = unitSelect.querySelectorAll("option");
      expect(options).toHaveLength(4);
      expect(screen.getByRole("option", { name: "px" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "rem" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "em" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "%" })).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should handle shadow without blur", () => {
      const shadowWithoutBlur: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };

      render(
        <CssShadowInput
          value={shadowWithoutBlur}
          onShadowChange={mockOnShadowChange}
          showBlur={false}
        />,
      );

      expect(screen.queryByLabelText(/Blur:/)).not.toBeInTheDocument();
    });

    it("should handle shadow with spread", () => {
      const shadowWithSpread: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 1, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };

      render(
        <CssShadowInput
          value={shadowWithSpread}
          onShadowChange={mockOnShadowChange}
          showSpread={true}
        />,
      );

      expect(screen.getByLabelText(/Spread:/)).toBeInTheDocument();
    });

    it("should handle inset shadow", () => {
      const insetShadow: CssShadowValue = {
        ...defaultShadow,
        inset: true,
      };

      render(
        <CssShadowInput
          value={insetShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const checkbox = screen.getByLabelText("Inset") as HTMLInputElement;
      expect(checkbox.checked).toBe(true);

      const output = screen.getByText(/inset 2px 2px/);
      expect(output).toBeInTheDocument();
    });

    it("should handle different CSS units", () => {
      const remShadow: CssShadowValue = {
        offsetX: { value: 0.5, unit: "rem" },
        offsetY: { value: 0.5, unit: "rem" },
        blur: { value: 1, unit: "rem" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };

      render(
        <CssShadowInput
          value={remShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByText(/0.5rem 0.5rem 1rem/)).toBeInTheDocument();
    });

    it("should handle custom min, max, and step props", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
          min={-100}
          max={100}
          step={0.5}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveAttribute("min", "-100");
      expect(sliders[0]).toHaveAttribute("max", "100");
      expect(sliders[0]).toHaveAttribute("step", "0.5");
    });
  });

  describe("Functionality", () => {
    it("should call onShadowChange when offsetX changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const offsetXSlider = screen.getByLabelText(/Offset X:/);
      fireEvent.change(offsetXSlider, { target: { value: "5" } });

      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          offsetX: { value: 5, unit: "px" },
        }),
      );
    });

    it("should call onShadowChange when offsetY changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const offsetYSlider = screen.getByLabelText(/Offset Y:/);
      fireEvent.change(offsetYSlider, { target: { value: "10" } });

      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          offsetY: { value: 10, unit: "px" },
        }),
      );
    });

    it("should call onShadowChange when blur changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const blurSlider = screen.getByLabelText(/Blur:/);
      fireEvent.change(blurSlider, { target: { value: "8" } });

      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          blur: { value: 8, unit: "px" },
        }),
      );
    });

    it("should call onShadowChange when global unit changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const unitSelect = screen.getByLabelText("Unit for all values");
      fireEvent.change(unitSelect, { target: { value: "rem" } });

      // All values should change to rem
      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          offsetX: { value: 2, unit: "rem" },
          offsetY: { value: 2, unit: "rem" },
          blur: { value: 4, unit: "rem" },
        }),
      );
    });

    it("should call onShadowChange when inset changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const insetCheckbox = screen.getByLabelText("Inset");
      fireEvent.click(insetCheckbox);

      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inset: true,
        }),
      );
    });

    it("should call onShadowChange when color changes", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const changeColorButton = screen.getByText(/Change Color/);
      fireEvent.click(changeColorButton);

      expect(mockOnShadowChange).toHaveBeenCalled();
      const call = mockOnShadowChange.mock.calls[0][0];
      expect(call.color).toBeInstanceOf(Color);
    });

    it("should update internal state when value prop changes", () => {
      const { rerender } = render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const newShadow: CssShadowValue = {
        offsetX: { value: 10, unit: "px" },
        offsetY: { value: 10, unit: "px" },
        blur: { value: 20, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: true,
      };

      rerender(
        <CssShadowInput
          value={newShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByText(/Offset X: 10px/)).toBeInTheDocument();
      expect(screen.getByText(/Offset Y: 10px/)).toBeInTheDocument();
      expect(screen.getByText(/Blur: 20px/)).toBeInTheDocument();
    });
  });

  describe("CSS Generation", () => {
    it("should generate correct CSS string for basic shadow", () => {
      const { container } = render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      // Check the preview box has the correct box-shadow style
      const previewBox = container.querySelector('[style*="box-shadow"]');
      expect(previewBox).toBeInTheDocument();
      expect(previewBox?.getAttribute("style")).toMatch(
        /2px 2px 4px oklch\([^)]+\)/,
      );
    });

    it("should generate correct CSS string for inset shadow", () => {
      const insetShadow: CssShadowValue = {
        ...defaultShadow,
        inset: true,
      };

      const { container } = render(
        <CssShadowInput
          value={insetShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const previewBox = container.querySelector('[style*="box-shadow"]');
      expect(previewBox?.getAttribute("style")).toMatch(/inset 2px 2px/);
    });

    it("should generate correct CSS string with spread", () => {
      const shadowWithSpread: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        blur: { value: 4, unit: "px" },
        spread: { value: 1, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };

      const { container } = render(
        <CssShadowInput
          value={shadowWithSpread}
          onShadowChange={mockOnShadowChange}
          showSpread={true}
        />,
      );

      const previewBox = container.querySelector('[style*="box-shadow"]');
      expect(previewBox?.getAttribute("style")).toMatch(
        /2px 2px 4px 1px oklch/,
      );
    });

    it("should include alpha in color output", () => {
      const shadowWithAlpha: CssShadowValue = {
        ...defaultShadow,
        color: new Color("oklch", [0.5, 0.1, 200], 0.5),
      };

      const { container } = render(
        <CssShadowInput
          value={shadowWithAlpha}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const previewBox = container.querySelector('[style*="box-shadow"]');
      expect(previewBox?.getAttribute("style")).toMatch(
        /oklch\([^)]+\/ 0\.50\)/,
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle NaN values gracefully for offsetX", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const offsetXSlider = screen.getByLabelText(/Offset X:/);
      // Browsers sanitize range input values, so we need to mock the value property
      Object.defineProperty(offsetXSlider, "value", {
        writable: true,
        value: "not-a-number",
      });
      fireEvent.change(offsetXSlider, { target: { value: "not-a-number" } });

      expect(mockOnShadowChange).not.toHaveBeenCalled();
    });

    it("should handle NaN values gracefully for blur", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const blurSlider = screen.getByLabelText(/Blur:/);
      // Browsers sanitize range input values, so we need to mock the value property
      Object.defineProperty(blurSlider, "value", {
        writable: true,
        value: "invalid",
      });
      fireEvent.change(blurSlider, { target: { value: "invalid" } });

      expect(mockOnShadowChange).not.toHaveBeenCalled();
    });

    it("should handle negative offset values", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
          min={-50}
        />,
      );

      const offsetXSlider = screen.getByLabelText(/Offset X:/);
      fireEvent.change(offsetXSlider, { target: { value: "-10" } });

      expect(mockOnShadowChange).toHaveBeenCalledWith(
        expect.objectContaining({
          offsetX: { value: -10, unit: "px" },
        }),
      );
    });

    it("should not render blur control when showBlur is false", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
          showBlur={false}
        />,
      );

      expect(screen.queryByLabelText(/Blur:/)).not.toBeInTheDocument();
    });

    it("should not render spread control when showSpread is false", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
          showSpread={false}
        />,
      );

      expect(screen.queryByLabelText(/Spread:/)).not.toBeInTheDocument();
    });

    it("should handle shadow without blur property in value", () => {
      const shadowWithoutBlur: CssShadowValue = {
        offsetX: { value: 2, unit: "px" },
        offsetY: { value: 2, unit: "px" },
        color: new Color("oklch", [0.5, 0.1, 200]),
        inset: false,
      };

      render(
        <CssShadowInput
          value={shadowWithoutBlur}
          onShadowChange={mockOnShadowChange}
          showBlur={true}
        />,
      );

      expect(screen.queryByLabelText(/Blur:/)).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper fieldset structure", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const fieldset = screen.getByRole("group");
      expect(fieldset).toBeInTheDocument();
      expect(fieldset.tagName).toBe("FIELDSET");
    });

    it("should have legend for fieldset", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByText("Box Shadow")).toBeInTheDocument();
    });

    it("should have proper labels for all sliders", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByLabelText(/Offset X:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Offset Y:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Blur:/)).toBeInTheDocument();
    });

    it("should have aria-label for global unit selector", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      expect(screen.getByLabelText("Unit for all values")).toBeInTheDocument();
    });

    it("should support keyboard navigation on checkbox", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const checkbox = screen.getByLabelText("Inset");
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it("should have proper ARIA attributes on sliders", () => {
      render(
        <CssShadowInput
          value={defaultShadow}
          onShadowChange={mockOnShadowChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute("type", "range");
        expect(slider).toHaveAttribute("min");
        expect(slider).toHaveAttribute("max");
        expect(slider).toHaveAttribute("step");
      });
    });
  });
});
