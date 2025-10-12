# Button Component

A flexible button component with multiple variants and full HTML button attributes support.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** Button content |
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Button style variant |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | All standard HTML button attributes |

## Variants

- **Primary**: Main action button with primary color scheme
- **Secondary**: Secondary action button with neutral styling  
- **Ghost**: Minimal button with transparent background
