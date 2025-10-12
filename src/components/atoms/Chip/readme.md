# Chip Component

A compact chip/tag component for displaying labels, categories, or selections with optional icons and delete functionality.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | **Required.** Text content of the chip |
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Chip style variant |
| `onDelete` | `() => void` | - | Optional callback when delete button is clicked. Shows delete button when provided |
| `icon` | `React.ReactNode` | - | Optional icon displayed before the label |
| `disabled` | `boolean` | `false` | Disables the chip and its delete button |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Variants

- **Primary**: Main chip style with primary color scheme
- **Secondary**: Alternative chip style with neutral colors
- **Ghost**: Minimal chip with transparent background and border

## Usage Examples

```tsx
// Basic chip
<Chip label="React" />

// With icon
<Chip label="Featured" icon={<Star size={16} />} />

// Removable chip
<Chip 
  label="JavaScript" 
  onDelete={() => handleRemove('javascript')} 
/>

// Complete chip with icon and delete
<Chip 
  label="TypeScript"
  icon={<Code size={16} />}
  onDelete={() => handleRemove('typescript')}
/>

// Secondary variant
<Chip label="Draft" variant="secondary" />

// Ghost variant
<Chip label="Optional" variant="ghost" />

// Disabled
<Chip label="Locked" disabled />

// Clickable chip
<Chip 
  label="Filter: Active"
  onClick={() => handleFilterClick()}
/>

// With custom styling
<Chip 
  label="Custom"
  className="my-custom-chip"
/>
```

## Common Use Cases

### Tags/Categories

```tsx
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
  <Chip label="React" />
  <Chip label="TypeScript" />
  <Chip label="CSS" />
</div>
```

### Removable Selections

```tsx
{selectedItems.map(item => (
  <Chip
    key={item.id}
    label={item.name}
    onDelete={() => removeItem(item.id)}
  />
))}
```

### Status Indicators

```tsx
<Chip label="Active" variant="primary" />
<Chip label="Pending" variant="secondary" />
<Chip label="Archived" variant="ghost" disabled />
```

## Accessibility

- Uses semantic `role="status"` for screen readers
- Delete button has descriptive `aria-label` (e.g., "Remove React")
- Icons are properly hidden from screen readers with `aria-hidden="true"`
- Disabled state is communicated via `aria-disabled`
- Delete button is keyboard accessible
- Proper focus indicators on interactive elements

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.

## Notes

- The delete button automatically stops event propagation to prevent triggering parent click handlers
- When disabled, the delete button becomes non-interactive
- Icons should be sized appropriately (16px recommended)
