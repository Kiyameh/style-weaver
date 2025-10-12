import { fireEvent, render, screen } from "@testing-library/react";
import { Home, Settings, User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import SidebarMenu from "./SidebarMenu";
import type { MenuItem } from "./types";

describe("SidebarMenu Component", () => {
  const mockItems: MenuItem[] = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  describe("Rendering", () => {
    it("renders all menu items", () => {
      render(<SidebarMenu items={mockItems} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders as a nav element", () => {
      render(<SidebarMenu items={mockItems} />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("renders with title", () => {
      render(<SidebarMenu items={mockItems} title="Main Menu" />);
      expect(screen.getByText("Main Menu")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      const { container } = render(<SidebarMenu items={mockItems} />);
      const title = container.querySelector(".title");
      expect(title).not.toBeInTheDocument();
    });

    it("renders items with icons", () => {
      const { container } = render(<SidebarMenu items={mockItems} />);
      const icons = container.querySelectorAll(".icon");
      expect(icons).toHaveLength(3);
    });

    it("renders items without icons when not provided", () => {
      const itemsWithoutIcons: MenuItem[] = [
        { id: "item1", label: "Item 1" },
        { id: "item2", label: "Item 2" },
      ];
      const { container } = render(<SidebarMenu items={itemsWithoutIcons} />);
      const icons = container.querySelectorAll(".icon");
      expect(icons).toHaveLength(0);
    });

    it("renders empty menu with no items", () => {
      const { container } = render(<SidebarMenu items={[]} />);
      const list = container.querySelector(".list");
      expect(list?.children).toHaveLength(0);
    });
  });

  describe("Active State", () => {
    it("marks active item with aria-current", () => {
      render(<SidebarMenu items={mockItems} activeItemId="profile" />);
      const profileButton = screen.getByText("Profile").closest("button");
      expect(profileButton).toHaveAttribute("aria-current", "page");
    });

    it("does not mark inactive items with aria-current", () => {
      render(<SidebarMenu items={mockItems} activeItemId="profile" />);
      const homeButton = screen.getByText("Home").closest("button");
      expect(homeButton).not.toHaveAttribute("aria-current");
    });

    it("applies active class to active item", () => {
      const { container } = render(
        <SidebarMenu items={mockItems} activeItemId="settings" />,
      );
      const settingsButton = screen.getByText("Settings").closest("button");
      expect(settingsButton).toHaveClass("active");
    });

    it("does not apply active class to inactive items", () => {
      render(<SidebarMenu items={mockItems} activeItemId="settings" />);
      const homeButton = screen.getByText("Home").closest("button");
      expect(homeButton).not.toHaveClass("active");
    });

    it("handles no active item", () => {
      render(<SidebarMenu items={mockItems} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute("aria-current");
        expect(button).not.toHaveClass("active");
      });
    });
  });

  describe("Disabled State", () => {
    it("renders disabled items", () => {
      const itemsWithDisabled: MenuItem[] = [
        { id: "item1", label: "Enabled" },
        { id: "item2", label: "Disabled", disabled: true },
      ];
      render(<SidebarMenu items={itemsWithDisabled} />);
      const disabledButton = screen.getByText("Disabled").closest("button");
      expect(disabledButton).toBeDisabled();
    });

    it("enabled items are not disabled", () => {
      render(<SidebarMenu items={mockItems} />);
      const homeButton = screen.getByText("Home").closest("button");
      expect(homeButton).not.toBeDisabled();
    });
  });

  describe("Functionality", () => {
    it("calls onClick when item is clicked", () => {
      const handleClick = vi.fn();
      const itemsWithClick: MenuItem[] = [
        { id: "clickable", label: "Click Me", onClick: handleClick },
      ];
      render(<SidebarMenu items={itemsWithClick} />);
      const button = screen.getByText("Click Me");

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled item is clicked", () => {
      const handleClick = vi.fn();
      const itemsWithDisabled: MenuItem[] = [
        {
          id: "disabled",
          label: "Disabled",
          onClick: handleClick,
          disabled: true,
        },
      ];
      render(<SidebarMenu items={itemsWithDisabled} />);
      const button = screen.getByText("Disabled");

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("calls correct onClick for each item", () => {
      const handleHome = vi.fn();
      const handleProfile = vi.fn();
      const itemsWithHandlers: MenuItem[] = [
        { id: "home", label: "Home", onClick: handleHome },
        { id: "profile", label: "Profile", onClick: handleProfile },
      ];
      render(<SidebarMenu items={itemsWithHandlers} />);

      fireEvent.click(screen.getByText("Home"));
      expect(handleHome).toHaveBeenCalledTimes(1);
      expect(handleProfile).not.toHaveBeenCalled();

      fireEvent.click(screen.getByText("Profile"));
      expect(handleProfile).toHaveBeenCalledTimes(1);
      expect(handleHome).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard nav attributes", () => {
      render(
        <SidebarMenu
          items={mockItems}
          data-testid="custom-menu"
          id="sidebar-nav"
        />,
      );
      const nav = screen.getByTestId("custom-menu");
      expect(nav).toHaveAttribute("id", "sidebar-nav");
    });

    it("applies custom className", () => {
      const { container } = render(
        <SidebarMenu items={mockItems} className="custom-class" />,
      );
      const menu = container.querySelector(".menu");
      expect(menu).toHaveClass("menu", "custom-class");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(
        <SidebarMenu items={mockItems} className="class-one class-two" />,
      );
      const menu = container.querySelector(".menu");
      expect(menu).toHaveClass("menu", "class-one", "class-two");
    });
  });

  describe("Accessibility", () => {
    it("has navigation role", () => {
      render(<SidebarMenu items={mockItems} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("has default aria-label", () => {
      render(<SidebarMenu items={mockItems} />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Menu");
    });

    it("uses title as aria-label", () => {
      render(<SidebarMenu items={mockItems} title="Main Navigation" />);
      const nav = screen.getByRole("navigation", { name: "Main Navigation" });
      expect(nav).toBeInTheDocument();
    });

    it("all items are keyboard accessible", () => {
      render(<SidebarMenu items={mockItems} />);
      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(<SidebarMenu items={mockItems} />);
      const icons = container.querySelectorAll(".icon");

      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("uses semantic list structure", () => {
      const { container } = render(<SidebarMenu items={mockItems} />);
      const list = container.querySelector("ul");
      const items = container.querySelectorAll("li");

      expect(list).toBeInTheDocument();
      expect(items).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("handles items with same label but different ids", () => {
      const duplicateLabelItems: MenuItem[] = [
        { id: "item1", label: "Item" },
        { id: "item2", label: "Item" },
      ];
      render(<SidebarMenu items={duplicateLabelItems} />);
      const items = screen.getAllByText("Item");
      expect(items).toHaveLength(2);
    });

    it("handles empty label gracefully", () => {
      const emptyLabelItems: MenuItem[] = [{ id: "empty", label: "" }];
      render(<SidebarMenu items={emptyLabelItems} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });

    it("handles mixed items with and without icons", () => {
      const mixedItems: MenuItem[] = [
        { id: "with-icon", label: "With Icon", icon: <Home size={20} /> },
        { id: "without-icon", label: "Without Icon" },
      ];
      const { container } = render(<SidebarMenu items={mixedItems} />);
      const icons = container.querySelectorAll(".icon");
      expect(icons).toHaveLength(1);
    });

    it("maintains structure with all features", () => {
      const handleClick = vi.fn();
      const fullFeaturedItems: MenuItem[] = [
        {
          id: "full",
          label: "Full Featured",
          icon: <Settings size={20} />,
          onClick: handleClick,
        },
        {
          id: "disabled",
          label: "Disabled",
          icon: <User size={20} />,
          disabled: true,
        },
      ];
      render(
        <SidebarMenu
          items={fullFeaturedItems}
          activeItemId="full"
          title="Test Menu"
          className="custom"
        />,
      );

      expect(screen.getByText("Test Menu")).toBeInTheDocument();
      expect(screen.getByText("Full Featured")).toBeInTheDocument();
      const disabledButton = screen.getByText("Disabled").closest("button");
      expect(disabledButton).toBeDisabled();
    });
  });
});
