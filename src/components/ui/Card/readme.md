# Card Component

A flexible container component for grouping related content with multiple visual styles and padding options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** Card content |
| `variant` | `"elevated" \| "outlined" \| "filled"` | `"elevated"` | Card visual style |
| `padding` | `"none" \| "small" \| "medium" \| "large"` | `"medium"` | Internal padding size |
| `hoverable` | `boolean` | `false` | Adds hover effects and cursor pointer |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Variants

- **Elevated**: Card with shadow elevation (default)
- **Outlined**: Card with border and no shadow
- **Filled**: Card with filled background and no border

## Padding Options

- **None**: No padding (0)
- **Small**: 0.75rem padding
- **Medium**: 1.25rem padding (default)
- **Large**: 2rem padding

## Usage Examples

```tsx
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Outlined variant
<Card variant="outlined">
  <p>Outlined card content</p>
</Card>

// Filled variant with small padding
<Card variant="filled" padding="small">
  <p>Compact card</p>
</Card>

// Hoverable card (clickable)
<Card hoverable onClick={() => handleCardClick()}>
  <h3>Click me</h3>
  <p>This card has hover effects</p>
</Card>

// Card with no padding (for images)
<Card padding="none">
  <img src="/image.jpg" alt="Cover" style={{ width: '100%' }} />
  <div style={{ padding: '1rem' }}>
    <h3>Image Card</h3>
    <p>Content with custom padding</p>
  </div>
</Card>

// Large padding card
<Card padding="large">
  <h2>Spacious Card</h2>
  <p>This card has extra padding for emphasis</p>
</Card>

// Complex content structure
<Card variant="outlined" hoverable>
  <header>
    <h2>Product Name</h2>
    <span>$99.99</span>
  </header>
  <main>
    <p>Product description goes here</p>
  </main>
  <footer>
    <button>Add to Cart</button>
  </footer>
</Card>
```

## Common Use Cases

### Product Cards

```tsx
<Card hoverable onClick={() => viewProduct(product.id)}>
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.price}</p>
</Card>
```

### Dashboard Widgets

```tsx
<Card variant="filled" padding="large">
  <h3>Total Sales</h3>
  <p className="metric">$12,345</p>
  <span className="change">+12% from last month</span>
</Card>
```

### Content Sections

```tsx
<Card variant="outlined">
  <h2>About Us</h2>
  <p>Company information and description...</p>
</Card>
```

### Image Galleries

```tsx
<Card padding="none" hoverable>
  <img src="/gallery-image.jpg" alt="Gallery" />
</Card>
```

## Hover Effects

When `hoverable` is true:

- **Elevated**: Increases shadow and lifts slightly
- **Outlined**: Adds subtle shadow and darker border
- **Filled**: Darkens background color
- Cursor changes to pointer

## Accessibility

- Supports all ARIA attributes (`role`, `aria-label`, `aria-describedby`, etc.)
- Can be used with semantic roles like `role="article"` or `role="region"`
- Keyboard accessible when interactive (with onClick handlers)
- Screen reader friendly with semantic HTML

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.

## Notes

- Cards take full width of their container by default
- Use `padding="none"` for full-bleed images or custom padding control
- Combine `hoverable` with `onClick` for interactive cards
- All variants work with all padding options
