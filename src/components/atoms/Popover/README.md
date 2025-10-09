# Popover

A React component that leverages the native HTML Popover API to create accessible, performant popover dialogs with automatic positioning and focus management.

## Overview

The `Popover` component provides a simple interface for creating popover dialogs using the browser's native popover functionality. It automatically handles accessibility, positioning, and user interactions through the native HTML popover API, ensuring optimal performance and standards compliance.

## Features

- **Native HTML Popover API**: Uses browser-native popover functionality for optimal performance
- **Automatic Accessibility**: Built-in ARIA attributes and keyboard navigation support
- **Flexible Triggers**: Accepts any React element as a trigger
- **Custom Styling**: Supports custom styles through the `style` prop
- **Fallback Content**: Gracefully handles empty or undefined content
- **Unique IDs**: Automatically generates unique IDs for multiple popover instances
- **TypeScript Support**: Full TypeScript definitions included

## Usage

```tsx
import Popover from "./Popover";

const MyComponent = () => {
  return (
    <Popover trigger={<button type="button">Open Menu</button>}>
      <div>
        <h3>Menu Options</h3>
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
    </Popover>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `trigger` | `React.ReactElement` | Yes | The element that will trigger the popover when clicked |
| `children` | `React.ReactNode` | No | Content to display inside the popover |
| `style` | `React.CSSProperties` | No | Custom inline styles for the popover surface |
| `key` | `string` | No | Optional key for identifying the popover instance |

## Examples

### Basic Popover

```tsx
<Popover trigger={<button type="button">Click me</button>}>
  <p>This is a simple popover!</p>
</Popover>
```

### Custom Styled Popover

```tsx
<Popover 
  trigger={<button type="button">Styled Popover</button>}
  style={{
    backgroundColor: '#f0f0f0',
    border: '2px solid #333',
    borderRadius: '8px',
    padding: '20px'
  }}
>
  <div>
    <h4>Custom Styled Content</h4>
    <p>This popover has custom styling applied.</p>
  </div>
</Popover>
```

### Complex Trigger Element

```tsx
<Popover trigger={
  <div className="custom-trigger">
    <span>🔽</span>
    <span>Advanced Trigger</span>
  </div>
}>
  <div>Content for complex trigger</div>
</Popover>
```

### Multiple Popovers

```tsx
<div>
  <Popover trigger={<button type="button">First</button>}>
    <div>First popover content</div>
  </Popover>
  
  <Popover trigger={<button type="button">Second</button>}>
    <div>Second popover content</div>
  </Popover>
</div>
```

## Native Popover API Features

This component leverages the native HTML Popover API, which provides:

- **Automatic positioning**: Browser handles optimal placement
- **Focus management**: Automatic focus trapping and restoration
- **Escape key handling**: Built-in keyboard dismissal
- **Click outside**: Automatic dismissal when clicking outside
- **Accessibility**: Native ARIA attributes and screen reader support
- **Performance**: No JavaScript positioning calculations needed

## Component Structure

The component renders the following DOM structure:

```html
<div class="popoverContainer">
  <!-- Trigger element with popovertarget attribute -->
  <button popovertarget="unique-id">Trigger</button>
  
  <!-- Popover element -->
  <div id="unique-id" popover="auto" class="popover">
    <div class="popoverSurface" style="custom styles">
      <!-- Your content here -->
    </div>
  </div>
</div>
```

## Styling

The component uses CSS Modules with the following classes:

- `.popoverContainer` - Wrapper for the entire component
- `.popover` - The popover element itself
- `.popoverSurface` - Inner container for content and custom styles
- `.noContent` - Fallback content when no children provided

### CSS Custom Properties

The component supports CSS custom properties for advanced styling:

```css
.popover {
  --popover-key: /* Set via key prop */;
}
```

## Accessibility

The component provides excellent accessibility out of the box:

- **Semantic HTML**: Uses proper popover attributes
- **Keyboard Navigation**: Full keyboard support via native API
- **Screen Readers**: Proper ARIA attributes automatically applied
- **Focus Management**: Automatic focus trapping and restoration
- **High Contrast**: Respects system high contrast settings

## Browser Support

This component requires browsers that support the native Popover API:

- **Chrome**: 114+
- **Firefox**: 125+
- **Safari**: 17+
- **Edge**: 114+

For older browsers, consider using a polyfill or alternative popover implementation.

## Error Handling

The component gracefully handles various edge cases:

- **Empty Content**: Shows "no content :(" message when no children provided
- **Undefined Content**: Handles `null` and `undefined` children gracefully
- **Invalid Triggers**: Preserves original trigger props while adding popover functionality
- **Multiple Instances**: Generates unique IDs to prevent conflicts

## Performance Considerations

- **Native API**: Uses browser-optimized positioning and rendering
- **Minimal DOM**: Creates minimal DOM structure for optimal performance
- **No JavaScript Positioning**: Eliminates expensive position calculations
- **Efficient Re-renders**: Component structure minimizes unnecessary re-renders

## Migration from Custom Popovers

If migrating from a custom popover implementation:

1. **Remove positioning logic** - Native API handles this automatically
2. **Update event handlers** - Native API manages open/close states
3. **Simplify accessibility code** - Native API provides built-in accessibility
4. **Test browser support** - Ensure target browsers support the Popover API

## Notes

- The component automatically generates unique IDs using React's `useId` hook
- Custom styles are applied to the `.popoverSurface` element, not the popover itself
- The `key` prop is used for internal tracking but doesn't affect React's key behavior
- Multiple popovers can be used simultaneously without conflicts
