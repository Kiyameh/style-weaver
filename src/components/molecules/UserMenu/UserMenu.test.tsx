import { fireEvent, render, screen } from "@testing-library/react";
import { Settings, User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import type { MenuItem } from "./types";
import UserMenu from "./UserMenu";

describe("UserMenu Component", () => {
  const mockMenuItems: MenuItem[] = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  describe("Rendering", () => {
    it("renders user name", () => {
      render(<UserMenu userName="John Doe" />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders avatar with user name as fallback", () => {
      render(<UserMenu userName="John Doe" />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders avatar with image when provided", () => {
      render(<UserMenu userName="John Doe" avatarSrc="/avatar.jpg" />);
      const image = screen.getByAltText("Avatar");
      expect(image).toBeInTheDocument();
    });

    it("renders trigger button", () => {
      render(<UserMenu userName="John Doe" />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      expect(trigger).toBeInTheDocument();
    });

    it("menu is hidden by default", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Menu Toggle", () => {
    it("opens menu when trigger is clicked", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });

      fireEvent.click(trigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("closes menu when trigger is clicked again", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });

      fireEvent.click(trigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes menu when overlay is clicked", () => {
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={mockMenuItems} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });

      fireEvent.click(trigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      const overlay = container.querySelector(".overlay");
      if (overlay) {
        fireEvent.click(overlay);
      }
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("updates aria-expanded when menu opens", () => {
      render(<UserMenu userName="John Doe" />);
      const trigger = screen.getByRole("button", { name: "User menu" });

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Menu Content", () => {
    it("displays user email when provided", () => {
      render(
        <UserMenu
          userName="John Doe"
          userEmail="john@example.com"
          menuItems={mockMenuItems}
        />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("does not display email section when not provided", () => {
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={mockMenuItems} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const emailElement = container.querySelector(".headerEmail");
      expect(emailElement).not.toBeInTheDocument();
    });

    it("renders menu items", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders menu items with icons", () => {
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={mockMenuItems} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const icons = container.querySelectorAll(".menuIcon");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("renders logout button when onLogout is provided", () => {
      const handleLogout = vi.fn();
      render(<UserMenu userName="John Doe" onLogout={handleLogout} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("does not render logout button when onLogout is not provided", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("calls menu item onClick when clicked", () => {
      const handleProfileClick = vi.fn();
      const items: MenuItem[] = [
        { id: "profile", label: "Profile", onClick: handleProfileClick },
      ];
      render(<UserMenu userName="John Doe" menuItems={items} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const profileItem = screen.getByText("Profile");
      fireEvent.click(profileItem);

      expect(handleProfileClick).toHaveBeenCalledTimes(1);
    });

    it("closes menu after menu item is clicked", () => {
      const handleClick = vi.fn();
      const items: MenuItem[] = [
        { id: "item", label: "Item", onClick: handleClick },
      ];
      render(<UserMenu userName="John Doe" menuItems={items} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const item = screen.getByText("Item");
      fireEvent.click(item);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("calls onLogout when logout button is clicked", () => {
      const handleLogout = vi.fn();
      render(<UserMenu userName="John Doe" onLogout={handleLogout} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);

      expect(handleLogout).toHaveBeenCalledTimes(1);
    });

    it("closes menu after logout is clicked", () => {
      const handleLogout = vi.fn();
      render(<UserMenu userName="John Doe" onLogout={handleLogout} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Menu Item Variants", () => {
    it("applies danger variant to menu items", () => {
      const items: MenuItem[] = [
        { id: "delete", label: "Delete Account", variant: "danger" },
      ];
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={items} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const deleteItem = screen.getByText("Delete Account").closest("button");
      expect(deleteItem).toHaveClass("menuItemDanger");
    });

    it("applies default variant by default", () => {
      const items: MenuItem[] = [{ id: "profile", label: "Profile" }];
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={items} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const profileItem = screen.getByText("Profile").closest("button");
      expect(profileItem).not.toHaveClass("menuItemDanger");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <UserMenu
          userName="John Doe"
          data-testid="custom-menu"
          id="user-menu"
        />,
      );
      const container = screen.getByTestId("custom-menu");
      expect(container).toHaveAttribute("id", "user-menu");
    });

    it("applies custom className", () => {
      const { container } = render(
        <UserMenu userName="John Doe" className="custom-class" />,
      );
      const menuContainer = container.querySelector(".container");
      expect(menuContainer).toHaveClass("container", "custom-class");
    });
  });

  describe("Accessibility", () => {
    it("trigger has proper aria attributes", () => {
      render(<UserMenu userName="John Doe" />);
      const trigger = screen.getByRole("button", { name: "User menu" });

      expect(trigger).toHaveAttribute("aria-haspopup", "true");
      expect(trigger).toHaveAttribute("aria-expanded");
    });

    it("menu has role menu", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("menu items have role menuitem", () => {
      render(<UserMenu userName="John Doe" menuItems={mockMenuItems} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems.length).toBe(2);
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <UserMenu userName="John Doe" menuItems={mockMenuItems} />,
      );
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const icons = container.querySelectorAll(".menuIcon");
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("chevron icon is hidden from screen readers", () => {
      const { container } = render(<UserMenu userName="John Doe" />);
      const chevron = container.querySelector(".chevron");
      expect(chevron).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty menu items array", () => {
      render(<UserMenu userName="John Doe" menuItems={[]} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
    });

    it("handles very long user names", () => {
      render(<UserMenu userName="Alexander Benjamin Christopher Davidson" />);
      expect(
        screen.getByText("Alexander Benjamin Christopher Davidson"),
      ).toBeInTheDocument();
    });

    it("handles menu items without onClick", () => {
      const items: MenuItem[] = [{ id: "info", label: "Info" }];
      render(<UserMenu userName="John Doe" menuItems={items} />);
      const trigger = screen.getByRole("button", { name: "User menu" });
      fireEvent.click(trigger);

      const infoItem = screen.getByText("Info");
      fireEvent.click(infoItem);

      // Should close menu even without onClick
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
