import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RegisterModal from "./RegisterModal";

describe("RegisterModal Component", () => {
  describe("Rendering", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = render(
        <RegisterModal isOpen={false} onClose={vi.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders modal when isOpen is true", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders title and subtitle", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByRole("heading", { name: "Create Account" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Sign up to get started")).toBeInTheDocument();
    });

    it("renders all form fields", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    it("renders terms checkbox", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByLabelText("I accept the terms and conditions"),
      ).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Create Account" }),
      ).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Close register modal" }),
      ).toBeInTheDocument();
    });

    it("renders login link when provided", () => {
      render(
        <RegisterModal isOpen={true} onClose={vi.fn()} onLogin={vi.fn()} />,
      );
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign in")).toBeInTheDocument();
    });

    it("does not render login section when not provided", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.queryByText("Already have an account?"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls onClose when close button is clicked", () => {
      const handleClose = vi.fn();
      render(<RegisterModal isOpen={true} onClose={handleClose} />);
      const closeButton = screen.getByRole("button", {
        name: "Close register modal",
      });

      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking overlay", () => {
      const handleClose = vi.fn();
      render(<RegisterModal isOpen={true} onClose={handleClose} />);
      const overlay = screen.getByRole("dialog");

      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking modal content", () => {
      const handleClose = vi.fn();
      render(<RegisterModal isOpen={true} onClose={handleClose} />);
      const title = screen.getByRole("heading", { name: "Create Account" });

      fireEvent.click(title);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("updates form field values", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const nameInput = screen.getByLabelText("Full Name") as HTMLInputElement;
      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        "Password",
      ) as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(passwordInput.value).toBe("password123");
    });

    it("toggles terms checkbox", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const checkbox = screen.getByLabelText(
        "I accept the terms and conditions",
      ) as HTMLInputElement;

      expect(checkbox.checked).toBe(false);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it("calls onLogin when sign in link is clicked", () => {
      const handleLogin = vi.fn();
      render(
        <RegisterModal isOpen={true} onClose={vi.fn()} onLogin={handleLogin} />,
      );
      const loginLink = screen.getByText("Sign in");

      fireEvent.click(loginLink);
      expect(handleLogin).toHaveBeenCalledTimes(1);
    });

    it("calls onSubmit with form data when submitted", () => {
      const handleSubmit = vi.fn();
      render(
        <RegisterModal
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={handleSubmit}
        />,
      );

      const nameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const checkbox = screen.getByLabelText(
        "I accept the terms and conditions",
      );
      const form = screen.getByRole("dialog").querySelector("form");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(checkbox);

      if (form) {
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalledWith(
          "John Doe",
          "john@example.com",
          "password123",
        );
      }
    });
  });

  describe("Password Validation", () => {
    it("shows error when passwords do not match", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");

      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "different" } });

      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    it("does not show error when passwords match", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");

      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });

      expect(
        screen.queryByText("Passwords do not match"),
      ).not.toBeInTheDocument();
    });

    it("disables submit button when passwords do not match", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const checkbox = screen.getByLabelText(
        "I accept the terms and conditions",
      );
      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });

      fireEvent.click(checkbox);
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "different" } });

      expect(submitButton).toBeDisabled();
    });

    it("disables submit button when terms not accepted", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });

      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when all conditions met", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const checkbox = screen.getByLabelText(
        "I accept the terms and conditions",
      );
      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });

      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmInput, { target: { value: "password123" } });
      fireEvent.click(checkbox);

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has dialog role", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal attribute", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to title", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "register-modal-title");
    });

    it("title has correct id", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const title = screen.getByRole("heading", { name: "Create Account" });
      expect(title).toHaveAttribute("id", "register-modal-title");
    });

    it("close button has aria-label", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const closeButton = screen.getByRole("button", {
        name: "Close register modal",
      });
      expect(closeButton).toHaveAttribute("aria-label");
    });

    it("form fields are required", () => {
      render(<RegisterModal isOpen={true} onClose={vi.fn()} />);
      const nameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");

      expect(nameInput).toHaveAttribute("required");
      expect(emailInput).toHaveAttribute("required");
      expect(passwordInput).toHaveAttribute("required");
      expect(confirmInput).toHaveAttribute("required");
    });
  });
});
