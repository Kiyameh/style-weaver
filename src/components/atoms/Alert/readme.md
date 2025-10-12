# Alert Component

A flexible alert/notification component for displaying important messages with multiple severity levels, optional titles, icons, and dismiss functionality.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** Alert message content |
| `variant` | `"info" \| "success" \| "warning" \| "error"` | `"info"` | Alert severity/type |
| `title` | `string` | - | Optional title displayed above the message |
| `onClose` | `() => void` | - | Optional callback when close button is clicked. Shows close button when provided |
| `icon` | `React.ReactNode` | auto | Optional custom icon. Pass `null` to hide icon. Defaults to variant-specific icon |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Variants

- **Info**: Informational messages (blue theme)
- **Success**: Success confirmations (green theme)
- **Warning**: Warning messages (yellow/orange theme)
- **Error**: Error messages (red theme)

## Default Icons

Each variant has a default icon:

- **Info**: Info circle icon
- **Success**: Check circle icon
- **Warning**: Triangle alert icon
- **Error**: Alert circle icon

## Usage Examples

```tsx
// Basic info alert
<Alert>This is an informational message</Alert>

// Success alert with title
<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

// Warning alert
<Alert variant="warning">
  Please review your input before submitting.
</Alert>

// Error alert with title
<Alert variant="error" title="Error">
  Failed to save changes. Please try again.
</Alert>

// Dismissible alert
<Alert 
  variant="info"
  onClose={() => handleDismiss()}
>
  You can close this alert.
</Alert>

// Alert with custom icon
<Alert icon={<Bell size={20} />}>
  You have a new notification
</Alert>

// Alert without icon
<Alert icon={null}>
  Plain message without icon
</Alert>

// Complete alert with all features
<Alert
  variant="warning"
  title="Important Notice"
  onClose={() => handleClose()}
  icon={<AlertTriangle size={20} />}
>
  <p>This action cannot be undone.</p>
  <p>Please proceed with caution.</p>
</Alert>
```

## Common Use Cases

### Form Validation

```tsx
{error && (
  <Alert variant="error" title="Validation Error">
    {error.message}
  </Alert>
)}
```

### Success Feedback

```tsx
{saved && (
  <Alert 
    variant="success" 
    onClose={() => setSaved(false)}
  >
    Settings saved successfully!
  </Alert>
)}
```

### System Notifications

```tsx
<Alert variant="info" title="System Update">
  A new version is available. 
  <a href="/updates">Learn more</a>
</Alert>
```

### Inline Warnings

```tsx
<Alert variant="warning">
  Your session will expire in 5 minutes.
</Alert>
```

## Accessibility

- Uses semantic ARIA roles:
  - `role="status"` for info and success variants
  - `role="alert"` for warning and error variants (announces immediately)
- Close button has descriptive `aria-label="Close alert"`
- Icons are properly hidden from screen readers with `aria-hidden="true"`
- Close button is keyboard accessible with proper focus indicators
- Screen reader friendly with semantic HTML structure

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.

## Notes

- The alert takes full width of its container by default
- Complex content (JSX, multiple paragraphs, links) is fully supported
- The close button only appears when `onClose` prop is provided
- Icons can be customized or hidden completely
- Each variant has appropriate color theming for better visual hierarchy
