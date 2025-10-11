# CssShadowInput

A React component that provides an interactive interface for creating and editing CSS box-shadow values with support for multiple length values, OKLCH color, and inset shadows.

## Overview

The `CssShadowInput` component allows users to configure all aspects of a CSS box-shadow through intuitive sliders, unit selectors, and a color picker. It includes real-time visual preview and generates a CSS-ready string output.

## Features

- **Multiple Length Values**: Configure offsetX, offsetY, blur, and spread (optional)
- **Multiple CSS Units**: Support for px, rem, em, and % units for each length value
- **OKLCH Color Support**: Integrated color picker using OKLCH color space
- **Inset Shadows**: Toggle between normal and inset shadows
- **Real-time Preview**: Visual preview box showing the shadow effect
- **CSS String Output**: Generates ready-to-use CSS box-shadow string
- **Accessible**: Proper ARIA labels, keyboard navigation, and semantic HTML structure
- **Input Validation**: Gracefully handles invalid input values
- **Customizable Range**: Configurable min, max, and step values
- **TypeScript**: Full TypeScript support with proper type definitions

## Usage

```tsx
import CssShadowInput, { type CssShadowValue } from "./CssShadowInput";
import Color from "colorjs.io";

const MyComponent = () => {
  const [shadow, setShadow] = useState<CssShadowValue>({
    offsetX: { value: 2, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0.5, 0.1, 200]),
    inset: false
  });

  const handleShadowChange = (newShadow: CssShadowValue) => {
    setShadow(newShadow);
  };

  return (
    <CssShadowInput 
      value={shadow} 
      onShadowChange={handleShadowChange} 
    />
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `CssShadowValue` | Yes | - | The current shadow configuration |
| `onShadowChange` | `(shadow: CssShadowValue) => void` | Yes | - | Callback fired when shadow changes |
| `showBlur` | `boolean` | No | `true` | Whether to show blur radius control |
| `showSpread` | `boolean` | No | `false` | Whether to show spread radius control |
| `min` | `number` | No | `-50` | Minimum value for offset sliders |
| `max` | `number` | No | `50` | Maximum value for sliders |
| `step` | `number` | No | `1` | Step increment for sliders |

## Types

```typescript
export type CssUnit = "px" | "rem" | "em" | "%";

export interface CssLengthValue {
  value: number;
  unit: CssUnit;
}

export interface CssShadowValue {
  offsetX: CssLengthValue;
  offsetY: CssLengthValue;
  blur?: CssLengthValue;
  spread?: CssLengthValue;
  color: Color;
  inset: boolean;
}
```

## Shadow Properties

### Required Properties

- **offsetX**: Horizontal offset of the shadow (can be negative)
- **offsetY**: Vertical offset of the shadow (can be negative)
- **color**: Shadow color in OKLCH format using colorjs.io Color object
- **inset**: Whether the shadow is inset or outset

### Optional Properties

- **blur**: Blur radius (always positive, defaults to 0 if omitted)
- **spread**: Spread radius (can be negative, only shown if `showSpread` is true)

## Supported Units

- **px** (pixels): Absolute unit, commonly used for precise control
- **rem** (root em): Relative to root font size, good for responsive design
- **em**: Relative to parent font size
- **%** (percentage): Relative to element dimensions

## CSS Output Format

The component generates CSS strings in the following format:

```css
/* Basic shadow */
2px 2px 4px oklch(0.50 0.10 200 / 1.00)

/* Inset shadow */
inset 2px 2px 4px oklch(0.50 0.10 200 / 1.00)

/* Shadow with spread */
2px 2px 4px 1px oklch(0.50 0.10 200 / 1.00)

/* Inset shadow with spread */
inset 2px 2px 4px 1px oklch(0.50 0.10 200 / 1.00)
```

## Accessibility

- Uses semantic `<fieldset>` structure with `<legend>`
- Each input has proper `<label>` associations
- Unit selectors have `aria-label` attributes
- Supports keyboard navigation
- Unique IDs for all form controls
- Proper ARIA attributes on range inputs, selects, and checkboxes

## Error Handling

The component gracefully handles:

- Invalid input values (NaN, non-numeric strings)
- Values outside the min/max range
- Unit changes that preserve the numeric value
- Missing optional properties (blur, spread)

## Styling

The component uses CSS Modules for styling:

- `.container` - Main fieldset container
- `.legend` - Fieldset legend
- `.outputContainer` - CSS output preview container
- `.output` - CSS code display
- `.checkboxContainer` - Inset checkbox container
- `.checkbox` - Checkbox styling
- `.lengthControl` - Individual length control container
- `.inputGroup` - Slider and unit selector group
- `.slider` - Range input styling
- `.unitSelect` - Unit dropdown styling
- `.colorSection` - Color picker section
- `.colorTitle` - Color section title
- `.previewContainer` - Preview area container
- `.previewBox` - Visual preview element

## Examples

### Basic Shadow

```tsx
<CssShadowInput 
  value={{
    offsetX: { value: 2, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0.5, 0.1, 200]),
    inset: false
  }}
  onShadowChange={handleChange}
/>
```

### Inset Shadow with Spread

```tsx
<CssShadowInput 
  value={{
    offsetX: { value: 0, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 8, unit: "px" },
    spread: { value: -2, unit: "px" },
    color: new Color("oklch", [0.2, 0.05, 240], 0.5),
    inset: true
  }}
  onShadowChange={handleChange}
  showSpread={true}
/>
```

### Simple Shadow (no blur)

```tsx
<CssShadowInput 
  value={{
    offsetX: { value: 3, unit: "px" },
    offsetY: { value: 3, unit: "px" },
    color: new Color("oklch", [0.3, 0.1, 0]),
    inset: false
  }}
  onShadowChange={handleChange}
  showBlur={false}
/>
```

### Rem-based Shadow

```tsx
<CssShadowInput 
  value={{
    offsetX: { value: 0.125, unit: "rem" },
    offsetY: { value: 0.25, unit: "rem" },
    blur: { value: 0.5, unit: "rem" },
    color: new Color("oklch", [0.4, 0.15, 280]),
    inset: false
  }}
  onShadowChange={handleChange}
  min={-5}
  max={5}
  step={0.125}
/>
```

## Integration with OklchColorInput

The component uses `OklchColorInput` for color selection, which provides:

- Hue slider (0-360°)
- Chroma slider (0-0.37)
- Lightness slider (0-1)
- Alpha slider (0-1)

All color values are managed using the `colorjs.io` library's `Color` object.

## Notes

- The component maintains internal state synchronized with the `value` prop
- Changing units preserves the numeric value (doesn't convert between units)
- The preview box updates in real-time to show the shadow effect
- Blur and spread values are always positive (clamped at 0)
- Offset values can be negative for positioning
- The CSS output includes full OKLCH color notation with alpha channel
- All CSS custom properties from the theme are supported for styling
