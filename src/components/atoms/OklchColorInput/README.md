# OklchColorInput

A React component that provides an interactive interface for editing colors in the OKLCH color space using range sliders.

## Overview

The `OklchColorInput` component allows users to adjust color properties (hue, chroma, lightness, and alpha) through intuitive sliders with real-time visual feedback. Each slider displays a gradient background representing the color range and updates the color preview as values change.

## Features

- **OKLCH Color Space**: Uses the perceptually uniform OKLCH color space for more intuitive color manipulation
- **Real-time Preview**: Visual gradients on sliders show color changes in real-time
- **Accessible**: Proper ARIA labels, keyboard navigation, and semantic HTML structure
- **Input Validation**: Gracefully handles invalid input values without crashing
- **Wide Gamut Support**: Handles colors outside the sRGB gamut
- **TypeScript**: Full TypeScript support with proper type definitions

## Usage

```tsx
import Color from "colorjs.io";
import OklchColorInput from "./OklchColorInput";

const MyComponent = () => {
  const [color, setColor] = useState(new Color("oklch", [0.7, 0.15, 180], 1));

  const handleColorChange = (newColor: Color) => {
    setColor(newColor);
  };

  return (
    <OklchColorInput 
      value={color} 
      onColorChange={handleColorChange} 
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `Color` | Yes | The current color value (colorjs.io Color instance) |
| `onColorChange` | `(color: Color) => void` | Yes | Callback fired when color changes |

## Color Ranges

- **Hue**: 0° - 360° (circular, represents color wheel position)
- **Chroma**: 0 - 0.37 (saturation/colorfulness)
- **Lightness**: 0 - 1 (0 = black, 1 = white)
- **Alpha**: 0 - 1 (0 = transparent, 1 = opaque)

## Accessibility

- Uses semantic `<fieldset>` structure for grouping related controls
- Each slider has proper `<label>` associations
- Supports keyboard navigation
- Unique IDs for all form controls
- Proper ARIA attributes on range inputs

## Error Handling

The component gracefully handles:

- Invalid input values (NaN, non-numeric strings)
- Colors outside sRGB gamut
- Extreme color values at min/max ranges
- Achromatic colors (NaN hue values)

## Styling

The component uses CSS Modules for styling:

- `.selectors` - Main fieldset container
- `.slider` - Individual range input styling
- CSS custom properties for dynamic thumb colors (`--thumb-color`)

Each slider displays a contextual gradient background:

- **Hue**: Rainbow gradient showing color wheel
- **Chroma**: Saturation gradient from gray to full color
- **Lightness**: Brightness gradient from black to white
- **Alpha**: Transparency gradient with current color

## Dependencies

- `colorjs.io` - Color manipulation and conversion
- `react` - React hooks (useState, useEffect, useId)

## Example

```tsx
// Create a vibrant blue color
const blueColor = new Color("oklch", [0.6, 0.25, 240], 1);

<OklchColorInput 
  value={blueColor}
  onColorChange={(color) => {
    console.log('New color:', color.toString());
    console.log('OKLCH values:', color.oklch);
    console.log('Hex value:', color.to('srgb').toString({format: 'hex'}));
  }}
/>
```

## Notes

- The component maintains internal state synchronized with the `value` prop
- Color changes are debounced through the slider's native behavior
- All color calculations preserve the original color space precision
- The component handles color space conversions automatically for display purposes
