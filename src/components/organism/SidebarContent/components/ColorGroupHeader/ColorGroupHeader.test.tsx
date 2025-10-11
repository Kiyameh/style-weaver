import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorGroupHeader } from "./ColorGroupHeader";
import type { ColorGroupHeaderProps } from "./types";

describe("ColorGroupHeader", () => {
  const defaultProps: ColorGroupHeaderProps = {
    groupName: "primary",
    currentCount: 5,
    onVariantAdd: vi.fn(),
    onVariantRemove: vi.fn(),
  };

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(<ColorGroupHeader {...defaultProps} />);

      expect(screen.getByText("primary")).toBeInTheDocument();
      expect(screen.getByText("5 Variants")).toBeInTheDocument();
    });

    it("renders non-editable group name as h4", () => {
      render(<ColorGroupHeader {...defaultProps} editable={false} />);

      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toHaveTextContent("primary");
    });

    it("renders editable group name as input", () => {
      render(<ColorGroupHeader {...defaultProps} editable={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("primary");
      expect(input).toHaveAttribute("maxLength", "14");
    });

    it("renders variant control buttons", () => {
      render(<ColorGroupHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent("-");
      expect(buttons[1]).toHaveTextContent("+");
    });

    it("renders pencil icon when editable", () => {
      const { container } = render(<ColorGroupHeader {...defaultProps} editable={true} />);

      // Lucide icons render as SVG - check for the SVG element
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('pencilIcon');
    });

    it("does not render content checkbox by default", () => {
      render(<ColorGroupHeader {...defaultProps} />);

      expect(screen.queryByLabelText("Content")).not.toBeInTheDocument();
    });

    it("renders content checkbox when showContentCheckbox is true", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Content")).toBeInTheDocument();
    });
  });

  describe("Variant Controls", () => {
    it("calls onVariantAdd when + button is clicked", () => {
      const onVariantAdd = vi.fn();
      render(<ColorGroupHeader {...defaultProps} onVariantAdd={onVariantAdd} />);

      const addButton = screen.getByRole("button", { name: "+" });
      fireEvent.click(addButton);

      expect(onVariantAdd).toHaveBeenCalledTimes(1);
    });

    it("calls onVariantRemove when - button is clicked", () => {
      const onVariantRemove = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={5}
          onVariantRemove={onVariantRemove}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      fireEvent.click(removeButton);

      expect(onVariantRemove).toHaveBeenCalledTimes(1);
    });

    it("disables - button when at minimum variants", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={1}
          minVariants={1}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      expect(removeButton).toBeDisabled();
    });

    it("disables + button when at maximum variants", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={10}
          maxVariants={10}
        />,
      );

      const addButton = screen.getByRole("button", { name: "+" });
      expect(addButton).toBeDisabled();
    });

    it("does not call onVariantRemove when - button is clicked at minimum", () => {
      const onVariantRemove = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={1}
          minVariants={1}
          onVariantRemove={onVariantRemove}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      fireEvent.click(removeButton);

      expect(onVariantRemove).not.toHaveBeenCalled();
    });

    it("displays correct variant count", () => {
      render(<ColorGroupHeader {...defaultProps} currentCount={7} />);

      expect(screen.getByText("7 Variants")).toBeInTheDocument();
    });

    it("works with custom min and max variants", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={3}
          minVariants={2}
          maxVariants={8}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      const addButton = screen.getByRole("button", { name: "+" });

      expect(removeButton).not.toBeDisabled();
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("Editable Name", () => {
    it("calls onEditStart when input is focused", () => {
      const onEditStart = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          onEditStart={onEditStart}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.focus(input);

      expect(onEditStart).toHaveBeenCalledTimes(1);
    });

    it("calls onTempNameChange when input value changes", () => {
      const onTempNameChange = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="primary"
          onTempNameChange={onTempNameChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "secondary" } });

      expect(onTempNameChange).toHaveBeenCalledWith("secondary");
    });

    it("displays tempName when editing", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="newName"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("newName");
    });

    it("displays groupName when not editing", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={false}
          tempName="newName"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("primary");
    });

    it("calls onNameChange with trimmed name on blur", () => {
      const onNameChange = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="  secondary  "
          onNameChange={onNameChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(onNameChange).toHaveBeenCalledWith("secondary");
    });

    it("does not call onNameChange if name is empty after trim", () => {
      const onNameChange = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="   "
          onNameChange={onNameChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(onNameChange).not.toHaveBeenCalled();
    });

    it("does not call onNameChange if name is unchanged", () => {
      const onNameChange = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="primary"
          onNameChange={onNameChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(onNameChange).not.toHaveBeenCalled();
    });

    it("blurs input when Enter key is pressed", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="secondary"
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      input.focus();

      expect(document.activeElement).toBe(input);

      fireEvent.keyDown(input, { key: "Enter" });

      expect(document.activeElement).not.toBe(input);
    });

    it("does not blur input when other keys are pressed", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
          isEditing={true}
          tempName="secondary"
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      input.focus();

      fireEvent.keyDown(input, { key: "a" });

      expect(document.activeElement).toBe(input);
    });

    it("respects maxLength of 14 characters", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          editable={true}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "14");
    });

    it("has correct id for input", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          groupName="testGroup"
          editable={true}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "colorName-testGroup");
    });
  });

  describe("Content Checkbox", () => {
    it("renders checked when hasContent is true", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={true}
          onContentToggle={vi.fn()}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("renders unchecked when hasContent is false", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={vi.fn()}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("calls onContentToggle with true when checked", () => {
      const onContentToggle = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={onContentToggle}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(onContentToggle).toHaveBeenCalledWith(true);
    });

    it("calls onContentToggle with false when unchecked", () => {
      const onContentToggle = vi.fn();
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={true}
          onContentToggle={onContentToggle}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(onContentToggle).toHaveBeenCalledWith(false);
    });

    it("has correct id for checkbox", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          groupName="testGroup"
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={vi.fn()}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "content-testGroup");
    });

    it("label is associated with checkbox", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={vi.fn()}
        />,
      );

      const checkbox = screen.getByLabelText("Content");
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button types", () => {
      render(<ColorGroupHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("has accessible input with correct id", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          groupName="primary"
          editable={true}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "colorName-primary");
      
      // Label with for attribute exists
      const { container } = render(
        <ColorGroupHeader
          {...defaultProps}
          groupName="primary"
          editable={true}
        />,
      );
      const label = container.querySelector('label[for="colorName-primary"]');
      expect(label).toBeInTheDocument();
    });

    it("has accessible label for content checkbox", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          showContentCheckbox={true}
          hasContent={false}
          onContentToggle={vi.fn()}
        />,
      );

      const checkbox = screen.getByLabelText("Content");
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles currentCount of 0", () => {
      render(<ColorGroupHeader {...defaultProps} currentCount={0} />);

      expect(screen.getByText("0 Variants")).toBeInTheDocument();
      const removeButton = screen.getByRole("button", { name: "-" });
      expect(removeButton).toBeDisabled();
    });

    it("handles very large currentCount", () => {
      render(<ColorGroupHeader {...defaultProps} currentCount={999} />);

      expect(screen.getByText("999 Variants")).toBeInTheDocument();
    });

    it("handles empty groupName", () => {
      render(<ColorGroupHeader {...defaultProps} groupName="" />);

      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toHaveTextContent("");
    });

    it("handles long groupName", () => {
      const longName = "verylonggroupname";
      render(<ColorGroupHeader {...defaultProps} groupName={longName} />);

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it("works without optional callbacks", () => {
      render(
        <ColorGroupHeader
          groupName="test"
          currentCount={5}
          onVariantAdd={vi.fn()}
          onVariantRemove={vi.fn()}
        />,
      );

      expect(screen.getByText("test")).toBeInTheDocument();
    });

    it("handles minVariants equal to maxVariants", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={5}
          minVariants={5}
          maxVariants={5}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      const addButton = screen.getByRole("button", { name: "+" });

      expect(removeButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });

    it("handles currentCount at exact minimum", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={3}
          minVariants={3}
        />,
      );

      const removeButton = screen.getByRole("button", { name: "-" });
      expect(removeButton).toBeDisabled();
    });

    it("handles currentCount at exact maximum", () => {
      render(
        <ColorGroupHeader
          {...defaultProps}
          currentCount={8}
          maxVariants={8}
        />,
      );

      const addButton = screen.getByRole("button", { name: "+" });
      expect(addButton).toBeDisabled();
    });
  });
});
