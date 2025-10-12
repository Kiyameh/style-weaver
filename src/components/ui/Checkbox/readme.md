# Checkbox Component

A flexible checkbox component with label support, multiple variants, and full accessibility features.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Optional label text displayed next to the checkbox |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Checkbox style variant |
| `error` | `boolean` | `false` | Applies error styling to the checkbox |
| `id` | `string` | auto-generated | HTML id attribute, auto-generated if not provided |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | - | All standard HTML input attributes (except `type`) |

## Variants

- **Primary**: Main checkbox style with primary color scheme when checked
- **Secondary**: Alternative checkbox style with neutral colors

## Usage Examples

```tsx
// Basic checkbox
<Checkbox />

// With label
<Checkbox label="Accept terms and conditions" />

// Controlled checkbox
<Checkbox 
  checked={isChecked} 
  onChange={(e) => setIsChecked(e.target.checked)} 
/>

// With error state
<Checkbox label="Required field" error />

// Disabled
<Checkbox label="Disabled option" disabled />

// Secondary variant
<Checkbox label="Subscribe" variant="secondary" />

// With custom attributes
<Checkbox 
  label="Newsletter"
  name="newsletter"
  value="subscribed"
  required
  aria-describedby="newsletter-help"
/>
```

## Accessibility

- Automatically generates unique IDs for proper label association
- Supports all ARIA attributes (`aria-label`, `aria-describedby`, `aria-invalid`, etc.)
- Keyboard accessible (Space to toggle)
- Proper focus indicators
- Screen reader friendly with semantic HTML

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.
