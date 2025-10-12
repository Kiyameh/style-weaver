import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CssRadiusInput, { type CssRadiusValue } from "./CssRadiusInput";

describe("CssRadiusInput", () => {
  const mockOnRadiusChange = vi.fn();
  const defaultRadius: CssRadiusValue = { value: 8, unit: "px" };

  beforeEach(() => {
    mockOnRadiusChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByRole("slider")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should render slider and unit selector", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");
      const unitSelector = screen.getByRole("combobox");

      expect(slider).toBeInTheDocument();
      expect(unitSelector).toBeInTheDocument();
    });

    it("should render label with correct value and unit", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByText(/Border Radius: 8px/i)).toBeInTheDocument();
      expect(screen.getByText(/Unit:/i)).toBeInTheDocument();
    });

    it("should render slider with correct attributes", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");

      expect(slider).toHaveAttribute("type", "range");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "320"); // px unit has max 320
      expect(slider).toHaveAttribute("step", "1");
      expect(slider).toHaveValue("8");
    });

    it("should render preview box", () => {
      const { container } = render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const previewBox = container.querySelector('[style*="border-radius"]');
      expect(previewBox).toBeInTheDocument();
    });

    it("should render all unit options in select", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const options = screen.getAllByRole("option");

      expect(options).toHaveLength(4);
      expect(screen.getByRole("option", { name: "px" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "rem" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "em" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "%" })).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should handle different initial radius values", () => {
      const customRadius: CssRadiusValue = { value: 16, unit: "px" };
      render(
        <CssRadiusInput
          value={customRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByText(/Border Radius: 16px/i)).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveValue("16");
    });

    it("should handle different CSS units (px, rem, em, %)", () => {
      const units: Array<{
        value: number;
        unit: CssRadiusValue["unit"];
        expectedLabel: string;
      }> = [
        { value: 8, unit: "px", expectedLabel: "Border Radius: 8px" },
        { value: 1, unit: "rem", expectedLabel: "Border Radius: 1.00rem" }, // rem uses step 0.25, shows 2 decimals
        { value: 2, unit: "em", expectedLabel: "Border Radius: 2.00em" }, // em uses step 0.25, shows 2 decimals
        { value: 50, unit: "%", expectedLabel: "Border Radius: 50%" },
      ];

      units.forEach(({ value, unit, expectedLabel }) => {
        const { unmount } = render(
          <CssRadiusInput
            value={{ value, unit }}
            onRadiusChange={mockOnRadiusChange}
          />,
        );

        expect(
          screen.getByText(
            new RegExp(
              expectedLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              "i",
            ),
          ),
        ).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue(unit);

        unmount();
      });
    });

    it("should handle custom min, max, and step props", () => {
      render(
        <CssRadiusInput
          value={{ value: 2, unit: "rem" }}
          onRadiusChange={mockOnRadiusChange}
          min={0}
          max={5}
          step={0.25}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "5");
      expect(slider).toHaveAttribute("step", "0.25");
    });

    it("should handle zero radius value", () => {
      render(
        <CssRadiusInput
          value={{ value: 0, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByText(/Border Radius: 0px/i)).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveValue("0");
    });

    it("should handle maximum radius value", () => {
      render(
        <CssRadiusInput
          value={{ value: 100, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByText(/Border Radius: 100px/i)).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveValue("100");
    });
  });

  describe("Functionality", () => {
    it("should call onRadiusChange when slider value changes", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "16" } });

      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 16,
        unit: "px",
      });
      expect(mockOnRadiusChange).toHaveBeenCalledTimes(1);
    });

    it("should call onRadiusChange when unit changes", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const unitSelector = screen.getByRole("combobox");
      fireEvent.change(unitSelector, { target: { value: "rem" } });

      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 8,
        unit: "rem",
      });
      expect(mockOnRadiusChange).toHaveBeenCalledTimes(1);
    });

    it("should update internal state when value prop changes", async () => {
      const { rerender } = render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      expect(screen.getByText(/Border Radius: 8px/i)).toBeInTheDocument();

      rerender(
        <CssRadiusInput
          value={{ value: 24, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText(/Border Radius: 24px/i)).toBeInTheDocument();
      });
    });

    it("should preserve value when changing units", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const unitSelector = screen.getByRole("combobox");
      fireEvent.change(unitSelector, { target: { value: "rem" } });

      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 8,
        unit: "rem",
      });
      expect(screen.getByRole("slider")).toHaveValue("8");
    });

    it("should handle slider interaction correctly", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");

      fireEvent.change(slider, { target: { value: "32" } });
      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 32,
        unit: "px",
      });

      fireEvent.change(slider, { target: { value: "50" } });
      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 50,
        unit: "px",
      });

      expect(mockOnRadiusChange).toHaveBeenCalledTimes(2);
    });

    it("should handle unit selector interaction correctly", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const unitSelector = screen.getByRole("combobox");

      fireEvent.change(unitSelector, { target: { value: "rem" } });
      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 8,
        unit: "rem",
      });

      fireEvent.change(unitSelector, { target: { value: "em" } });
      expect(mockOnRadiusChange).toHaveBeenCalledWith({ value: 8, unit: "em" });

      expect(mockOnRadiusChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Props Forwarding", () => {
    it("should respect min prop", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
          min={5}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("min", "5");
    });

    it("should respect max prop", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
          max={50}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("max", "50");
    });

    it("should respect step prop", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
          step={0.5}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("step", "0.5");
    });

    it("should use default values when optional props are not provided", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "320"); // px unit has dynamic max of 320
      expect(slider).toHaveAttribute("step", "1"); // px unit has step of 1
    });
  });

  describe("Accessibility", () => {
    it("should have proper fieldset structure", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const fieldset = screen.getByRole("group");
      expect(fieldset.tagName).toBe("FIELDSET");
    });

    it("should have proper label associations", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");
      const unitSelector = screen.getByRole("combobox");

      expect(slider).toHaveAccessibleName();
      expect(unitSelector).toHaveAccessibleName();
    });

    it("should have unique IDs for form controls", () => {
      const { container } = render(
        <>
          <CssRadiusInput
            value={defaultRadius}
            onRadiusChange={mockOnRadiusChange}
          />
          <CssRadiusInput
            value={{ value: 16, unit: "rem" }}
            onRadiusChange={mockOnRadiusChange}
          />
        </>,
      );

      const sliders = container.querySelectorAll('input[type="range"]');
      const selects = container.querySelectorAll("select");

      const sliderIds = Array.from(sliders).map((s) => s.id);
      const selectIds = Array.from(selects).map((s) => s.id);

      expect(new Set(sliderIds).size).toBe(sliderIds.length);
      expect(new Set(selectIds).size).toBe(selectIds.length);
    });

    it("should be keyboard navigable", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");
      const unitSelector = screen.getByRole("combobox");

      slider.focus();
      expect(slider).toHaveFocus();

      unitSelector.focus();
      expect(unitSelector).toHaveFocus();
    });

    it("should have proper ARIA attributes on slider", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");

      expect(slider).toHaveAttribute("type", "range");
      expect(slider).toHaveAttribute("min");
      expect(slider).toHaveAttribute("max");
      expect(slider).toHaveAttribute("step");
    });
  });

  describe("Edge Cases", () => {
    it("should handle NaN values gracefully", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");

      // Create a custom event that bypasses browser sanitization
      // to test the component's NaN handling logic directly
      Object.defineProperty(slider, "value", {
        writable: true,
        value: "not-a-number",
      });

      fireEvent.change(slider, { target: { value: "not-a-number" } });

      // The callback should not be called because parseFloat("not-a-number") returns NaN
      // and the component checks for NaN before calling onRadiusChange
      expect(mockOnRadiusChange).not.toHaveBeenCalled();
    });

    it("should handle negative values", () => {
      render(
        <CssRadiusInput
          value={{ value: 0, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
          min={-10}
        />,
      );

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "-5" } });

      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: -5,
        unit: "px",
      });
    });

    it("should handle very large values", () => {
      render(
        <CssRadiusInput
          value={{ value: 500, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
          max={1000}
        />,
      );

      expect(screen.getByText(/Border Radius: 500px/i)).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveValue("500");
    });

    it("should handle decimal values with appropriate step", () => {
      render(
        <CssRadiusInput
          value={{ value: 1.5, unit: "rem" }}
          onRadiusChange={mockOnRadiusChange}
          step={0.1}
        />,
      );

      expect(screen.getByText(/Border Radius: 1\.50rem/i)).toBeInTheDocument();

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "2.3" } });

      expect(mockOnRadiusChange).toHaveBeenCalledWith({
        value: 2.3,
        unit: "rem",
      });
    });

    it("should handle rapid consecutive changes", () => {
      render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const slider = screen.getByRole("slider");

      fireEvent.change(slider, { target: { value: "10" } });
      fireEvent.change(slider, { target: { value: "20" } });
      fireEvent.change(slider, { target: { value: "30" } });
      fireEvent.change(slider, { target: { value: "40" } });

      expect(mockOnRadiusChange).toHaveBeenCalledTimes(4);
      expect(mockOnRadiusChange).toHaveBeenLastCalledWith({
        value: 40,
        unit: "px",
      });
    });
  });

  describe("Visual Preview", () => {
    it("should update preview box border-radius when value changes", () => {
      const { container, rerender } = render(
        <CssRadiusInput
          value={defaultRadius}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      let previewBox = container.querySelector('[style*="border-radius"]');
      expect(previewBox).toHaveStyle({ borderRadius: "8px" });

      rerender(
        <CssRadiusInput
          value={{ value: 24, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      previewBox = container.querySelector('[style*="border-radius"]');
      expect(previewBox).toHaveStyle({ borderRadius: "24px" });
    });

    it("should apply correct CSS unit to preview box", () => {
      const units: Array<CssRadiusValue> = [
        { value: 8, unit: "px" },
        { value: 1, unit: "rem" },
        { value: 2, unit: "em" },
        { value: 50, unit: "%" },
      ];

      units.forEach(({ value, unit }) => {
        const { container, unmount } = render(
          <CssRadiusInput
            value={{ value, unit }}
            onRadiusChange={mockOnRadiusChange}
          />,
        );

        const previewBox = container.querySelector('[style*="border-radius"]');
        expect(previewBox).toHaveStyle({ borderRadius: `${value}${unit}` });

        unmount();
      });
    });

    it("should show preview with correct inline styles", () => {
      const { container } = render(
        <CssRadiusInput
          value={{ value: 16, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
        />,
      );

      const previewBox = container.querySelector('[style*="border-radius"]');
      expect(previewBox).toHaveAttribute("style");
      expect(previewBox?.getAttribute("style")).toContain(
        "border-radius: 16px",
      );
    });
  });

  describe("Label Formatting", () => {
    it("should format integer values without decimals", () => {
      render(
        <CssRadiusInput
          value={{ value: 16, unit: "px" }}
          onRadiusChange={mockOnRadiusChange}
          step={1}
        />,
      );

      expect(screen.getByText(/Border Radius: 16px/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Border Radius: 16\.00px/i),
      ).not.toBeInTheDocument();
    });

    it("should format decimal values with 2 decimal places when step < 1", () => {
      render(
        <CssRadiusInput
          value={{ value: 1.5, unit: "rem" }}
          onRadiusChange={mockOnRadiusChange}
          step={0.25}
        />,
      );

      expect(screen.getByText(/Border Radius: 1\.50rem/i)).toBeInTheDocument();
    });

    it("should display correct unit in label", () => {
      const units: Array<{ value: CssRadiusValue; expectedLabel: string }> = [
        {
          value: { value: 8, unit: "px" },
          expectedLabel: "Border Radius: 8px",
        },
        {
          value: { value: 1, unit: "rem" },
          expectedLabel: "Border Radius: 1.00rem",
        },
        {
          value: { value: 2, unit: "em" },
          expectedLabel: "Border Radius: 2.00em",
        },
        {
          value: { value: 50, unit: "%" },
          expectedLabel: "Border Radius: 50%",
        },
      ];

      units.forEach(({ value, expectedLabel }) => {
        const { unmount } = render(
          <CssRadiusInput value={value} onRadiusChange={mockOnRadiusChange} />,
        );

        expect(
          screen.getByText(
            new RegExp(
              expectedLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              "i",
            ),
          ),
        ).toBeInTheDocument();

        unmount();
      });
    });
  });
});
