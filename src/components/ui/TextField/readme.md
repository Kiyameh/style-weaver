# TextField Component

A flexible text input component with label, helper text, multiple variants, and full accessibility features.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Optional label text displayed above the input |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Input style variant |
| `error` | `boolean` | `false` | Applies error styling to the input and helper text |
| `helperText` | `string` | - | Optional helper text displayed below the input |
| `fullWidth` | `boolean` | `false` | Makes the input take full width of its container |
| `id` | `string` | auto-generated | HTML id attribute, auto-generated if not provided |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | - | All standard HTML input attributes |

## Variants

- **Primary**: Main input style with primary color focus state
- **Secondary**: Alternative input style with neutral colors

## Usage Examples

```tsx
// Basic text field
<TextField />

// With label
<TextField label="Username" />

// With label and placeholder
<TextField 
  label="Email" 
  placeholder="john@example.com" 
  type="email"
/>

// With helper text
<TextField 
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>

// With error state
<TextField 
  label="Email"
  error
  helperText="Please enter a valid email address"
/>

// Full width
<TextField label="Full Name" fullWidth />

// Controlled input
<TextField 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Secondary variant
<TextField label="Search" variant="secondary" />

// Disabled
<TextField label="Readonly field" disabled value="Cannot edit" />

// With custom attributes
<TextField 
  label="Username"
  name="username"
  required
  maxLength={20}
  autoComplete="username"
/>
```

## Input Types

The component supports all standard HTML input types:

- `text` (default)
- `email`
- `password`
- `number`
- `tel`
- `url`
- `search`
- And more...

## Accessibility

- Automatically generates unique IDs for proper label association
- Helper text is linked via `aria-describedby`
- Error state automatically sets `aria-invalid="true"`
- Supports all ARIA attributes (`aria-label`, `aria-describedby`, etc.)
- Keyboard accessible with proper focus indicators
- Screen reader friendly with semantic HTML

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.
