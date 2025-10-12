import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import s from "./Calendar.module.css";
import type { CalendarDay, CalendarProps } from "./types";

const Calendar = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  className,
  ...props
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const containerClass = useMemo(() => {
    return className ? `${s.calendar} ${className}` : s.calendar;
  }, [className]);

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some((disabledDate) => isSameDay(date, disabledDate));
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some((highlightedDate) =>
      isSameDay(date, highlightedDate),
    );
  };

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    const days: CalendarDay[] = [];

    // Add previous month days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isDisabled: isDateDisabled(date),
        isHighlighted: isDateHighlighted(date),
      });
    }

    // Add current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isDisabled: isDateDisabled(date),
        isHighlighted: isDateHighlighted(date),
      });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isDisabled: isDateDisabled(date),
        isHighlighted: isDateHighlighted(date),
      });
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isDisabled && onDateSelect) {
      onDateSelect(day.date);
    }
  };

  const days = getDaysInMonth();

  return (
    <div {...props} className={containerClass}>
      <div className={s.header}>
        <Button
          variant="ghost"
          onClick={handlePreviousMonth}
          className={s.navButton}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Button>
        <h2 className={s.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button
          variant="ghost"
          onClick={handleNextMonth}
          className={s.navButton}
          aria-label="Next month"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      </div>

      <table className={s.table}>
        <thead>
          <tr>
            {dayNames.map((day) => (
              <th key={day} scope="col" className={s.weekday}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={s.days}>
          {Array.from(
            { length: Math.ceil(days.length / 7) },
            (_, weekIndex) => {
              const weekDays = days.slice(weekIndex * 7, weekIndex * 7 + 7);
              const weekKey =
                weekDays[0]?.date.toISOString() || `week-${weekIndex}`;
              return (
                <tr key={weekKey}>
                  {weekDays.map((day) => (
                    <td key={day.date.toISOString()}>
                      <button
                        type="button"
                        className={`${s.day} ${!day.isCurrentMonth ? s.dayOtherMonth : ""} ${day.isToday ? s.dayToday : ""} ${day.isSelected ? s.daySelected : ""} ${day.isDisabled ? s.dayDisabled : ""} ${day.isHighlighted ? s.dayHighlighted : ""}`}
                        onClick={() => handleDateClick(day)}
                        disabled={day.isDisabled}
                        aria-label={day.date.toLocaleDateString()}
                        aria-current={day.isToday ? "date" : undefined}
                      >
                        {day.date.getDate()}
                      </button>
                    </td>
                  ))}
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
