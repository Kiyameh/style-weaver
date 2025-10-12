import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectSelector from "./ProjectSelector";

describe("ProjectSelector Component", () => {
  const mockProjects = ["Project A", "Project B", "Project C"];

  describe("Rendering", () => {
    it("renders title", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByText("Project")).toBeInTheDocument();
    });

    it("renders project select", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Select project")).toBeInTheDocument();
    });

    it("renders all project options", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByText("No Project")).toBeInTheDocument();
      expect(screen.getByText("Project A")).toBeInTheDocument();
      expect(screen.getByText("Project B")).toBeInTheDocument();
      expect(screen.getByText("Project C")).toBeInTheDocument();
    });

    it("renders new project button", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Create new project")).toBeInTheDocument();
    });

    it("displays selected project", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          selectedProject="Project B"
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const select = screen.getByLabelText(
        "Select project",
      ) as HTMLSelectElement;
      expect(select.value).toBe("Project B");
    });

    it("displays no project when selectedProject is undefined", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const select = screen.getByLabelText(
        "Select project",
      ) as HTMLSelectElement;
      expect(select.value).toBe("");
    });
  });

  describe("Add Project Form", () => {
    it("shows form when new button clicked", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      expect(
        screen.getByPlaceholderText("Project name..."),
      ).toBeInTheDocument();
    });

    it("hides select when form is shown", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      expect(screen.queryByLabelText("Select project")).not.toBeInTheDocument();
    });

    it("shows add and cancel buttons in form", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      expect(screen.getByLabelText("Add project")).toBeInTheDocument();
      expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls onProjectSelect when selecting a project", () => {
      const handleProjectSelect = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={handleProjectSelect}
          onAddProject={vi.fn()}
        />,
      );

      const select = screen.getByLabelText("Select project");
      fireEvent.change(select, { target: { value: "Project A" } });

      expect(handleProjectSelect).toHaveBeenCalledTimes(1);
      expect(handleProjectSelect).toHaveBeenCalledWith("Project A");
    });

    it("calls onAddProject when submitting form", () => {
      const handleAddProject = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={handleAddProject}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      const input = screen.getByPlaceholderText("Project name...");
      fireEvent.change(input, { target: { value: "New Project" } });

      const addButton = screen.getByLabelText("Add project");
      fireEvent.click(addButton);

      expect(handleAddProject).toHaveBeenCalledTimes(1);
      expect(handleAddProject).toHaveBeenCalledWith("New Project");
    });

    it("trims whitespace when adding project", () => {
      const handleAddProject = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={handleAddProject}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      const input = screen.getByPlaceholderText("Project name...");
      fireEvent.change(input, { target: { value: "  Trimmed Project  " } });

      const addButton = screen.getByLabelText("Add project");
      fireEvent.click(addButton);

      expect(handleAddProject).toHaveBeenCalledWith("Trimmed Project");
    });

    it("closes form after adding project", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      const input = screen.getByPlaceholderText("Project name...");
      fireEvent.change(input, { target: { value: "New Project" } });

      const addButton = screen.getByLabelText("Add project");
      fireEvent.click(addButton);

      expect(
        screen.queryByPlaceholderText("Project name..."),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Select project")).toBeInTheDocument();
    });

    it("clears input after adding project", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      // Open form and add project
      fireEvent.click(screen.getByLabelText("Create new project"));
      fireEvent.change(screen.getByPlaceholderText("Project name..."), {
        target: { value: "New Project" },
      });
      fireEvent.click(screen.getByLabelText("Add project"));

      // Open form again
      fireEvent.click(screen.getByLabelText("Create new project"));

      const input = screen.getByPlaceholderText(
        "Project name...",
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("closes form when cancel button clicked", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const newButton = screen.getByLabelText("Create new project");
      fireEvent.click(newButton);

      const cancelButton = screen.getByLabelText("Cancel");
      fireEvent.click(cancelButton);

      expect(
        screen.queryByPlaceholderText("Project name..."),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Select project")).toBeInTheDocument();
    });

    it("clears input when cancel button clicked", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));
      fireEvent.change(screen.getByPlaceholderText("Project name..."), {
        target: { value: "Some text" },
      });
      fireEvent.click(screen.getByLabelText("Cancel"));

      // Open form again
      fireEvent.click(screen.getByLabelText("Create new project"));
      const input = screen.getByPlaceholderText(
        "Project name...",
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("does not call onAddProject when submitting empty name", () => {
      const handleAddProject = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={handleAddProject}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));

      const addButton = screen.getByLabelText("Add project");
      fireEvent.click(addButton);

      expect(handleAddProject).not.toHaveBeenCalled();
    });

    it("does not call onAddProject when submitting whitespace only", () => {
      const handleAddProject = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={handleAddProject}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));
      fireEvent.change(screen.getByPlaceholderText("Project name..."), {
        target: { value: "   " },
      });

      const addButton = screen.getByLabelText("Add project");
      fireEvent.click(addButton);

      expect(handleAddProject).not.toHaveBeenCalled();
    });

    it("disables add button when input is empty", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));

      const addButton = screen.getByLabelText("Add project");
      expect(addButton).toBeDisabled();
    });

    it("enables add button when input has value", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));
      fireEvent.change(screen.getByPlaceholderText("Project name..."), {
        target: { value: "New Project" },
      });

      const addButton = screen.getByLabelText("Add project");
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards custom className", () => {
      const { container } = render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
          className="custom-class"
        />,
      );

      const selector = container.querySelector(".container");
      expect(selector).toHaveClass("container", "custom-class");
    });

    it("forwards data attributes", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
          data-testid="custom-selector"
        />,
      );

      expect(screen.getByTestId("custom-selector")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("select has accessible label", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Select project")).toBeInTheDocument();
    });

    it("new button has accessible label", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Create new project")).toBeInTheDocument();
    });

    it("input has accessible label", () => {
      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));

      expect(screen.getByLabelText("New project name")).toBeInTheDocument();
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty projects list", () => {
      render(
        <ProjectSelector
          projects={[]}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByText("No Project")).toBeInTheDocument();
    });

    it("handles very long project names", () => {
      const longProjects = ["A".repeat(100)];

      render(
        <ProjectSelector
          projects={longProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
    });

    it("handles projects with special characters", () => {
      const specialProjects = ["Project & Co.", "Project <Test>"];

      render(
        <ProjectSelector
          projects={specialProjects}
          onProjectSelect={vi.fn()}
          onAddProject={vi.fn()}
        />,
      );

      expect(screen.getByText("Project & Co.")).toBeInTheDocument();
      expect(screen.getByText("Project <Test>")).toBeInTheDocument();
    });

    it("handles form submission with Enter key", () => {
      const handleAddProject = vi.fn();

      render(
        <ProjectSelector
          projects={mockProjects}
          onProjectSelect={vi.fn()}
          onAddProject={handleAddProject}
        />,
      );

      fireEvent.click(screen.getByLabelText("Create new project"));
      const input = screen.getByPlaceholderText("Project name...");
      fireEvent.change(input, { target: { value: "New Project" } });
      fireEvent.submit(input.closest("form") as HTMLFormElement);

      expect(handleAddProject).toHaveBeenCalledWith("New Project");
    });
  });
});
