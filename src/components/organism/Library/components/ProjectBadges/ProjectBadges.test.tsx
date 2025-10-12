import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectBadges from "./ProjectBadges";

/**
 * Note: There is a known HTML validation warning about nested buttons.
 * The delete button is nested inside the badge button for UX reasons.
 * This should be refactored in the future to use a different approach.
 */
describe("ProjectBadges", () => {
  describe("Rendering", () => {
    it("renders nothing when no projects provided", () => {
      const { container } = render(
        <ProjectBadges
          projects={[]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("renders all project badges", () => {
      render(
        <ProjectBadges
          projects={["Project A", "Project B", "Project C"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      expect(screen.getByText("Project A")).toBeInTheDocument();
      expect(screen.getByText("Project B")).toBeInTheDocument();
      expect(screen.getByText("Project C")).toBeInTheDocument();
    });

    it("shows selected state for selected projects", () => {
      render(
        <ProjectBadges
          projects={["Project A", "Project B"]}
          selectedProjects={["Project A"]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      const projectA = screen.getByLabelText("Deselect project Project A");
      const projectB = screen.getByLabelText("Select project Project B");

      expect(projectA).toHaveAttribute("aria-pressed", "true");
      expect(projectB).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Functionality", () => {
    it("calls onProjectToggle when badge clicked", () => {
      const handleToggle = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={handleToggle}
          onProjectDelete={vi.fn()}
        />,
      );

      const badge = screen.getByLabelText("Select project Project A");
      fireEvent.click(badge);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("Project A");
    });

    it("shows confirmation state on first delete click", () => {
      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");
      fireEvent.click(deleteButton);

      expect(
        screen.getByLabelText("Confirm delete project Project A"),
      ).toBeInTheDocument();
    });

    it("calls onProjectDelete when confirming delete", () => {
      const handleDelete = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={handleDelete}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");

      // First click - start confirmation
      fireEvent.click(deleteButton);

      // Second click - confirm delete
      const confirmButton = screen.getByLabelText(
        "Confirm delete project Project A",
      );
      fireEvent.click(confirmButton);

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith("Project A");
    });

    it("cancels delete confirmation after 2 seconds", async () => {
      vi.useFakeTimers();
      const handleDelete = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={handleDelete}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");
      fireEvent.click(deleteButton);

      // Should be in confirmation state
      expect(
        screen.getByLabelText("Confirm delete project Project A"),
      ).toBeInTheDocument();

      // Fast-forward 2 seconds with act
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      // Should be back to normal state
      expect(
        screen.getByLabelText("Delete project Project A"),
      ).toBeInTheDocument();
      expect(handleDelete).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it("does not toggle project when in confirmation mode", () => {
      const handleToggle = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={handleToggle}
          onProjectDelete={vi.fn()}
        />,
      );

      const badge = screen.getByLabelText("Select project Project A");
      const deleteButton = screen.getByLabelText("Delete project Project A");

      // Start confirmation
      fireEvent.click(deleteButton);

      // Try to toggle - should not work
      fireEvent.click(badge);

      expect(handleToggle).not.toHaveBeenCalled();
    });

    it("stops event propagation on delete button click", () => {
      const handleToggle = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={handleToggle}
          onProjectDelete={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");
      fireEvent.click(deleteButton);

      // Should not trigger badge toggle
      expect(handleToggle).not.toHaveBeenCalled();
    });
  });

  describe("Multiple Projects", () => {
    it("handles multiple selected projects", () => {
      render(
        <ProjectBadges
          projects={["Project A", "Project B", "Project C"]}
          selectedProjects={["Project A", "Project C"]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      expect(
        screen.getByLabelText("Deselect project Project A"),
      ).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByLabelText("Select project Project B")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      expect(
        screen.getByLabelText("Deselect project Project C"),
      ).toHaveAttribute("aria-pressed", "true");
    });

    it("can have different projects in confirmation state", () => {
      vi.useFakeTimers();

      render(
        <ProjectBadges
          projects={["Project A", "Project B"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      // Start confirmation for Project A
      const deleteA = screen.getByLabelText("Delete project Project A");
      fireEvent.click(deleteA);

      expect(
        screen.getByLabelText("Confirm delete project Project A"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Delete project Project B"),
      ).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-pressed state for selected badges", () => {
      render(
        <ProjectBadges
          projects={["Project A", "Project B"]}
          selectedProjects={["Project A"]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      const selectedBadge = screen.getByLabelText("Deselect project Project A");
      const unselectedBadge = screen.getByLabelText("Select project Project B");

      expect(selectedBadge).toHaveAttribute("aria-pressed", "true");
      expect(unselectedBadge).toHaveAttribute("aria-pressed", "false");
    });

    it("updates aria-label when entering confirmation mode", () => {
      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");
      fireEvent.click(deleteButton);

      expect(
        screen.getByLabelText("Confirm delete project Project A"),
      ).toBeInTheDocument();
    });

    it("has appropriate button types", () => {
      const { container } = render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      const buttons = container.querySelectorAll('button[type="button"]');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles projects with special characters", () => {
      render(
        <ProjectBadges
          projects={["Project & Co.", "Project <Test>"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      expect(screen.getByText("Project & Co.")).toBeInTheDocument();
      expect(screen.getByText("Project <Test>")).toBeInTheDocument();
    });

    it("handles very long project names", () => {
      const longName = "A".repeat(100);

      render(
        <ProjectBadges
          projects={[longName]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={vi.fn()}
        />,
      );

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it("handles rapid toggle clicks", () => {
      const handleToggle = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={handleToggle}
          onProjectDelete={vi.fn()}
        />,
      );

      const badge = screen.getByLabelText("Select project Project A");

      // Rapid clicks
      fireEvent.click(badge);
      fireEvent.click(badge);
      fireEvent.click(badge);

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it("clears confirmation state when project is deleted", () => {
      const handleDelete = vi.fn();

      render(
        <ProjectBadges
          projects={["Project A"]}
          selectedProjects={[]}
          onProjectToggle={vi.fn()}
          onProjectDelete={handleDelete}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete project Project A");

      // Start confirmation
      fireEvent.click(deleteButton);
      expect(
        screen.getByLabelText("Confirm delete project Project A"),
      ).toBeInTheDocument();

      // Confirm delete
      const confirmButton = screen.getByLabelText(
        "Confirm delete project Project A",
      );
      fireEvent.click(confirmButton);

      expect(handleDelete).toHaveBeenCalledWith("Project A");
    });
  });
});
