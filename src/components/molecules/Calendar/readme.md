# Calendar Component

A full-featured calendar component for date selection with support for constraints, highlighting, and navigation. UI-only component ready for integration with date logic.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date` | - | Currently selected date |
| `onDateSelect` | `(date: Date) => void` | - | Callback when a date is selected |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Array of specific dates to disable |
| `highlightedDates` | `Date[]` | `[]` | Array of dates to highlight |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Usage Examples

```tsx
// Basic calendar
<Calendar />

// With selected date
const [selectedDate, setSelectedDate] = useState(new Date());

<Calendar 
  selectedDate={selectedDate}
  onDateSelect={(date) => setSelectedDate(date)}
/>

// With date constraints
<Calendar 
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
  onDateSelect={handleDateSelect}
/>

// With disabled dates
const disabledDates = [
  new Date(2024, 0, 1),  // New Year
  new Date(2024, 11, 25), // Christmas
];

<Calendar 
  disabledDates={disabledDates}
  onDateSelect={handleDateSelect}
/>

// With highlighted dates
const eventDates = [
  new Date(2024, 0, 15),
  new Date(2024, 0, 20),
  new Date(2024, 0, 25),
];

<Calendar 
  highlightedDates={eventDates}
  onDateSelect={handleDateSelect}
/>
```

## Common Use Cases

### Date Picker

```tsx
const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
      </button>
      {isOpen && (
        <Calendar 
          selectedDate={selectedDate || undefined}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};
```

### Booking System

```tsx
const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const bookedDates = getBookedDates(); // From API
  const today = new Date();

  return (
    <Calendar 
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      minDate={today}
      disabledDates={bookedDates}
      highlightedDates={getAvailableDates()}
    />
  );
};
```

### Event Calendar

```tsx
const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const eventDates = getEventDates(); // Dates with events

  return (
    <div>
      <Calendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        highlightedDates={eventDates}
      />
      {selectedDate && (
        <EventList date={selectedDate} />
      )}
    </div>
  );
};
```

### Date Range (Start Date)

```tsx
const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div>
      <Calendar 
        selectedDate={startDate}
        onDateSelect={setStartDate}
        maxDate={endDate}
      />
      <Calendar 
        selectedDate={endDate}
        onDateSelect={setEndDate}
        minDate={startDate}
      />
    </div>
  );
};
```

## Features

- **Month Navigation**: Previous/Next month buttons
- **Date Selection**: Click to select dates
- **Visual States**: Today, selected, disabled, highlighted
- **Date Constraints**: Min/max date restrictions
- **Disabled Dates**: Specific dates can be disabled
- **Highlighted Dates**: Mark special dates
- **Responsive**: Adapts to mobile screens
- **Keyboard Accessible**: Full keyboard navigation
- **6-Week Grid**: Consistent 42-day layout

## Visual States

- **Today**: Bold text with dot indicator
- **Selected**: Primary background color
- **Disabled**: Faded and non-clickable
- **Highlighted**: Light primary background
- **Other Month**: Faded days from adjacent months

## Accessibility

- Day buttons have `aria-label` with full date
- Selected day has `aria-selected="true"`
- Navigation buttons have descriptive labels
- Disabled dates are properly marked
- Keyboard accessible
- Screen reader friendly

## Styling

- Responsive design (max-width: 400px)
- Mobile-optimized font sizes
- Consistent spacing with design system
- Smooth transitions
- Custom className support

## Notes

- Calendar shows 6 weeks (42 days) for consistency
- Includes days from previous and next months
- Today is automatically marked
- Date selection is optional (can be display-only)
- All date comparisons ignore time component
- Component is UI-only, date logic must be provided
