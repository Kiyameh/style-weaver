import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./Avatar";

describe("Avatar Component", () => {
  describe("Rendering", () => {
    it("renders with default icon when no props provided", () => {
      const { container } = render(<Avatar />);
      const avatar = container.querySelector(".avatar");
      const icon = container.querySelector(".icon");
      expect(avatar).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });

    it("renders as a div with role img", () => {
      render(<Avatar />);
      const avatar = screen.getByRole("img");
      expect(avatar).toBeInTheDocument();
      expect(avatar.tagName).toBe("DIV");
    });

    it("renders image when src is provided", () => {
      render(<Avatar src="/avatar.jpg" alt="User avatar" />);
      const image = screen.getByAltText("User avatar");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/avatar.jpg");
    });

    it("renders fallback initials when provided", () => {
      render(<Avatar fallback="John Doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders single initial for single word fallback", () => {
      render(<Avatar fallback="John" />);
      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("renders first two initials for multi-word fallback", () => {
      render(<Avatar fallback="John Michael Doe" />);
      expect(screen.getByText("JM")).toBeInTheDocument();
    });

    it("uses default alt text when not provided", () => {
      render(<Avatar />);
      const avatar = screen.getByRole("img", { name: "Avatar" });
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("applies medium size by default", () => {
      const { container } = render(<Avatar />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarMedium");
    });

    it("applies small size correctly", () => {
      const { container } = render(<Avatar size="small" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarSmall");
      expect(avatar).not.toHaveClass("avatarMedium");
    });

    it("applies medium size when explicitly set", () => {
      const { container } = render(<Avatar size="medium" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarMedium");
    });

    it("applies large size correctly", () => {
      const { container } = render(<Avatar size="large" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarLarge");
    });

    it("applies xlarge size correctly", () => {
      const { container } = render(<Avatar size="xlarge" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarXlarge");
    });
  });

  describe("Variants", () => {
    it("applies circle variant by default", () => {
      const { container } = render(<Avatar />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarCircle");
    });

    it("applies circle variant when explicitly set", () => {
      const { container } = render(<Avatar variant="circle" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarCircle");
    });

    it("applies square variant correctly", () => {
      const { container } = render(<Avatar variant="square" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarSquare");
      expect(avatar).not.toHaveClass("avatarCircle");
    });
  });

  describe("Image Error Handling", () => {
    it("shows fallback when image fails to load", () => {
      render(<Avatar src="/broken-image.jpg" fallback="John Doe" />);
      const image = document.querySelector("img");

      if (image) {
        fireEvent.error(image);
      }

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("shows icon when image fails and no fallback provided", () => {
      const { container } = render(<Avatar src="/broken-image.jpg" />);
      const image = document.querySelector("img");

      if (image) {
        fireEvent.error(image);
      }

      const icon = container.querySelector(".icon");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Priority Rendering", () => {
    it("prioritizes image over fallback", () => {
      const { container } = render(
        <Avatar src="/avatar.jpg" fallback="John Doe" />,
      );
      const image = screen.getByAltText("Avatar");
      const fallback = container.querySelector(".fallback");

      expect(image).toBeInTheDocument();
      expect(fallback).not.toBeInTheDocument();
    });

    it("prioritizes fallback over icon", () => {
      const { container } = render(<Avatar fallback="John Doe" />);
      const fallback = screen.getByText("JD");
      const icon = container.querySelector(".icon");

      expect(fallback).toBeInTheDocument();
      expect(icon).not.toBeInTheDocument();
    });

    it("shows icon only when no image or fallback", () => {
      const { container } = render(<Avatar />);
      const icon = container.querySelector(".icon");
      const fallback = container.querySelector(".fallback");
      const image = container.querySelector("img");

      expect(icon).toBeInTheDocument();
      expect(fallback).not.toBeInTheDocument();
      expect(image).not.toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    it("can combine size and variant", () => {
      const { container } = render(<Avatar size="large" variant="square" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarLarge", "avatarSquare");
    });

    it("can combine all props", () => {
      const { container } = render(
        <Avatar
          src="/avatar.jpg"
          alt="User"
          fallback="John Doe"
          size="xlarge"
          variant="circle"
        />,
      );
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarXlarge", "avatarCircle");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(<Avatar data-testid="custom-avatar" title="User avatar" />);
      const avatar = screen.getByTestId("custom-avatar");
      expect(avatar).toHaveAttribute("title", "User avatar");
    });

    it("applies custom className", () => {
      const { container } = render(<Avatar className="custom-class" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatar", "avatarMedium", "custom-class");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(<Avatar className="class-one class-two" />);
      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass(
        "avatar",
        "avatarMedium",
        "class-one",
        "class-two",
      );
    });
  });

  describe("Accessibility", () => {
    it("has img role", () => {
      render(<Avatar />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("has proper aria-label", () => {
      render(<Avatar alt="John Doe's avatar" />);
      const avatar = screen.getByRole("img", { name: "John Doe's avatar" });
      expect(avatar).toBeInTheDocument();
    });

    it("image has proper alt text", () => {
      render(<Avatar src="/avatar.jpg" alt="Profile picture" />);
      const image = screen.getByAltText("Profile picture");
      expect(image).toBeInTheDocument();
    });

    it("fallback text is hidden from screen readers", () => {
      render(<Avatar fallback="John Doe" />);
      const fallback = screen.getByText("JD");
      expect(fallback).toHaveAttribute("aria-hidden", "true");
    });

    it("icon is hidden from screen readers", () => {
      const { container } = render(<Avatar />);
      const icon = container.querySelector(".icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty fallback string", () => {
      const { container } = render(<Avatar fallback="" />);
      const icon = container.querySelector(".icon");
      expect(icon).toBeInTheDocument();
    });

    it("handles fallback with special characters", () => {
      render(<Avatar fallback="@John #Doe" />);
      // Takes first character of each word, including special characters
      expect(screen.getByText("@#")).toBeInTheDocument();
    });

    it("handles very long fallback names", () => {
      render(<Avatar fallback="Alexander Benjamin Christopher" />);
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("handles lowercase fallback", () => {
      render(<Avatar fallback="john doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("maintains structure with all features", () => {
      const { container } = render(
        <Avatar
          src="/avatar.jpg"
          alt="User avatar"
          fallback="John Doe"
          size="large"
          variant="square"
          className="custom"
          data-testid="full-avatar"
        />,
      );

      const avatar = container.querySelector(".avatar");
      expect(avatar).toHaveClass("avatarLarge", "avatarSquare", "custom");
      expect(screen.getByTestId("full-avatar")).toBeInTheDocument();
    });
  });
});
