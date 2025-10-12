import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FilterBar from "./FilterBar";

describe("FilterBar Component", () => {
  describe("Rendering", () => {
    it("renders search input", () => {
      render(<FilterBar searchQuery="" onSearchChange={vi.fn()} />);

      const searchInput = screen.getByPlaceholderText(/search themes by name/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("renders search icon", () => {
      const { container } = render(
        <FilterBar searchQuery="" onSearchChange={vi.fn()} />,
      );

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("displays current search query", () => {
      render(<FilterBar searchQuery="test query" onSearchChange={vi.fn()} />);

      const input = screen.getByDisplayValue("test query");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls onSearchChange when typing in search input", () => {
      const handleSearchChange = vi.fn();

      render(<FilterBar searchQuery="" onSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(/search themes by name/i);
      fireEvent.change(input, { target: { value: "new query" } });

      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith("new query");
    });

    it("handles multiple search changes", () => {
      const handleSearchChange = vi.fn();

      render(<FilterBar searchQuery="" onSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(/search themes by name/i);

      fireEvent.change(input, { target: { value: "first" } });
      fireEvent.change(input, { target: { value: "second" } });
      fireEvent.change(input, { target: { value: "third" } });

      expect(handleSearchChange).toHaveBeenCalledTimes(3);
    });

    it("updates input value when searchQuery prop changes", () => {
      const { rerender } = render(
        <FilterBar searchQuery="initial" onSearchChange={vi.fn()} />,
      );

      expect(screen.getByDisplayValue("initial")).toBeInTheDocument();

      rerender(<FilterBar searchQuery="updated" onSearchChange={vi.fn()} />);

      expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("forwards data attributes", () => {
      render(
        <FilterBar
          searchQuery=""
          onSearchChange={vi.fn()}
          data-testid="custom-filter"
        />,
      );

      expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("search input has accessible label", () => {
      render(<FilterBar searchQuery="" onSearchChange={vi.fn()} />);

      expect(screen.getByLabelText("Search themes")).toBeInTheDocument();
    });

    it("search icon is hidden from screen readers", () => {
      const { container } = render(
        <FilterBar searchQuery="" onSearchChange={vi.fn()} />,
      );

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("input has correct type attribute", () => {
      render(<FilterBar searchQuery="" onSearchChange={vi.fn()} />);

      const input = screen.getByLabelText("Search themes");
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty search query", () => {
      render(<FilterBar searchQuery="" onSearchChange={vi.fn()} />);

      const input = screen.getByPlaceholderText(
        /search themes by name/i,
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("handles very long search query", () => {
      const longQuery = "A".repeat(200);

      render(<FilterBar searchQuery={longQuery} onSearchChange={vi.fn()} />);

      const input = screen.getByDisplayValue(longQuery);
      expect(input).toBeInTheDocument();
    });

    it("handles special characters in search query", () => {
      const specialQuery = "Test & <Query> with 'quotes'";

      render(<FilterBar searchQuery={specialQuery} onSearchChange={vi.fn()} />);

      const input = screen.getByDisplayValue(specialQuery);
      expect(input).toBeInTheDocument();
    });

    it("handles rapid input changes", () => {
      const handleSearchChange = vi.fn();

      render(<FilterBar searchQuery="" onSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(/search themes by name/i);

      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `query${i}` } });
      }

      expect(handleSearchChange).toHaveBeenCalledTimes(10);
    });
  });
});
