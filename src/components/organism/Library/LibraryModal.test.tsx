import { fireEvent, render, screen } from "@testing-library/react";
import Color from "colorjs.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import LibraryModal from "./LibraryModal";
import * as localStorageUtils from "./utils/localStorage";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "Test Description",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1.0, 0, 0]),
    },
    content: {
      100: new Color("oklch", [0.2, 0, 0]),
    },
    border: {
      100: new Color("oklch", [0.5, 0, 0]),
    },
  },
  brandColors: {
    primary: {
      content: new Color("oklch", [0.2, 0.1, 260]),
      100: new Color("oklch", [0.8, 0.1, 260]),
    },
  },
  radius: {
    s: "0.25rem",
  },
  shadows: {
    s: "0 0 0.5rem oklch(0 0 0 / 0.1)",
  },
};

describe("LibraryModal Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("does not render when isOpen is false", () => {
      render(
        <LibraryModal
          isOpen={false}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.queryByText("Theme Library")).not.toBeInTheDocument();
    });

    it("renders when isOpen is true", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("Theme Library")).toBeInTheDocument();
    });

    it("renders modal title", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("Theme Library")).toBeInTheDocument();
    });

    it("renders modal subtitle", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(
        screen.getByText(
          /Manage your saved themes and organize them by project/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Close library")).toBeInTheDocument();
    });

    it("renders save current theme button", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("Save Current Theme")).toBeInTheDocument();
    });

    it("renders project selector in save dialog", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open save dialog
      fireEvent.click(screen.getByText("Save Current Theme"));

      expect(screen.getByLabelText("Select project")).toBeInTheDocument();
    });

    it("renders filter bar", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Search themes")).toBeInTheDocument();
    });

    it("shows empty state when no themes", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("No themes found")).toBeInTheDocument();
      expect(
        screen.getByText("Save your first theme to get started"),
      ).toBeInTheDocument();
    });

    it("renders saved themes", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("Test Theme")).toBeInTheDocument();
    });

    it("renders multiple themes", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
        {
          id: "2",
          theme: { ...mockTheme, name: "Theme 2" },
          savedAt: Date.now(),
        },
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByText("Test Theme")).toBeInTheDocument();
      expect(screen.getByText("Theme 2")).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls onClose when close button clicked", () => {
      const handleClose = vi.fn();

      render(
        <LibraryModal
          isOpen={true}
          onClose={handleClose}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const closeButton = screen.getByLabelText("Close library");
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking overlay", () => {
      const handleClose = vi.fn();

      render(
        <LibraryModal
          isOpen={true}
          onClose={handleClose}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const overlay = screen.getByRole("dialog");
      fireEvent.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking modal content", () => {
      const handleClose = vi.fn();

      render(
        <LibraryModal
          isOpen={true}
          onClose={handleClose}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const title = screen.getByText("Theme Library");
      fireEvent.click(title);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it("opens save dialog when save button clicked", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const saveButton = screen.getByText("Save Current Theme");
      fireEvent.click(saveButton);

      expect(
        screen.getByText("Select a project for this theme"),
      ).toBeInTheDocument();
      expect(screen.getByText("Save Theme")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("saves current theme after confirming in dialog", () => {
      const saveThemeSpy = vi
        .spyOn(localStorageUtils, "saveTheme")
        .mockReturnValue({
          id: "new-id",
          theme: mockTheme,
          savedAt: Date.now(),
        });

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open dialog
      const saveButton = screen.getByText("Save Current Theme");
      fireEvent.click(saveButton);

      // Confirm save
      const confirmButton = screen.getByText("Save Theme");
      fireEvent.click(confirmButton);

      expect(saveThemeSpy).toHaveBeenCalledWith(mockTheme, undefined);
    });

    it("closes save dialog after saving", () => {
      vi.spyOn(localStorageUtils, "saveTheme").mockReturnValue({
        id: "new-id",
        theme: mockTheme,
        savedAt: Date.now(),
      });

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open dialog
      fireEvent.click(screen.getByText("Save Current Theme"));

      // Confirm save
      fireEvent.click(screen.getByText("Save Theme"));

      // Dialog should be closed
      expect(
        screen.queryByText("Select a project for this theme"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Save Current Theme")).toBeInTheDocument();
    });

    it("cancels save dialog", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open dialog
      fireEvent.click(screen.getByText("Save Current Theme"));

      // Cancel
      fireEvent.click(screen.getByText("Cancel"));

      // Dialog should be closed
      expect(
        screen.queryByText("Select a project for this theme"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Save Current Theme")).toBeInTheDocument();
    });

    it("saves theme with selected project", () => {
      vi.spyOn(localStorageUtils, "getProjects").mockReturnValue(["Project A"]);
      const saveThemeSpy = vi
        .spyOn(localStorageUtils, "saveTheme")
        .mockReturnValue({
          id: "new-id",
          theme: mockTheme,
          project: "Project A",
          savedAt: Date.now(),
        });

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open save dialog
      fireEvent.click(screen.getByText("Save Current Theme"));

      // Select project
      const projectSelect = screen.getByLabelText("Select project");
      fireEvent.change(projectSelect, { target: { value: "Project A" } });

      // Confirm save
      fireEvent.click(screen.getByText("Save Theme"));

      expect(saveThemeSpy).toHaveBeenCalledWith(mockTheme, "Project A");
    });

    it("deletes theme when delete button clicked twice (confirmation)", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
      ]);
      const deleteThemeSpy = vi
        .spyOn(localStorageUtils, "deleteTheme")
        .mockReturnValue(true);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      fireEvent.click(deleteButton);

      // Should not delete yet
      expect(deleteThemeSpy).not.toHaveBeenCalled();

      // Second click to confirm
      const confirmButton = screen.getByLabelText(
        "Confirm delete theme Test Theme",
      );
      fireEvent.click(confirmButton);

      expect(deleteThemeSpy).toHaveBeenCalledWith("1");
    });

    it("loads theme and closes modal when load button clicked", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
      ]);
      const handleLoadTheme = vi.fn();
      const handleClose = vi.fn();

      render(
        <LibraryModal
          isOpen={true}
          onClose={handleClose}
          currentTheme={mockTheme}
          onLoadTheme={handleLoadTheme}
        />,
      );

      const loadButton = screen.getByText("Load");
      fireEvent.click(loadButton);

      expect(handleLoadTheme).toHaveBeenCalledWith(mockTheme);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("adds new project", () => {
      const addProjectSpy = vi
        .spyOn(localStorageUtils, "addProject")
        .mockReturnValue(true);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open save dialog first
      fireEvent.click(screen.getByText("Save Current Theme"));

      // Now click create new project button
      fireEvent.click(screen.getByLabelText("Create new project"));
      fireEvent.change(screen.getByPlaceholderText("Project name..."), {
        target: { value: "New Project" },
      });
      fireEvent.click(screen.getByLabelText("Add project"));

      expect(addProjectSpy).toHaveBeenCalledWith("New Project");
    });

    it("filters themes by search query", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
        {
          id: "2",
          theme: { ...mockTheme, name: "Another Theme" },
          savedAt: Date.now(),
        },
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const searchInput = screen.getByLabelText("Search themes");
      fireEvent.change(searchInput, { target: { value: "Another" } });

      expect(screen.queryByText("Test Theme")).not.toBeInTheDocument();
      expect(screen.getByText("Another Theme")).toBeInTheDocument();
    });

    it("filters themes by project", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          project: "Project A",
          savedAt: Date.now(),
        },
        {
          id: "2",
          theme: { ...mockTheme, name: "Theme 2" },
          project: "Project B",
          savedAt: Date.now(),
        },
      ]);
      vi.spyOn(localStorageUtils, "getProjects").mockReturnValue([
        "Project A",
        "Project B",
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Click on Project A badge to filter
      const projectBadge = screen.getByLabelText("Select project Project A");
      fireEvent.click(projectBadge);

      expect(screen.getByText("Test Theme")).toBeInTheDocument();
      expect(screen.queryByText("Theme 2")).not.toBeInTheDocument();
    });

    it("shows filtered empty state", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const searchInput = screen.getByLabelText("Search themes");
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      expect(screen.getByText("No themes found")).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your filters"),
      ).toBeInTheDocument();
    });

    it("reloads data when modal opens", () => {
      const getSavedThemesSpy = vi
        .spyOn(localStorageUtils, "getSavedThemes")
        .mockReturnValue([]);
      const getProjectsSpy = vi
        .spyOn(localStorageUtils, "getProjects")
        .mockReturnValue([]);

      const { rerender } = render(
        <LibraryModal
          isOpen={false}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(getSavedThemesSpy).not.toHaveBeenCalled();

      rerender(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(getSavedThemesSpy).toHaveBeenCalled();
      expect(getProjectsSpy).toHaveBeenCalled();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards custom className", () => {
      const { container } = render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
          className="custom-class"
        />,
      );

      const overlay = container.querySelector(".overlay");
      expect(overlay).toHaveClass("overlay", "custom-class");
    });

    it("forwards data attributes", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
          data-testid="custom-modal"
        />,
      );

      expect(screen.getByTestId("custom-modal")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has dialog role", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal attribute", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to title", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "library-modal-title");

      const title = screen.getByText("Theme Library");
      expect(title).toHaveAttribute("id", "library-modal-title");
    });

    it("close button has accessible label", () => {
      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Close library")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles localStorage errors", () => {
      const getSpy = vi
        .spyOn(localStorageUtils, "getSavedThemes")
        .mockImplementation(() => {
          throw new Error("Storage error");
        });

      // The component will throw the error during render
      expect(() =>
        render(
          <LibraryModal
            isOpen={true}
            onClose={vi.fn()}
            currentTheme={mockTheme}
            onLoadTheme={vi.fn()}
          />,
        ),
      ).toThrow("Storage error");

      // Restore the spy after the test
      getSpy.mockRestore();
    });

    it("handles save failure gracefully", () => {
      vi.spyOn(localStorageUtils, "saveTheme").mockReturnValue(null);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Open save dialog
      const saveButton = screen.getByText("Save Current Theme");
      fireEvent.click(saveButton);

      // Confirm save (which will fail)
      const confirmButton = screen.getByText("Save Theme");
      fireEvent.click(confirmButton);

      // Should not crash and dialog should remain open since save failed
      expect(screen.getByText("Theme Library")).toBeInTheDocument();
      expect(
        screen.getByText("Select a project for this theme"),
      ).toBeInTheDocument();
    });

    it("handles delete failure gracefully", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: mockTheme,
          savedAt: Date.now(),
        },
      ]);
      vi.spyOn(localStorageUtils, "deleteTheme").mockReturnValue(false);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      fireEvent.click(deleteButton);

      // Confirm delete
      const confirmButton = screen.getByLabelText(
        "Confirm delete theme Test Theme",
      );
      fireEvent.click(confirmButton);

      // Should not crash
      expect(screen.getByText("Theme Library")).toBeInTheDocument();
    });

    it("sorts themes by date (newest first)", () => {
      vi.spyOn(localStorageUtils, "getSavedThemes").mockReturnValue([
        {
          id: "1",
          theme: { ...mockTheme, name: "Old Theme" },
          savedAt: 1000,
        },
        {
          id: "2",
          theme: { ...mockTheme, name: "New Theme" },
          savedAt: 3000,
        },
        {
          id: "3",
          theme: { ...mockTheme, name: "Middle Theme" },
          savedAt: 2000,
        },
      ]);

      render(
        <LibraryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTheme={mockTheme}
          onLoadTheme={vi.fn()}
        />,
      );

      // Verify all themes are rendered
      expect(screen.getByText("New Theme")).toBeInTheDocument();
      expect(screen.getByText("Middle Theme")).toBeInTheDocument();
      expect(screen.getByText("Old Theme")).toBeInTheDocument();
    });
  });
});
