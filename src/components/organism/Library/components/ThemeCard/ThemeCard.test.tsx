import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Color from "colorjs.io";
import { describe, expect, it, vi } from "vitest";
import type { Theme } from "@/types/Theme";
import type { SavedTheme } from "../../types";
import ThemeCard from "./ThemeCard";

const mockTheme: Theme = {
  name: "Test Theme",
  description: "A beautiful test theme",
  colorMode: "light",
  mainColors: {
    surface: {
      100: new Color("oklch", [1, 0, 0]),
      200: new Color("oklch", [0.9, 0, 0]),
    },
    content: {
      100: new Color("oklch", [0, 0, 0]),
    },
    border: {
      100: new Color("oklch", [0.5, 0, 0]),
    },
  },
  brandColors: {
    primary: {
      100: new Color("oklch", [0.5, 0.1, 260]),
      200: new Color("oklch", [0.6, 0.1, 260]),
    },
  },
  radius: {
    s: "0.25rem",
    m: "0.5rem",
  },
  shadows: {
    s: "0 0 0.5rem black",
  },
};

const mockSavedTheme: SavedTheme = {
  id: "test-id",
  theme: mockTheme,
  project: "Test Project",
  savedAt: Date.now(),
};

describe("ThemeCard Component", () => {
  describe("Rendering", () => {
    it("renders theme name", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("Test Theme")).toBeInTheDocument();
    });

    it("renders theme description", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("A beautiful test theme")).toBeInTheDocument();
    });

    it("renders project name", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("does not render project section when no project", () => {
      const themeWithoutProject = { ...mockSavedTheme, project: undefined };

      const { container } = render(
        <ThemeCard
          savedTheme={themeWithoutProject}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(container.querySelector(".project")).not.toBeInTheDocument();
    });

    it("renders light mode icon", () => {
      const { container } = render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const colorMode = container.querySelector(".colorMode");
      expect(colorMode).toBeInTheDocument();
      // Verify it contains the Sun icon (lucide-sun class)
      const sunIcon = container.querySelector(".lucide-sun");
      expect(sunIcon).toBeInTheDocument();
    });

    it("renders dark mode icon", () => {
      const darkTheme = {
        ...mockSavedTheme,
        theme: { ...mockTheme, colorMode: "dark" as const },
      };

      const { container } = render(
        <ThemeCard
          savedTheme={darkTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const colorMode = container.querySelector(".colorMode");
      expect(colorMode).toBeInTheDocument();
      // Verify it contains the Moon icon (lucide-moon class)
      const moonIcon = container.querySelector(".lucide-moon");
      expect(moonIcon).toBeInTheDocument();
    });

    it("does not render color mode icon when undefined", () => {
      const themeWithoutMode = {
        ...mockSavedTheme,
        theme: { ...mockTheme, colorMode: undefined },
      };

      const { container } = render(
        <ThemeCard
          savedTheme={themeWithoutMode}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(container.querySelector(".colorMode")).not.toBeInTheDocument();
    });

    it("renders statistics correctly", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("Main colors")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument(); // 2 surface + 1 content + 1 border

      expect(screen.getByText("Brand colors")).toBeInTheDocument();
      expect(screen.getByText("Shadows")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();

      expect(screen.getByText("Radius")).toBeInTheDocument();
      // Both brand colors and radius have value "2"
      const twos = screen.getAllByText("2");
      expect(twos.length).toBe(2); // brand colors and radius
    });

    it("renders load button", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("Load")).toBeInTheDocument();
    });

    it("renders delete button", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("shows confirmation state on first delete click", () => {
      const handleDelete = vi.fn();

      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={handleDelete}
          onLoad={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      fireEvent.click(deleteButton);

      // Should not delete yet
      expect(handleDelete).not.toHaveBeenCalled();

      // Should show confirmation label
      expect(
        screen.getByLabelText("Confirm delete theme Test Theme"),
      ).toBeInTheDocument();
    });

    it("calls onDelete when confirming delete", () => {
      const handleDelete = vi.fn();

      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={handleDelete}
          onLoad={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");

      // First click - start confirmation
      fireEvent.click(deleteButton);

      // Second click - confirm delete
      const confirmButton = screen.getByLabelText(
        "Confirm delete theme Test Theme",
      );
      fireEvent.click(confirmButton);

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith("test-id");
    });

    it("cancels delete confirmation after 2 seconds", async () => {
      const handleDelete = vi.fn();

      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={handleDelete}
          onLoad={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      fireEvent.click(deleteButton);

      // Should be in confirmation state
      expect(
        screen.getByLabelText("Confirm delete theme Test Theme"),
      ).toBeInTheDocument();

      // Wait for 2 seconds timeout to complete
      await waitFor(
        () => {
          expect(
            screen.queryByLabelText("Confirm delete theme Test Theme"),
          ).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      expect(
        screen.getByLabelText("Delete theme Test Theme"),
      ).toBeInTheDocument();
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("calls onLoad with theme when load button clicked", () => {
      const handleLoad = vi.fn();

      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={handleLoad}
        />,
      );

      const loadButton = screen.getByText("Load");
      fireEvent.click(loadButton);

      expect(handleLoad).toHaveBeenCalledTimes(1);
      expect(handleLoad).toHaveBeenCalledWith(mockTheme);
    });

    it("stops event propagation on delete click", () => {
      const handleDelete = vi.fn();
      const handleCardClick = vi.fn();

      render(
        // biome-ignore lint/a11y/useKeyWithClickEvents: Test wrapper div for event propagation testing
        // biome-ignore lint/a11y/noStaticElementInteractions: <test>
        <div onClick={handleCardClick}>
          <ThemeCard
            savedTheme={mockSavedTheme}
            onDelete={handleDelete}
            onLoad={vi.fn()}
          />
        </div>,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      fireEvent.click(deleteButton);

      // Should not propagate to parent
      expect(handleCardClick).not.toHaveBeenCalled();

      // Should not delete on first click
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("stops event propagation on load click", () => {
      const handleLoad = vi.fn();
      const handleCardClick = vi.fn();

      render(
        // biome-ignore lint/a11y/useKeyWithClickEvents: Test wrapper div for event propagation testing
        // biome-ignore lint/a11y/noStaticElementInteractions: <test>
        <div onClick={handleCardClick}>
          <ThemeCard
            savedTheme={mockSavedTheme}
            onDelete={vi.fn()}
            onLoad={handleLoad}
          />
        </div>,
      );

      const loadButton = screen.getByText("Load");
      fireEvent.click(loadButton);

      expect(handleLoad).toHaveBeenCalled();
      expect(handleCardClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has accessible delete button label", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const deleteButton = screen.getByLabelText("Delete theme Test Theme");
      expect(deleteButton).toBeInTheDocument();
    });

    it("has accessible load button label", () => {
      render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const loadButton = screen.getByLabelText("Load theme Test Theme");
      expect(loadButton).toBeInTheDocument();
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <ThemeCard
          savedTheme={mockSavedTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty description", () => {
      const themeWithEmptyDesc = {
        ...mockSavedTheme,
        theme: { ...mockTheme, description: "" },
      };

      render(
        <ThemeCard
          savedTheme={themeWithEmptyDesc}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("Test Theme")).toBeInTheDocument();
    });

    it("handles theme with no colors", () => {
      const emptyTheme: SavedTheme = {
        id: "empty",
        theme: {
          name: "Empty",
          description: "Empty theme",
          colorMode: undefined,
          mainColors: {
            surface: {},
            content: {},
            border: {},
          },
          brandColors: {},
          radius: {},
          shadows: {},
        },
        savedAt: Date.now(),
      };

      render(
        <ThemeCard
          savedTheme={emptyTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      // All stats should be 0
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBe(4); // mainColors, brandColors, shadows, radius
    });

    it("handles very long theme names", () => {
      const longNameTheme = {
        ...mockSavedTheme,
        theme: {
          ...mockTheme,
          name: "A".repeat(100),
        },
      };

      render(
        <ThemeCard
          savedTheme={longNameTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
    });

    it("handles very long descriptions", () => {
      const longDescTheme = {
        ...mockSavedTheme,
        theme: {
          ...mockTheme,
          description: "B".repeat(200),
        },
      };

      render(
        <ThemeCard
          savedTheme={longDescTheme}
          onDelete={vi.fn()}
          onLoad={vi.fn()}
        />,
      );

      expect(screen.getByText("B".repeat(200))).toBeInTheDocument();
    });
  });
});
