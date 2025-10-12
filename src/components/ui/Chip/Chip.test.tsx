import { fireEvent, render, screen } from "@testing-library/react";
import { Tag } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import Chip from "./Chip";

describe("Chip Component", () => {
  describe("Rendering", () => {
    it("renders with label text", () => {
      render(<Chip label="React" />);
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Chip label="Test" />);
      const chip = container.querySelector(".chip");
      expect(chip?.tagName).toBe("DIV");
    });

    it("has status role by default", () => {
      render(<Chip label="Status" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(<Chip label="Tagged" icon={<Tag data-testid="tag-icon" />} />);
      expect(screen.getByTestId("tag-icon")).toBeInTheDocument();
      expect(screen.getByText("Tagged")).toBeInTheDocument();
    });

    it("renders without icon when not provided", () => {
      const { container } = render(<Chip label="No Icon" />);
      const icon = container.querySelector(".icon");
      expect(icon).not.toBeInTheDocument();
    });

    it("renders delete button when onDelete is provided", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Removable" onDelete={handleDelete} />);
      const deleteButton = screen.getByRole("button", {
        name: "Remove Removable",
      });
      expect(deleteButton).toBeInTheDocument();
    });

    it("does not render delete button when onDelete is not provided", () => {
      render(<Chip label="Not Removable" />);
      const deleteButton = screen.queryByRole("button");
      expect(deleteButton).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      const { container } = render(<Chip label="Primary" />);
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipPrimary");
    });

    it("applies primary variant when explicitly set", () => {
      const { container } = render(<Chip label="Primary" variant="primary" />);
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipPrimary");
    });

    it("applies secondary variant correctly", () => {
      const { container } = render(
        <Chip label="Secondary" variant="secondary" />,
      );
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipSecondary");
      expect(chip).not.toHaveClass("chipPrimary");
    });

    it("applies ghost variant correctly", () => {
      const { container } = render(<Chip label="Ghost" variant="ghost" />);
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipGhost");
      expect(chip).not.toHaveClass("chipPrimary");
    });
  });

  describe("States", () => {
    it("can be disabled", () => {
      const { container } = render(<Chip label="Disabled" disabled />);
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chipDisabled");
      expect(chip).toHaveAttribute("aria-disabled", "true");
    });

    it("disables delete button when chip is disabled", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Disabled" onDelete={handleDelete} disabled />);
      const deleteButton = screen.getByRole("button");
      expect(deleteButton).toBeDisabled();
    });

    it("can have both variant and disabled state", () => {
      const { container } = render(
        <Chip label="Disabled Secondary" variant="secondary" disabled />,
      );
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chipSecondary", "chipDisabled");
    });
  });

  describe("Functionality", () => {
    it("calls onDelete when delete button is clicked", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Removable" onDelete={handleDelete} />);
      const deleteButton = screen.getByRole("button");

      fireEvent.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    it("does not call onDelete when disabled", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Disabled" onDelete={handleDelete} disabled />);
      const deleteButton = screen.getByRole("button");

      fireEvent.click(deleteButton);
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("stops event propagation when delete button is clicked", () => {
      const handleDelete = vi.fn();
      const handleChipClick = vi.fn();
      render(
        <Chip label="Test" onDelete={handleDelete} onClick={handleChipClick} />,
      );
      const deleteButton = screen.getByRole("button");

      fireEvent.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleChipClick).not.toHaveBeenCalled();
    });

    it("chip itself can be clicked when onClick is provided", () => {
      const handleClick = vi.fn();
      render(<Chip label="Clickable" onClick={handleClick} />);
      const chip = screen.getByRole("status");

      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <Chip label="Test" data-testid="custom-chip" title="Chip tooltip" />,
      );
      const chip = screen.getByTestId("custom-chip");

      expect(chip).toHaveAttribute("title", "Chip tooltip");
    });

    it("applies custom className", () => {
      const { container } = render(
        <Chip label="Custom" className="custom-class" />,
      );
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipPrimary", "custom-class");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(
        <Chip label="Custom" className="class-one class-two" />,
      );
      const chip = container.querySelector(".chip");
      expect(chip).toHaveClass("chip", "chipPrimary", "class-one", "class-two");
    });
  });

  describe("Accessibility", () => {
    it("has proper status role", () => {
      render(<Chip label="Accessible" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("delete button has descriptive aria-label", () => {
      const handleDelete = vi.fn();
      render(<Chip label="React Tag" onDelete={handleDelete} />);
      const deleteButton = screen.getByRole("button", {
        name: "Remove React Tag",
      });
      expect(deleteButton).toBeInTheDocument();
    });

    it("sets aria-disabled when disabled", () => {
      render(<Chip label="Disabled" disabled />);
      const chip = screen.getByRole("status");
      expect(chip).toHaveAttribute("aria-disabled", "true");
    });

    it("icon is hidden from screen readers", () => {
      const { container } = render(<Chip label="Test" icon={<Tag />} />);
      const icon = container.querySelector(".icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("delete button icon is hidden from screen readers", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Test" onDelete={handleDelete} />);
      const deleteButton = screen.getByRole("button");
      const svg = deleteButton.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("delete button is keyboard accessible", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Test" onDelete={handleDelete} />);
      const deleteButton = screen.getByRole("button");

      deleteButton.focus();
      expect(document.activeElement).toBe(deleteButton);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty label gracefully", () => {
      render(<Chip label="" />);
      const chip = screen.getByRole("status");
      expect(chip).toBeInTheDocument();
    });

    it("handles very long labels", () => {
      const longLabel = "This is a very long label that might wrap or overflow";
      render(<Chip label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("handles both icon and delete button together", () => {
      const handleDelete = vi.fn();
      render(
        <Chip
          label="Complete"
          icon={<Tag data-testid="icon" />}
          onDelete={handleDelete}
        />,
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });

    it("maintains structure with all props", () => {
      const handleDelete = vi.fn();
      const handleClick = vi.fn();
      render(
        <Chip
          label="Full Featured"
          variant="secondary"
          icon={<Tag />}
          onDelete={handleDelete}
          onClick={handleClick}
          disabled={false}
          className="custom"
        />,
      );

      const chip = screen.getByRole("status");
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass("custom");
    });
  });
});
