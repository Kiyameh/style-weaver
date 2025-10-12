# RegisterModal Component

A modal dialog for user registration with name, email, password confirmation, and terms acceptance. UI-only component ready for integration with authentication logic.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | **Required.** Controls modal visibility |
| `onClose` | `() => void` | - | **Required.** Called when modal should close |
| `onSubmit` | `(name: string, email: string, password: string) => void` | - | Optional callback when form is submitted |
| `onLogin` | `() => void` | - | Optional callback for login link |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Usage Examples

```tsx
// Basic register modal
const [isOpen, setIsOpen] = useState(false);

<RegisterModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>

// With submit handler
<RegisterModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(name, email, password) => {
    console.log('Registration attempt:', name, email);
    // Add your registration logic here
  }}
/>

// With login redirect
<RegisterModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleRegister}
  onLogin={() => setShowLoginModal(true)}
/>

// Complete example
const [showRegister, setShowRegister] = useState(false);

<button onClick={() => setShowRegister(true)}>
  Sign Up
</button>

<RegisterModal 
  isOpen={showRegister}
  onClose={() => setShowRegister(false)}
  onSubmit={async (name, email, password) => {
    try {
      await authService.register(name, email, password);
      setShowRegister(false);
      navigate('/welcome');
    } catch (error) {
      showError('Registration failed');
    }
  }}
  onLogin={() => {
    setShowRegister(false);
    setShowLogin(true);
  }}
/>
```

## Common Use Cases

### Basic Registration

```tsx
const RegisterPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.ok) {
        setIsOpen(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <RegisterModal 
      isOpen={isOpen}
      onClose={() => navigate('/')}
      onSubmit={handleRegister}
    />
  );
};
```

### With Login Flow

```tsx
const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

<>
  <RegisterModal 
    isOpen={activeModal === 'register'}
    onClose={() => setActiveModal(null)}
    onSubmit={handleRegister}
    onLogin={() => setActiveModal('login')}
  />
  
  <LoginModal 
    isOpen={activeModal === 'login'}
    onClose={() => setActiveModal(null)}
    onSubmit={handleLogin}
    onSignUp={() => setActiveModal('register')}
  />
</>
```

### With Validation

```tsx
const handleRegister = async (name: string, email: string, password: string) => {
  // Client-side validation
  if (password.length < 8) {
    showError('Password must be at least 8 characters');
    return;
  }

  try {
    await authService.register({ name, email, password });
    showSuccess('Account created successfully!');
    setShowRegister(false);
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS') {
      showError('Email already registered');
    } else {
      showError('Registration failed. Please try again.');
    }
  }
};
```

## Features

- **Modal Overlay**: Backdrop with blur effect
- **Click Outside**: Closes when clicking overlay
- **Close Button**: X button in top-right corner
- **Form Validation**: HTML5 required fields
- **Password Confirmation**: Validates matching passwords
- **Terms Acceptance**: Required checkbox for terms
- **Login Link**: Optional redirect to login
- **Keyboard Accessible**: Full keyboard navigation
- **Animated Entry**: Smooth slide-in animation
- **Scrollable**: Content scrolls if too tall for viewport

## Form Fields

1. **Full Name**: Required, text input
2. **Email**: Required, type="email" for validation
3. **Password**: Required, type="password" with helper text
4. **Confirm Password**: Required, validates match with password
5. **Terms Checkbox**: Required acceptance of terms

## Password Validation

- Passwords must match to enable submission
- Shows error message when passwords don't match
- Submit button disabled until passwords match
- Helper text shows "At least 8 characters" requirement

## Submit Button States

The submit button is disabled when:

- Terms checkbox is not checked
- Passwords do not match
- Form is invalid

## Accessibility

- Uses `role="dialog"` for screen readers
- Has `aria-modal="true"` to indicate modal behavior
- Title linked with `aria-labelledby`
- Close button has descriptive `aria-label`
- Form fields are properly labeled
- Error messages are associated with fields
- Keyboard accessible (Tab, Enter, Escape)
- Focus management

## Styling

- Responsive design works on all screen sizes
- Backdrop blur effect for modern look
- Smooth animations
- Consistent with design system
- Mobile-friendly with padding
- Scrollable content for long forms

## Notes

- Modal renders nothing when `isOpen` is false
- Form submission prevents default behavior
- Name, email, and password are passed to `onSubmit` callback
- Clicking overlay or close button triggers `onClose`
- Login link is optional
- Component is UI-only, registration logic must be provided
- Fixed positioning with z-index 1000
- Password confirmation is validated client-side
- Terms must be accepted before submission
