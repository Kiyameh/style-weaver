# OklchDisclaimer

A decorative component that explains why the OKLCH color space is used in the application, with a link to Evil Martians' article.

## Overview

The `OklchDisclaimer` component displays a visually appealing disclaimer section that educates users about the benefits of using OKLCH color space over traditional RGB/HSL. It features colorful text, a decorative grid background, and a link to an external resource.

## Features

- **Colorful Typography**: Each letter is styled with different OKLCH colors
- **Decorative Background**: Grid pattern with radial gradient mask
- **External Link**: Links to Evil Martians' article about OKLCH
- **Paintbrush Icon**: Decorative icon from Lucide React
- **Rotated Layout**: Positioned at -15deg for visual interest

## Usage

```tsx
import { OklchDisclaimer } from "@/components/organism/OklchDisclaimer";

export default function Page() {
  return (
    <div>
      {/* Your content */}
      <OklchDisclaimer />
    </div>
  );
}
```

## Props

This component does not accept any props. It's a self-contained decorative element.

## Styling

The component uses CSS Modules with the following classes:

- `.disclaimer` - Main container with absolute positioning
- `.disclaimerContent` - Inner content wrapper
- `.disclaimerIcon` - Paintbrush icon styling
- `.disclaimer h4` - Heading with colorful spans
- `.disclaimer a` - External link with dashed underline

### Key Styles

- **Position**: Absolute, positioned at `right: 30%`, `top: 15%`
- **Rotation**: `-15deg` for visual interest
- **Background**: Grid pattern with OKLCH colors and radial mask
- **Typography**: Uses `var(--font-pacifico)` font family
- **Colors**: Each letter uses different OKLCH hue (60°, 120°, 180°, 240°, 300°, 360°)

## Accessibility

- **External Link**: Includes `rel="noopener"` for security
- **Target Blank**: Opens in new tab with `target="_blank"`
- **Icon Size**: 14px for the external link icon
- **User Select**: Disabled with `user-select: none` for decorative text

## Dependencies

- **lucide-react**: For `ExternalLink` and `Paintbrush` icons
- **CSS Modules**: For component styling

## Notes

- The component is designed to be positioned absolutely within a relative container
- The grid background uses OKLCH colors to demonstrate the color space
- Each letter in "Oklch" has a unique color to showcase the color spectrum
- The link points to Evil Martians' comprehensive article about OKLCH benefits
