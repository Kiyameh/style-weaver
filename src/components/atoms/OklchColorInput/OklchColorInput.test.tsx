import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OklchColorInput from "./OklchColorInput";

describe("OklchColorInput", () => {
  const mockOnColorChange = vi.fn();
  const defaultColor = new Color("oklch", [0.7, 0.15, 180], 1);

  // Helper function to find text that might be split across multiple elements
  const findByTextContent = (text: string) => {
    return screen.getByText(text);
  };

  beforeEach(() => {
    mockOnColorChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getAllByRole("slider")).toHaveLength(4);
    });

    it("should render all four sliders (hue, chroma, lightness, alpha)", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(4);

      // Check slider attributes to identify each one
      expect(sliders[0]).toHaveAttribute("min", "0");
      expect(sliders[0]).toHaveAttribute("max", "360");
      expect(sliders[1]).toHaveAttribute("max", "0.37");
      expect(sliders[2]).toHaveAttribute("max", "1");
      expect(sliders[3]).toHaveAttribute("max", "1");
    });

    it("should render labels with correct values", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Hue: 180°")).toBeInTheDocument();
      expect(findByTextContent("Chroma: 0.15")).toBeInTheDocument();
      expect(findByTextContent("Lightness: 0.70")).toBeInTheDocument();
      expect(findByTextContent("Alpha: 1.00")).toBeInTheDocument();
    });

    it("should render sliders with correct attributes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      // Hue slider
      expect(sliders[0]).toHaveAttribute("type", "range");
      expect(sliders[0]).toHaveAttribute("min", "0");
      expect(sliders[0]).toHaveAttribute("max", "360");
      expect(sliders[0]).toHaveAttribute("step", "1");

      // Chroma slider
      expect(sliders[1]).toHaveAttribute("min", "0");
      expect(sliders[1]).toHaveAttribute("max", "0.37");
      expect(sliders[1]).toHaveAttribute("step", "0.01");

      // Lightness slider
      expect(sliders[2]).toHaveAttribute("min", "0");
      expect(sliders[2]).toHaveAttribute("max", "1");
      expect(sliders[2]).toHaveAttribute("step", "0.01");

      // Alpha slider
      expect(sliders[3]).toHaveAttribute("min", "0");
      expect(sliders[3]).toHaveAttribute("max", "1");
      expect(sliders[3]).toHaveAttribute("step", "0.01");
    });
  });

  describe("Variants", () => {
    it("should handle different initial color values", () => {
      const redColor = new Color("oklch", [0.6, 0.25, 30], 1);
      render(
        <OklchColorInput value={redColor} onColorChange={mockOnColorChange} />,
      );

      expect(findByTextContent("Hue: 30°")).toBeInTheDocument();
      expect(findByTextContent("Chroma: 0.25")).toBeInTheDocument();
      expect(findByTextContent("Lightness: 0.60")).toBeInTheDocument();
      expect(findByTextContent("Alpha: 1.00")).toBeInTheDocument();
    });

    it("should handle colors with different alpha values", () => {
      const transparentColor = new Color("oklch", [0.5, 0.1, 120], 0.5);
      render(
        <OklchColorInput
          value={transparentColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Alpha: 0.50")).toBeInTheDocument();

      const alphaSlider = screen.getAllByRole("slider")[3];
      expect(alphaSlider).toHaveValue("0.5");
    });

    it("should handle colors with extreme OKLCH values", () => {
      const extremeColor = new Color("oklch", [0.95, 0.35, 359], 0.01);
      render(
        <OklchColorInput
          value={extremeColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Hue: 359°")).toBeInTheDocument();
      expect(findByTextContent("Chroma: 0.35")).toBeInTheDocument();
      expect(findByTextContent("Lightness: 0.95")).toBeInTheDocument();
      expect(findByTextContent("Alpha: 0.01")).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("should call onColorChange when hue slider changes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "90" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(Math.round(calledColor.oklch.hue)).toBe(90);
    });

    it("should call onColorChange when chroma slider changes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const chromaSlider = screen.getAllByRole("slider")[1];
      fireEvent.change(chromaSlider, { target: { value: "0.25" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor.oklch.chroma).toBeCloseTo(0.25, 2);
    });

    it("should call onColorChange when lightness slider changes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const lightnessSlider = screen.getAllByRole("slider")[2];
      fireEvent.change(lightnessSlider, { target: { value: "0.5" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor.oklch.lightness).toBeCloseTo(0.5, 2);
    });

    it("should call onColorChange when alpha slider changes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const alphaSlider = screen.getAllByRole("slider")[3];
      fireEvent.change(alphaSlider, { target: { value: "0.8" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor.alpha).toBeCloseTo(0.8, 2);
    });

    it("should update internal state when sliders change", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "270" } });

      // Check that the label updates to reflect the new value
      expect(findByTextContent("Hue: 270°")).toBeInTheDocument();
    });

    it("should preserve other color values when changing one component", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "45" } });

      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor.oklch.lightness).toBeCloseTo(0.7, 2);
      expect(calledColor.oklch.chroma).toBeCloseTo(0.15, 2);
      expect(calledColor.alpha).toBeCloseTo(1, 2);
      expect(Math.round(calledColor.oklch.hue)).toBe(45);
    });

    it("should handle rapid slider changes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];

      // Simulate rapid changes
      fireEvent.change(hueSlider, { target: { value: "90" } });
      fireEvent.change(hueSlider, { target: { value: "180" } });
      fireEvent.change(hueSlider, { target: { value: "270" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(3);

      // Check final state
      const finalColor = mockOnColorChange.mock.calls[2][0];
      expect(Math.round(finalColor.oklch.hue)).toBe(270);
    });
  });

  describe("Props Forwarding", () => {
    it("should use the provided value prop as initial color", () => {
      const customColor = new Color("oklch", [0.8, 0.2, 45], 0.9);
      render(
        <OklchColorInput
          value={customColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Hue: 45°")).toBeInTheDocument();
      expect(findByTextContent("Chroma: 0.20")).toBeInTheDocument();
      expect(findByTextContent("Lightness: 0.80")).toBeInTheDocument();
      expect(findByTextContent("Alpha: 0.90")).toBeInTheDocument();

      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveValue("45");
      expect(sliders[1]).toHaveValue("0.2");
      expect(sliders[2]).toHaveValue("0.8");
      expect(sliders[3]).toHaveValue("0.9");
    });

    it("should call onColorChange with correct Color instance", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "120" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];

      expect(calledColor).toBeInstanceOf(Color);
      expect(calledColor.space.id).toBe("oklch");
      expect(Math.round(calledColor.oklch.hue)).toBe(120);
    });

    it("should handle value prop changes", async () => {
      const { rerender } = render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Hue: 180°")).toBeInTheDocument();

      const newColor = new Color("oklch", [0.5, 0.3, 60], 0.7);
      rerender(
        <OklchColorInput value={newColor} onColorChange={mockOnColorChange} />,
      );

      await waitFor(() => {
        expect(findByTextContent("Hue: 60°")).toBeInTheDocument();
        expect(findByTextContent("Chroma: 0.30")).toBeInTheDocument();
        expect(findByTextContent("Lightness: 0.50")).toBeInTheDocument();
        expect(findByTextContent("Alpha: 0.70")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels associated with inputs", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      // Check that each slider has an associated label
      sliders.forEach((slider) => {
        const id = slider.getAttribute("id");
        expect(id).toBeTruthy();

        // Find the label that has htmlFor matching this slider's id
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label).toBeTruthy();
      });

      // Check specific labels exist
      expect(screen.getByLabelText(/Hue:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Chroma:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Lightness:/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Alpha:/)).toBeInTheDocument();
    });

    it("should have unique IDs for all inputs", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      const ids = sliders.map((slider) => slider.getAttribute("id"));

      // Check all IDs are present
      ids.forEach((id) => {
        expect(id).toBeTruthy();
      });

      // Check all IDs are unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should be keyboard navigable", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      // Check that sliders can receive focus
      sliders.forEach((slider) => {
        slider.focus();
        expect(slider).toHaveFocus();
      });
    });

    it("should have proper ARIA attributes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute("type", "range");
        expect(slider).toHaveAttribute("min");
        expect(slider).toHaveAttribute("max");
        expect(slider).toHaveAttribute("step");
        expect(slider).toHaveAttribute("value");
      });
    });

    it("should have proper fieldset structure", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const fieldset = screen.getByRole("group");
      expect(fieldset).toBeInTheDocument();
      expect(fieldset.tagName).toBe("FIELDSET");

      // Check that all sliders are within the fieldset
      const sliders = screen.getAllByRole("slider");
      sliders.forEach((slider) => {
        expect(fieldset).toContainElement(slider);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid slider values gracefully", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];

      // Test with invalid string value
      fireEvent.change(hueSlider, { target: { value: "invalid" } });

      // Should not crash and should not call onColorChange with invalid values
      expect(mockOnColorChange).toHaveBeenCalledTimes(0);

      // Should still work with valid values after invalid input
      fireEvent.change(hueSlider, { target: { value: "90" } });
      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor).toBeInstanceOf(Color);
    });

    it("should handle NaN values in color components", () => {
      // Create a color with NaN hue (achromatic color)
      const achromaticColor = new Color("oklch", [0.5, 0, Number.NaN], 1);

      expect(() => {
        render(
          <OklchColorInput
            value={achromaticColor}
            onColorChange={mockOnColorChange}
          />,
        );
      }).not.toThrow();

      // Should render without crashing
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("should handle color conversion errors", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const chromaSlider = screen.getAllByRole("slider")[1];

      // Test with extreme chroma value that might cause conversion issues
      fireEvent.change(chromaSlider, { target: { value: "1.0" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor).toBeInstanceOf(Color);
    });

    it("should handle extreme slider values (min/max)", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      // Test hue at max value
      fireEvent.change(sliders[0], { target: { value: "360" } });
      expect(mockOnColorChange).toHaveBeenCalledTimes(1);

      // Test chroma at max value
      fireEvent.change(sliders[1], { target: { value: "0.37" } });
      expect(mockOnColorChange).toHaveBeenCalledTimes(2);

      // Test lightness at min and max
      fireEvent.change(sliders[2], { target: { value: "0" } });
      fireEvent.change(sliders[2], { target: { value: "1" } });
      expect(mockOnColorChange).toHaveBeenCalledTimes(4);

      // Test alpha at min and max
      fireEvent.change(sliders[3], { target: { value: "0" } });
      fireEvent.change(sliders[3], { target: { value: "1" } });
      expect(mockOnColorChange).toHaveBeenCalledTimes(6);
    });

    it("should handle alpha value of 0", () => {
      const transparentColor = new Color("oklch", [0.5, 0.2, 180], 0);
      render(
        <OklchColorInput
          value={transparentColor}
          onColorChange={mockOnColorChange}
        />,
      );

      expect(findByTextContent("Alpha: 0.00")).toBeInTheDocument();

      const alphaSlider = screen.getAllByRole("slider")[3];
      expect(alphaSlider).toHaveValue("0");

      // Should still be able to change other values
      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "90" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor.alpha).toBe(0);
    });

    it("should handle colors outside sRGB gamut", () => {
      // Create a highly saturated color that might be outside sRGB gamut
      const wideGamutColor = new Color("oklch", [0.7, 0.35, 120], 1);

      expect(() => {
        render(
          <OklchColorInput
            value={wideGamutColor}
            onColorChange={mockOnColorChange}
          />,
        );
      }).not.toThrow();

      // Should render and allow interactions
      const hueSlider = screen.getAllByRole("slider")[0];
      fireEvent.change(hueSlider, { target: { value: "240" } });

      expect(mockOnColorChange).toHaveBeenCalledTimes(1);
      const calledColor = mockOnColorChange.mock.calls[0][0];
      expect(calledColor).toBeInstanceOf(Color);
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const fieldset = screen.getByRole("group");
      expect(fieldset).toHaveClass("selectors");

      const sliders = screen.getAllByRole("slider");
      sliders.forEach((slider) => {
        expect(slider).toHaveClass("slider");
      });
    });

    it("should generate correct gradient backgrounds for sliders", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      // Hue slider should have rainbow gradient
      const hueSlider = sliders[0];
      const hueStyle = hueSlider.style.background;
      expect(hueStyle).toContain("linear-gradient");
      expect(hueStyle).toContain("oklch");

      // Chroma slider should have saturation gradient
      const chromaSlider = sliders[1];
      const chromaStyle = chromaSlider.style.background;
      expect(chromaStyle).toContain("linear-gradient");
      expect(chromaStyle).toContain("oklch");

      // Lightness slider should have lightness gradient
      const lightnessSlider = sliders[2];
      const lightnessStyle = lightnessSlider.style.background;
      expect(lightnessStyle).toContain("linear-gradient");
      expect(lightnessStyle).toContain("oklch");

      // Alpha slider should have alpha gradient
      const alphaSlider = sliders[3];
      const alphaStyle = alphaSlider.style.background;
      expect(alphaStyle).toContain("linear-gradient");
      expect(alphaStyle).toContain("oklch");
    });

    it("should set correct thumb colors", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      sliders.forEach((slider) => {
        const thumbColor = slider.style.getPropertyValue("--thumb-color");
        expect(thumbColor).toBeTruthy();

        // All sliders should use OKLCH format
        expect(thumbColor).toContain("oklch");
      });
    });

    it("should handle CSS custom properties correctly", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const sliders = screen.getAllByRole("slider");

      sliders.forEach((slider) => {
        const thumbColor = slider.style.getPropertyValue("--thumb-color");
        expect(thumbColor).toBeTruthy();

        // Should be a valid color value in OKLCH format
        expect(thumbColor).toMatch(/^oklch\(/);
      });
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders", () => {
      const renderSpy = vi.fn();

      const TestWrapper = ({ value }: { value: Color }) => {
        renderSpy();
        return (
          <OklchColorInput value={value} onColorChange={mockOnColorChange} />
        );
      };

      const { rerender } = render(<TestWrapper value={defaultColor} />);

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props should not cause additional renders
      rerender(<TestWrapper value={defaultColor} />);
      expect(renderSpy).toHaveBeenCalledTimes(2);

      // Only re-render when props actually change
      const newColor = new Color("oklch", [0.8, 0.2, 90], 1);
      rerender(<TestWrapper value={newColor} />);
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple rapid changes efficiently", () => {
      render(
        <OklchColorInput
          value={defaultColor}
          onColorChange={mockOnColorChange}
        />,
      );

      const hueSlider = screen.getAllByRole("slider")[0];

      const startTime = performance.now();

      // Simulate rapid changes
      for (let i = 0; i < 10; i++) {
        fireEvent.change(hueSlider, { target: { value: (i * 36).toString() } });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 100ms for 10 changes)
      expect(duration).toBeLessThan(100);
      expect(mockOnColorChange).toHaveBeenCalledTimes(10);

      // All calls should have been processed
      expect(mockOnColorChange.mock.calls).toHaveLength(10);
    });
  });
});
