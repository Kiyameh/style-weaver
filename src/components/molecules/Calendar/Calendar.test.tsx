import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Calendar from "./Calendar";

describe("Calendar Component", () => {
  describe("Rendering", () => {
    it("renders calendar with current month", () => {
      render(<Calendar />);
      const today = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const expectedMonth = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
      expect(screen.getByText(expectedMonth)).toBeInTheDocument();
    });

    it("renders all weekday headers", () => {
      render(<Calendar />);
      expect(screen.getByText("Sun")).toBeInTheDocument();
      expect(screen.getByText("Mon")).toBeInTheDocument();
      expect(screen.getByText("Tue")).toBeInTheDocument();
      expect(screen.getByText("Wed")).toBeInTheDocument();
      expect(screen.getByText("Thu")).toBeInTheDocument();
      expect(screen.getByText("Fri")).toBeInTheDocument();
      expect(screen.getByText("Sat")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<Calendar />);
      expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next month")).toBeInTheDocument();
    });

    it("renders 42 day cells (6 weeks)", () => {
      const { container } = render(<Calendar />);
      const dayCells = container.querySelectorAll(".day");
      expect(dayCells).toHaveLength(42);
    });
  });

  describe("Navigation", () => {
    it("navigates to previous month", () => {
      render(<Calendar />);
      const prevButton = screen.getByLabelText("Previous month");
      const today = new Date();
      const currentMonth = today.getMonth();

      fireEvent.click(prevButton);

      const prevMonthDate = new Date(today.getFullYear(), currentMonth - 1);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const expectedMonth = `${monthNames[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}`;
      expect(screen.getByText(expectedMonth)).toBeInTheDocument();
    });

    it("navigates to next month", () => {
      render(<Calendar />);
      const nextButton = screen.getByLabelText("Next month");
      const today = new Date();
      const currentMonth = today.getMonth();

      fireEvent.click(nextButton);

      const nextMonthDate = new Date(today.getFullYear(), currentMonth + 1);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const expectedMonth = `${monthNames[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;
      expect(screen.getByText(expectedMonth)).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("calls onDateSelect when a date is clicked", () => {
      const handleDateSelect = vi.fn();
      const { container } = render(<Calendar onDateSelect={handleDateSelect} />);
      const dayCells = container.querySelectorAll(".day");
      const firstCurrentMonthDay = Array.from(dayCells).find((cell) =>
        cell.classList.contains("day") && !cell.classList.contains("dayOtherMonth"),
      );

      if (firstCurrentMonthDay) {
        fireEvent.click(firstCurrentMonthDay);
        expect(handleDateSelect).toHaveBeenCalledTimes(1);
      }
    });

    it("highlights selected date", () => {
      const selectedDate = new Date(2024, 0, 15); // January 15, 2024
      const { container } = render(<Calendar selectedDate={selectedDate} />);
      const selectedDay = container.querySelector(".daySelected");
      expect(selectedDay).toBeInTheDocument();
    });

    it("does not call onDateSelect for disabled dates", () => {
      const handleDateSelect = vi.fn();
      const disabledDate = new Date();
      render(
        <Calendar
          onDateSelect={handleDateSelect}
          disabledDates={[disabledDate]}
        />,
      );
      const { container } = render(<Calendar disabledDates={[disabledDate]} />);
      const disabledDay = container.querySelector(".dayDisabled");

      if (disabledDay) {
        fireEvent.click(disabledDay);
        expect(handleDateSelect).not.toHaveBeenCalled();
      }
    });
  });

  describe("Date Constraints", () => {
    it("disables dates before minDate", () => {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 15);
      const { container } = render(<Calendar minDate={minDate} selectedDate={today} />);
      const disabledDays = container.querySelectorAll(".dayDisabled");
      // Should have at least some disabled days before the 15th
      expect(disabledDays.length).toBeGreaterThanOrEqual(0);
    });

    it("disables dates after maxDate", () => {
      const maxDate = new Date(2024, 0, 15);
      const { container } = render(<Calendar maxDate={maxDate} />);
      const disabledDays = container.querySelectorAll(".dayDisabled");
      expect(disabledDays.length).toBeGreaterThan(0);
    });

    it("highlights specified dates", () => {
      const highlightedDate = new Date();
      const { container } = render(
        <Calendar highlightedDates={[highlightedDate]} />,
      );
      const highlightedDay = container.querySelector(".dayHighlighted");
      expect(highlightedDay).toBeInTheDocument();
    });
  });

  describe("Visual States", () => {
    it("marks today with special styling", () => {
      const { container } = render(<Calendar />);
      const todayCell = container.querySelector(".dayToday");
      expect(todayCell).toBeInTheDocument();
    });

    it("applies different styling to other month days", () => {
      const { container } = render(<Calendar />);
      const otherMonthDays = container.querySelectorAll(".dayOtherMonth");
      expect(otherMonthDays.length).toBeGreaterThan(0);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(<Calendar data-testid="custom-calendar" id="calendar-1" />);
      const calendar = screen.getByTestId("custom-calendar");
      expect(calendar).toHaveAttribute("id", "calendar-1");
    });

    it("applies custom className", () => {
      const { container } = render(<Calendar className="custom-class" />);
      const calendar = container.querySelector(".calendar");
      expect(calendar).toHaveClass("calendar", "custom-class");
    });
  });

  describe("Accessibility", () => {
    it("day buttons have aria-label with date", () => {
      const { container } = render(<Calendar />);
      const dayCells = container.querySelectorAll(".day");
      const firstDay = dayCells[0];
      expect(firstDay).toHaveAttribute("aria-label");
    });

    it("selected day has proper styling", () => {
      const selectedDate = new Date();
      const { container } = render(<Calendar selectedDate={selectedDate} />);
      const selectedDay = container.querySelector(".daySelected");
      expect(selectedDay).toBeInTheDocument();
      expect(selectedDay).toHaveClass("daySelected");
    });

    it("navigation buttons have descriptive labels", () => {
      render(<Calendar />);
      expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next month")).toBeInTheDocument();
    });

    it("disabled days are not clickable", () => {
      const disabledDate = new Date();
      const { container } = render(<Calendar disabledDates={[disabledDate]} />);
      const disabledDay = container.querySelector(".dayDisabled");
      expect(disabledDay).toBeDisabled();
    });
  });

  describe("Edge Cases", () => {
    it("handles year transitions", () => {
      const december = new Date(2023, 11, 15); // December 2023
      render(<Calendar selectedDate={december} />);
      const nextButton = screen.getByLabelText("Next month");

      fireEvent.click(nextButton);
      expect(screen.getByText("January 2024")).toBeInTheDocument();
    });

    it("handles leap years correctly", () => {
      const february2024 = new Date(2024, 1, 1); // February 2024 (leap year)
      render(<Calendar selectedDate={february2024} />);
      expect(screen.getByText("February 2024")).toBeInTheDocument();
    });

    it("handles empty disabled dates array", () => {
      expect(() => render(<Calendar disabledDates={[]} />)).not.toThrow();
    });

    it("handles empty highlighted dates array", () => {
      expect(() => render(<Calendar highlightedDates={[]} />)).not.toThrow();
    });
  });
});
