import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginModal from "./LoginModal";

describe("LoginModal Component", () => {
  describe("Rendering", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = render(
        <LoginModal isOpen={false} onClose={vi.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders modal when isOpen is true", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders title and subtitle", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });

    it("renders email and password fields", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Sign In" }),
      ).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Close login modal" }),
      ).toBeInTheDocument();
    });

    it("renders forgot password link when provided", () => {
      render(
        <LoginModal
          isOpen={true}
          onClose={vi.fn()}
          onForgotPassword={vi.fn()}
        />,
      );
      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    });

    it("does not render forgot password link when not provided", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.queryByText("Forgot password?")).not.toBeInTheDocument();
    });

    it("renders sign up link when provided", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} onSignUp={vi.fn()} />);
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign up")).toBeInTheDocument();
    });

    it("does not render sign up section when not provided", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(
        screen.queryByText("Don't have an account?"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls onClose when close button is clicked", () => {
      const handleClose = vi.fn();
      render(<LoginModal isOpen={true} onClose={handleClose} />);
      const closeButton = screen.getByRole("button", {
        name: "Close login modal",
      });

      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking overlay", () => {
      const handleClose = vi.fn();
      render(<LoginModal isOpen={true} onClose={handleClose} />);
      const overlay = screen.getByRole("dialog");

      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking modal content", () => {
      const handleClose = vi.fn();
      render(<LoginModal isOpen={true} onClose={handleClose} />);
      const title = screen.getByText("Welcome Back");

      fireEvent.click(title);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("calls onSubmit with email and password", () => {
      const handleSubmit = vi.fn();
      render(
        <LoginModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />,
      );

      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        "Password",
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });

    it("calls onForgotPassword when link is clicked", () => {
      const handleForgotPassword = vi.fn();
      render(
        <LoginModal
          isOpen={true}
          onClose={vi.fn()}
          onForgotPassword={handleForgotPassword}
        />,
      );
      const forgotLink = screen.getByText("Forgot password?");

      fireEvent.click(forgotLink);
      expect(handleForgotPassword).toHaveBeenCalledTimes(1);
    });

    it("calls onSignUp when sign up link is clicked", () => {
      const handleSignUp = vi.fn();
      render(
        <LoginModal isOpen={true} onClose={vi.fn()} onSignUp={handleSignUp} />,
      );
      const signUpLink = screen.getByText("Sign up");

      fireEvent.click(signUpLink);
      expect(handleSignUp).toHaveBeenCalledTimes(1);
    });

    it("updates email input value", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput.value).toBe("test@example.com");
    });

    it("updates password input value", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const passwordInput = screen.getByLabelText(
        "Password",
      ) as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: "mypassword" } });
      expect(passwordInput.value).toBe("mypassword");
    });
  });

  describe("Accessibility", () => {
    it("has dialog role", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal attribute", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to title", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "login-modal-title");
    });

    it("title has correct id", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const title = screen.getByText("Welcome Back");
      expect(title).toHaveAttribute("id", "login-modal-title");
    });

    it("close button has aria-label", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const closeButton = screen.getByRole("button", {
        name: "Close login modal",
      });
      expect(closeButton).toHaveAttribute("aria-label");
    });

    it("form fields are required", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailInput).toHaveAttribute("required");
      expect(passwordInput).toHaveAttribute("required");
    });
  });

  describe("Edge Cases", () => {
    it("handles form submission without onSubmit handler", () => {
      render(<LoginModal isOpen={true} onClose={vi.fn()} />);
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      expect(() => fireEvent.click(submitButton)).not.toThrow();
    });

    it("handles empty form submission", () => {
      const handleSubmit = vi.fn();
      render(
        <LoginModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />,
      );
      const form = screen.getByRole("dialog").querySelector("form");

      if (form) {
        // Submit form directly to bypass HTML5 validation
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalledWith("", "");
      }
    });
  });
});
