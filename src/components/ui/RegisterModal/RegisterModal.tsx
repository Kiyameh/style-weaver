import { X } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import TextField from "@/components/ui/TextField";
import s from "./RegisterModal.module.css";
import type { RegisterModalProps } from "./types";

const RegisterModal = ({
  isOpen,
  onClose,
  onSubmit,
  onLogin,
  ...props
}: RegisterModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && password === confirmPassword && acceptTerms) {
      onSubmit(name, email, password);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      onClose();
    }
  };

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  return (
    <div
      {...props}
      className={s.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className={s.modal}>
        <button
          type="button"
          className={s.closeButton}
          onClick={onClose}
          aria-label="Close register modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className={s.header}>
          <h2 id="register-modal-title" className={s.title}>
            Create Account
          </h2>
          <p className={s.subtitle}>Sign up to get started</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            helperText="At least 8 characters"
          />

          <TextField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords do not match" : ""}
          />

          <Checkbox
            label="I accept the terms and conditions"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className={s.submitButton}
            disabled={!acceptTerms || !passwordsMatch}
          >
            Create Account
          </Button>
        </form>

        {onLogin && (
          <div className={s.footer}>
            <span className={s.footerText}>Already have an account?</span>
            <button type="button" className={s.loginLink} onClick={onLogin}>
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
