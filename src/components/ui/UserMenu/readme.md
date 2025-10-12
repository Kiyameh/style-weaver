# UserMenu Component

A dropdown user menu component that combines Avatar with a menu of actions, perfect for navigation bars and headers.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | `string` | - | **Required.** User's display name |
| `userEmail` | `string` | - | Optional user email displayed in menu header |
| `avatarSrc` | `string` | - | Optional avatar image URL |
| `menuItems` | `MenuItem[]` | `[]` | Array of menu items |
| `onLogout` | `() => void` | - | Optional logout handler. Shows logout button when provided |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## MenuItem Interface

```typescript
interface MenuItem {
  id: string;                    // Unique identifier
  label: string;                 // Display text
  icon?: React.ReactNode;        // Optional icon
  onClick?: () => void;          // Click handler
  variant?: "default" | "danger"; // Visual variant
}
```

## Usage Examples

```tsx
// Basic user menu
<UserMenu userName="John Doe" />

// With avatar image
<UserMenu 
  userName="John Doe"
  avatarSrc="/avatar.jpg"
/>

// With email
<UserMenu 
  userName="John Doe"
  userEmail="john@example.com"
/>

// With menu items
import { User, Settings, HelpCircle } from 'lucide-react';

const menuItems = [
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: <User size={16} />,
    onClick: () => navigate('/profile')
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <Settings size={16} />,
    onClick: () => navigate('/settings')
  },
  { 
    id: 'help', 
    label: 'Help', 
    icon: <HelpCircle size={16} />,
    onClick: () => navigate('/help')
  },
];

<UserMenu 
  userName="John Doe"
  userEmail="john@example.com"
  avatarSrc="/avatar.jpg"
  menuItems={menuItems}
/>

// With logout
<UserMenu 
  userName="John Doe"
  menuItems={menuItems}
  onLogout={() => handleLogout()}
/>

// With danger variant item
const menuItems = [
  { id: 'profile', label: 'Profile' },
  { 
    id: 'delete', 
    label: 'Delete Account',
    variant: 'danger',
    onClick: () => handleDeleteAccount()
  },
];

<UserMenu 
  userName="John Doe"
  menuItems={menuItems}
/>
```

## Common Use Cases

### Navigation Bar

```tsx
<header>
  <nav>
    <Logo />
    <NavLinks />
  </nav>
  <UserMenu 
    userName={user.name}
    userEmail={user.email}
    avatarSrc={user.avatar}
    menuItems={[
      { id: 'profile', label: 'My Profile', onClick: () => navigate('/profile') },
      { id: 'settings', label: 'Settings', onClick: () => navigate('/settings') },
    ]}
    onLogout={handleLogout}
  />
</header>
```

### Dashboard Header

```tsx
const dashboardMenuItems = [
  { 
    id: 'account', 
    label: 'Account Settings',
    icon: <Settings size={16} />
  },
  { 
    id: 'billing', 
    label: 'Billing',
    icon: <CreditCard size={16} />
  },
  { 
    id: 'team', 
    label: 'Team',
    icon: <Users size={16} />
  },
];

<UserMenu 
  userName={currentUser.name}
  userEmail={currentUser.email}
  avatarSrc={currentUser.profilePicture}
  menuItems={dashboardMenuItems}
  onLogout={() => signOut()}
/>
```

### Admin Panel

```tsx
const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'users', label: 'Manage Users', icon: <Users size={16} /> },
  { id: 'settings', label: 'System Settings', icon: <Settings size={16} /> },
  { 
    id: 'danger-zone', 
    label: 'Danger Zone',
    icon: <AlertTriangle size={16} />,
    variant: 'danger'
  },
];

<UserMenu 
  userName="Admin User"
  menuItems={adminMenuItems}
  onLogout={handleAdminLogout}
/>
```

## Features

- **Dropdown Menu**: Click to toggle menu visibility
- **Avatar Integration**: Uses Avatar component with fallback to initials
- **Menu Items**: Customizable list of actions with icons
- **Logout Button**: Optional logout action with visual separation
- **Danger Variant**: Special styling for destructive actions
- **Click Outside**: Closes menu when clicking outside
- **Keyboard Accessible**: Full keyboard navigation support

## Menu Structure

1. **Header**: Displays user name and optional email
2. **Menu Items**: List of custom actions
3. **Divider**: Visual separator before logout
4. **Logout Button**: Optional logout action

## Accessibility

- Trigger button has proper `aria-expanded` and `aria-haspopup` attributes
- Menu has `role="menu"` for screen readers
- Menu items have `role="menuitem"`
- Icons are hidden from screen readers with `aria-hidden="true"`
- Keyboard accessible with focus management
- Proper ARIA labels for all interactive elements

## Styling

The component accepts a `className` prop that will be merged with the base styles. The menu automatically positions itself relative to the trigger button.

## Notes

- Menu closes automatically after selecting an item
- Logout button only appears when `onLogout` prop is provided
- Avatar uses user name as fallback for initials
- Menu items without `onClick` still close the menu when clicked
- Danger variant applies red color scheme to menu items
- Overlay prevents interaction with page content when menu is open
