# Avatar Component

A flexible avatar component that displays user profile pictures with fallback options for initials or default icon.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL for the avatar |
| `alt` | `string` | `"Avatar"` | Alt text for the image and aria-label for the component |
| `fallback` | `string` | - | Name to generate initials from when image is unavailable |
| `size` | `"small" \| "medium" \| "large" \| "xlarge"` | `"medium"` | Avatar size |
| `variant` | `"circle" \| "square"` | `"circle"` | Avatar shape |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Sizes

- **Small**: 2rem (32px)
- **Medium**: 2.5rem (40px) - default
- **Large**: 3.5rem (56px)
- **XLarge**: 5rem (80px)

## Variants

- **Circle**: Rounded avatar (default)
- **Square**: Square avatar with rounded corners

## Display Priority

The avatar displays content in this priority order:

1. **Image** (if `src` is provided and loads successfully)
2. **Initials** (if `fallback` is provided)
3. **Default Icon** (User icon from Lucide)

## Usage Examples

```tsx
// Basic avatar with image
<Avatar src="/user-avatar.jpg" alt="John Doe" />

// Avatar with fallback initials
<Avatar 
  src="/user-avatar.jpg" 
  alt="John Doe"
  fallback="John Doe"
/>

// Avatar with only initials (no image)
<Avatar fallback="Jane Smith" />

// Small circular avatar
<Avatar 
  src="/avatar.jpg"
  size="small"
  variant="circle"
/>

// Large square avatar
<Avatar 
  src="/avatar.jpg"
  size="large"
  variant="square"
/>

// XLarge avatar with fallback
<Avatar 
  fallback="Alex Johnson"
  size="xlarge"
/>

// Default icon avatar (no image or fallback)
<Avatar size="medium" />
```

## Common Use Cases

### User Profile

```tsx
<Avatar 
  src={user.avatarUrl}
  alt={user.name}
  fallback={user.name}
  size="large"
/>
```

### Comment Section

```tsx
<div className="comment">
  <Avatar 
    src={comment.author.avatar}
    fallback={comment.author.name}
    size="small"
  />
  <div className="comment-content">
    {comment.text}
  </div>
</div>
```

### User List

```tsx
{users.map(user => (
  <div key={user.id} className="user-item">
    <Avatar 
      src={user.avatar}
      fallback={user.name}
      size="medium"
      variant="circle"
    />
    <span>{user.name}</span>
  </div>
))}
```

### Team Members

```tsx
<div className="team-grid">
  {team.map(member => (
    <div key={member.id}>
      <Avatar 
        src={member.photo}
        fallback={member.name}
        size="xlarge"
        variant="square"
      />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  ))}
</div>
```

## Fallback Initials

The component automatically generates initials from the `fallback` prop:

- Takes the first character of each word
- Converts to uppercase
- Limits to 2 characters maximum
- Examples:
  - "John Doe" → "JD"
  - "Jane" → "J"
  - "Mary Jane Watson" → "MJ"

## Image Error Handling

If the image fails to load:

- Automatically falls back to initials (if `fallback` is provided)
- Or shows the default user icon
- No manual error handling required

## Accessibility

- Uses `role="img"` for proper semantics
- Image has proper `alt` text
- Container has `aria-label` for screen readers
- Fallback text and icon are hidden from screen readers with `aria-hidden="true"`
- Semantic and accessible by default

## Styling

The component accepts a `className` prop that will be merged with the base styles, allowing for custom styling while maintaining the core functionality.

## Notes

- Images are displayed with `object-fit: cover` for proper cropping
- Border is applied to all avatars for better definition
- Icon size scales proportionally with avatar size
- Fallback initials are always uppercase
- Component is fully responsive and works at any size
