# CssRadiusInput

A React component that provides an interactive interface for editing CSS border-radius values with support for multiple CSS units.

## Overview

The `CssRadiusInput` component allows users to adjust border-radius values through an intuitive slider and unit selector. It includes a real-time visual preview showing how the border-radius will appear on an element.

## Features

- **Multiple CSS Units**: Support for px, rem, em, and % units
- **Real-time Preview**: Visual preview box showing the border-radius effect
- **Accessible**: Proper ARIA labels, keyboard navigation, and semantic HTML structure
- **Input Validation**: Gracefully handles invalid input values without crashing
- **Customizable Range**: Configurable min, max, and step values
- **TypeScript**: Full TypeScript support with proper type definitions

## Usage

```tsx
import CssRadiusInput, { type CssRadiusValue } from "./CssRadiusInput";

const MyComponent = () => {
  const [radius, setRadius] = useState<CssRadiusValue>({
    value: 8,
    unit: "px"
  });

  const handleRadiusChange = (newRadius: CssRadiusValue) => {
    setRadius(newRadius);
  };

  return (
    <CssRadiusInput 
      value={radius} 
      onRadiusChange={handleRadiusChange} 
    />
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `CssRadiusValue` | Yes | - | The current radius value with unit |
| `onRadiusChange` | `(radius: CssRadiusValue) => void` | Yes | - | Callback fired when radius changes |
| `min` | `number` | No | `0` | Minimum value for the slider |
| `max` | `number` | No | `100` | Maximum value for the slider |
| `step` | `number` | No | `1` | Step increment for the slider |

## Types

```typescript
export type CssUnit = "px" | "rem" | "em" | "%";

export interface CssRadiusValue {
  value: number;
  unit: CssUnit;
}
```

## Supported Units

- **px** (pixels): Absolute unit, commonly used for precise control
- **rem** (root em): Relative to root font size, good for responsive design
- **em**: Relative to parent font size
- **%** (percentage): Relative to element dimensions

## Accessibility

- Uses semantic `<fieldset>` structure for grouping related controls
- Each input has proper `<label>` associations
- Supports keyboard navigation
- Unique IDs for all form controls
- Proper ARIA attributes on range inputs and select

## Error Handling

The component gracefully handles:

- Invalid input values (NaN, non-numeric strings)
- Values outside the min/max range
- Unit changes that preserve the numeric value

## Styling

The component uses CSS Modules for styling:

- `.container` - Main fieldset container
- `.sliderContainer` - Container for the slider and label
- `.slider` - Range input styling
- `.unitContainer` - Container for unit selector
- `.unitSelect` - Select dropdown styling
- `.previewContainer` - Preview area container
- `.previewBox` - Visual preview element

The preview box updates in real-time to show the border-radius effect.

## Examples

### Basic Usage

```tsx
<CssRadiusInput 
  value={{ value: 8, unit: "px" }}
  onRadiusChange={(radius) => console.log(radius)}
/>
```

### Custom Range for rem units

```tsx
<CssRadiusInput 
  value={{ value: 1, unit: "rem" }}
  onRadiusChange={handleChange}
  min={0}
  max={5}
  step={0.25}
/>
```

### Percentage-based radius

```tsx
<CssRadiusInput 
  value={{ value: 50, unit: "%" }}
  onRadiusChange={handleChange}
  min={0}
  max={100}
  step={5}
/>
```

## Notes

- The component maintains internal state synchronized with the `value` prop
- Changing units preserves the numeric value (doesn't convert between units)
- The preview box is a fixed 100x100px element for consistent visualization
- All CSS custom properties from the theme are supported for styling
