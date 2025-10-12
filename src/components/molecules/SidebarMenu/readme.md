# SidebarMenu Component

A navigation menu component composed of ghost button items, ideal for sidebars and navigation panels.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | - | **Required.** Array of menu items to display |
| `activeItemId` | `string` | - | ID of the currently active menu item |
| `title` | `string` | - | Optional title displayed above the menu |
| `...props` | `HTMLAttributes<HTMLElement>` | - | All standard HTML nav attributes |

## MenuItem Interface

```typescript
interface MenuItem {
  id: string;              // Unique identifier
  label: string;           // Display text
  icon?: React.ReactNode;  // Optional icon (e.g., Lucide icon)
  onClick?: () => void;    // Click handler
  disabled?: boolean;      // Disabled state
}
```

## Usage Examples

```tsx
// Basic menu
const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

<SidebarMenu items={menuItems} />

// Menu with icons
import { Home, User, Settings } from 'lucide-react';

const menuItems = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

<SidebarMenu items={menuItems} />

// Menu with active state
<SidebarMenu 
  items={menuItems} 
  activeItemId="profile" 
/>

// Menu with title
<SidebarMenu 
  items={menuItems}
  title="Main Navigation"
/>

// Menu with click handlers
const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    onClick: () => navigate('/dashboard')
  },
  { 
    id: 'settings', 
    label: 'Settings',
    icon: <Settings size={20} />,
    onClick: () => navigate('/settings')
  },
];

<SidebarMenu items={menuItems} activeItemId={currentPage} />

// Menu with disabled items
const menuItems = [
  { id: 'available', label: 'Available' },
  { id: 'coming-soon', label: 'Coming Soon', disabled: true },
];

<SidebarMenu items={menuItems} />
```

## Common Use Cases

### Sidebar Navigation

```tsx
const [activePage, setActivePage] = useState('home');

const navItems = [
  { 
    id: 'home', 
    label: 'Home',
    icon: <Home size={20} />,
    onClick: () => setActivePage('home')
  },
  { 
    id: 'projects', 
    label: 'Projects',
    icon: <FolderOpen size={20} />,
    onClick: () => setActivePage('projects')
  },
  { 
    id: 'team', 
    label: 'Team',
    icon: <Users size={20} />,
    onClick: () => setActivePage('team')
  },
];

<aside>
  <SidebarMenu 
    items={navItems}
    activeItemId={activePage}
    title="Navigation"
  />
</aside>
```

### Settings Menu

```tsx
const settingsItems = [
  { 
    id: 'general', 
    label: 'General',
    icon: <Settings size={20} />
  },
  { 
    id: 'security', 
    label: 'Security',
    icon: <Shield size={20} />
  },
  { 
    id: 'notifications', 
    label: 'Notifications',
    icon: <Bell size={20} />
  },
];

<SidebarMenu 
  items={settingsItems}
  activeItemId="general"
  title="Settings"
/>
```

### Dashboard Sidebar

```tsx
const dashboardMenu = [
  { id: 'overview', label: 'Overview', icon: <BarChart size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
  { id: 'export', label: 'Export', icon: <Download size={20} />, disabled: true },
];

<SidebarMenu items={dashboardMenu} />
```

## Features

- **Ghost Button Style**: Uses Button component with ghost variant for minimal design
- **Active State**: Highlights the currently active item with visual feedback
- **Icon Support**: Optional icons displayed before labels
- **Disabled State**: Items can be disabled to prevent interaction
- **Keyboard Navigation**: Fully keyboard accessible
- **Semantic HTML**: Uses proper nav, ul, and li structure

## Accessibility

- Uses semantic `<nav>` element with proper `aria-label`
- Active item marked with `aria-current="page"`
- Icons hidden from screen readers with `aria-hidden="true"`
- All items are keyboard accessible
- Proper list structure (`<ul>` and `<li>`)
- Screen reader friendly with descriptive labels

## Styling

The component accepts a `className` prop that will be merged with the base styles. Each button uses the ghost variant from the Button component, ensuring consistency with the design system.

## Notes

- Menu items are rendered using the Button component with `variant="ghost"`
- Active items receive special styling and `aria-current` attribute
- Icons should be sized appropriately (20px recommended)
- Empty items array renders an empty menu structure
- Title is optional and displayed above the menu items
