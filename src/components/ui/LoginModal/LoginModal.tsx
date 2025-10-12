import { X } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import s from "./LoginModal.module.css";
import type { LoginModalProps } from "./types";

const LoginModal = ({
  isOpen,
  onClose,
  onSubmit,
  onForgotPassword,
  onSignUp,
  ...props
}: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email, password);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <This is a fake component>
    <div
      {...props}
      className={s.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className={s.modal}>
        <button
          type="button"
          className={s.closeButton}
          onClick={onClose}
          aria-label="Close login modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className={s.header}>
          <h2 id="login-modal-title" className={s.title}>
            Welcome Back
          </h2>
          <p className={s.subtitle}>Sign in to your account</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {onForgotPassword && (
            <button
              type="button"
              className={s.forgotPassword}
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          )}

          <Button type="submit" variant="primary" className={s.submitButton}>
            Sign In
          </Button>
        </form>

        {onSignUp && (
          <div className={s.footer}>
            <span className={s.footerText}>Don't have an account?</span>
            <button type="button" className={s.signUpLink} onClick={onSignUp}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
