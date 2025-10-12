# LoginModal Component

A modal dialog for user authentication with email and password fields. UI-only component ready for integration with authentication logic.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls modal visibility |
| `onClose` | `() => void` | - | **Required.** Called when modal should close |
| `onSubmit` | `(email: string, password: string) => void` | - | Optional callback when form is submitted |
| `onForgotPassword` | `() => void` | - | Optional callback for forgot password link |
| `onSignUp` | `() => void` | - | Optional callback for sign up link |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Usage Examples

```tsx
// Basic login modal
const [isOpen, setIsOpen] = useState(false);

<LoginModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>

// With submit handler
<LoginModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(email, password) => {
    console.log('Login attempt:', email);
    // Add your authentication logic here
  }}
/>

// With all features
<LoginModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleLogin}
  onForgotPassword={() => navigate('/forgot-password')}
  onSignUp={() => setShowRegisterModal(true)}
/>

// Controlled with state
const [showLogin, setShowLogin] = useState(false);

<button onClick={() => setShowLogin(true)}>
  Sign In
</button>

<LoginModal 
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onSubmit={async (email, password) => {
    try {
      await authService.login(email, password);
      setShowLogin(false);
      navigate('/dashboard');
    } catch (error) {
      showError('Invalid credentials');
    }
  }}
/>
```

## Common Use Cases

### Basic Authentication

```tsx
const LoginPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        setIsOpen(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginModal 
      isOpen={isOpen}
      onClose={() => navigate('/')}
      onSubmit={handleLogin}
    />
  );
};
```

### With Password Reset

```tsx
<LoginModal 
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onSubmit={handleLogin}
  onForgotPassword={() => {
    setShowLogin(false);
    setShowPasswordReset(true);
  }}
/>
```

### With Registration Flow

```tsx
const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

<>
  <LoginModal 
    isOpen={activeModal === 'login'}
    onClose={() => setActiveModal(null)}
    onSubmit={handleLogin}
    onSignUp={() => setActiveModal('register')}
  />
  
  <RegisterModal 
    isOpen={activeModal === 'register'}
    onClose={() => setActiveModal(null)}
    onSubmit={handleRegister}
  />
</>
```

## Features

- **Modal Overlay**: Backdrop with blur effect
- **Click Outside**: Closes when clicking overlay
- **Close Button**: X button in top-right corner
- **Form Validation**: HTML5 required fields
- **Forgot Password**: Optional link
- **Sign Up Link**: Optional registration redirect
- **Keyboard Accessible**: Full keyboard navigation
- **Animated Entry**: Smooth slide-in animation

## Form Fields

1. **Email**: Required, type="email" for validation
2. **Password**: Required, type="password" for security

## Accessibility

- Uses `role="dialog"` for screen readers
- Has `aria-modal="true"` to indicate modal behavior
- Title linked with `aria-labelledby`
- Close button has descriptive `aria-label`
- Form fields are properly labeled
- Keyboard accessible (Tab, Enter, Escape)
- Focus management

## Styling

- Responsive design works on all screen sizes
- Backdrop blur effect for modern look
- Smooth animations
- Consistent with design system
- Mobile-friendly with padding

## Notes

- Modal renders nothing when `isOpen` is false
- Form submission prevents default behavior
- Email and password are passed to `onSubmit` callback
- Clicking overlay or close button triggers `onClose`
- Forgot password and sign up links are optional
- Component is UI-only, authentication logic must be provided
- Fixed positioning with z-index 1000
