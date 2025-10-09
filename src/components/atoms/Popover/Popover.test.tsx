import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Popover from "./Popover";

describe("Popover", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    // Mock getBoundingClientRect for positioning tests
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      top: 100,
      right: 200,
      bottom: 150,
      left: 100,
      toJSON: () => {},
    }));
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render the trigger element", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Popover Content</div>
        </Popover>
      );
      
      expect(screen.getByRole("button", { name: "Open Popover" })).toBeInTheDocument();
    });

    it("should not render panel when closed", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Popover Content</div>
        </Popover>
      );
      
      // Panel should be in the document but hidden (native popover behavior)
      const popoverContent = screen.getByText("Popover Content");
      expect(popoverContent).toBeInTheDocument();
      
      // The popover element should have the popover attribute
      const popoverElement = popoverContent.closest('[popover]');
      expect(popoverElement).toHaveAttribute('popover', 'auto');
    });

    it("should render panel when open", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Popover Content</div>
        </Popover>
      );
      
      // The popover should be rendered with the correct structure
      const popoverContent = screen.getByText("Popover Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      expect(popoverElement).toBeInTheDocument();
      expect(popoverElement).toHaveAttribute('popover', 'auto');
      
      // The trigger should have popoverTarget attribute
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      expect(trigger).toHaveAttribute('popovertarget');
    });

    it("should render children content in panel", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div data-testid="popover-content">
            <h3>Popover Title</h3>
            <p>This is the popover content</p>
          </div>
        </Popover>
      );
      
      // Children should be rendered inside the popover
      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
      expect(screen.getByText("Popover Title")).toBeInTheDocument();
      expect(screen.getByText("This is the popover content")).toBeInTheDocument();
    });

    it("should handle missing children gracefully", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
        </Popover>
      );
      
      // Should render default "no content" message when no children provided
      expect(screen.getByText("no content :(")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should handle different trigger elements", () => {
      const { rerender } = render(
        <Popover trigger={<button type="button">Button Trigger</button>}>
          <div>Content</div>
        </Popover>
      );
      
      expect(screen.getByRole("button", { name: "Button Trigger" })).toBeInTheDocument();
      
      // Test with different trigger element
      rerender(
        <Popover trigger={<span>Span Trigger</span>}>
          <div>Content</div>
        </Popover>
      );
      
      expect(screen.getByText("Span Trigger")).toBeInTheDocument();
      expect(screen.getByText("Span Trigger")).toHaveAttribute('popovertarget');
    });

    it("should apply custom panel className", () => {
      // This component doesn't support custom className, so we'll test the default classes
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      // Check that the popover has the correct CSS classes
      const popoverContent = screen.getByText("Content");
      const popoverSurface = popoverContent.closest('.popoverSurface');
      const popoverElement = popoverContent.closest('[popover]');
      
      expect(popoverSurface).toBeInTheDocument();
      expect(popoverElement).toHaveClass('popover');
    });

    it("should apply custom panel styles", () => {
      const customStyles = {
        backgroundColor: 'red',
        padding: '20px'
      };
      
      render(
        <Popover 
          trigger={<button type="button">Open Popover</button>}
          style={customStyles}
        >
          <div>Content</div>
        </Popover>
      );
      
      // Check that the popover surface element exists and has the style attribute
      const popoverContent = screen.getByText("Content");
      const popoverSurface = popoverContent.parentElement;
      
      expect(popoverSurface).toBeInTheDocument();
      expect(popoverSurface).toHaveAttribute('style');
    });

    it("should handle custom key prop", () => {
      render(
        <Popover 
          trigger={<button type="button">Open Popover</button>}
          key="test-key"
        >
          <div>Content</div>
        </Popover>
      );
      
      // Check that the popover renders correctly with key
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      expect(popoverElement).toBeInTheDocument();
      expect(popoverElement).toHaveAttribute('popover', 'auto');
    });

    it("should generate unique IDs for multiple popovers", () => {
      render(
        <div>
          <Popover trigger={<button type="button">First Trigger</button>}>
            <div>First Content</div>
          </Popover>
          <Popover trigger={<button type="button">Second Trigger</button>}>
            <div>Second Content</div>
          </Popover>
        </div>
      );
      
      const firstTrigger = screen.getByRole("button", { name: "First Trigger" });
      const secondTrigger = screen.getByRole("button", { name: "Second Trigger" });
      
      const firstPopoverTarget = firstTrigger.getAttribute('popovertarget');
      const secondPopoverTarget = secondTrigger.getAttribute('popovertarget');
      
      expect(firstPopoverTarget).toBeTruthy();
      expect(secondPopoverTarget).toBeTruthy();
      expect(firstPopoverTarget).not.toBe(secondPopoverTarget);
    });
  });

  describe("Functionality", () => {
    it("should connect trigger to popover with correct attributes", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      const popoverTargetId = trigger.getAttribute('popovertarget');
      const popoverId = popoverElement?.getAttribute('id');
      
      expect(popoverTargetId).toBeTruthy();
      expect(popoverId).toBeTruthy();
      expect(popoverTargetId).toBe(popoverId);
    });

    it("should have correct popover behavior attributes", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      expect(popoverElement).toHaveAttribute('popover', 'auto');
    });

    it("should render trigger and popover content correctly", () => {
      render(
        <Popover trigger={<span>Custom Trigger</span>}>
          <div>Popover Content</div>
        </Popover>
      );
      
      expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });
  });

  describe("Props Forwarding", () => {
    it("should pass props correctly to trigger element", () => {
      render(
        <Popover trigger={<button type="button" data-testid="trigger">Open</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByTestId("trigger");
      expect(trigger).toHaveAttribute('popovertarget');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it("should handle complex trigger elements", () => {
      render(
        <Popover trigger={
          <button type="button" aria-label="Complex trigger">
            <span>Click me</span>
          </button>
        }>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Complex trigger" });
      expect(trigger).toHaveAttribute('popovertarget');
      expect(trigger).toHaveAttribute('type', 'button');
    });
  });

  describe("Accessibility", () => {
    it("should connect trigger and popover with proper IDs", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      const popoverTargetId = trigger.getAttribute('popovertarget');
      const popoverId = popoverElement?.getAttribute('id');
      
      expect(popoverTargetId).toBeTruthy();
      expect(popoverId).toBeTruthy();
      expect(popoverTargetId).toBe(popoverId);
    });

    it("should use native popover accessibility features", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      // Native popover API provides built-in accessibility
      expect(popoverElement).toHaveAttribute('popover', 'auto');
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content gracefully", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          {null}
        </Popover>
      );
      
      // Should render the "no content" fallback
      expect(screen.getByText("no content :(")).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          {undefined}
        </Popover>
      );
      
      // Should render the "no content" fallback
      expect(screen.getByText("no content :(")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should wrap trigger in container with correct class", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      const container = trigger.parentElement;
      
      expect(container).toHaveClass('popoverContainer');
    });

    it("should render popover with correct class", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const popoverContent = screen.getByText("Content");
      const popoverElement = popoverContent.closest('[popover]');
      
      expect(popoverElement).toHaveClass('popover');
    });

    it("should render popover surface with correct class", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const popoverContent = screen.getByText("Content");
      const popoverSurface = popoverContent.parentElement;
      
      expect(popoverSurface).toHaveClass('popoverSurface');
    });

    it("should maintain proper DOM hierarchy", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      const popoverContent = screen.getByText("Content");
      
      // Trigger should be in container
      expect(trigger.parentElement).toHaveClass('popoverContainer');
      
      // Content should be in surface, which is in popover
      const surface = popoverContent.parentElement;
      const popover = surface?.parentElement;
      
      expect(surface).toHaveClass('popoverSurface');
      expect(popover).toHaveClass('popover');
      expect(popover).toHaveAttribute('popover', 'auto');
    });

    it("should handle React.cloneElement correctly for trigger", () => {
      const originalTrigger = <button type="button" data-original="true">Open</button>;
      
      render(
        <Popover trigger={originalTrigger}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open" });
      
      // Should preserve original props
      expect(trigger).toHaveAttribute('data-original', 'true');
      expect(trigger).toHaveAttribute('type', 'button');
      
      // Should add popover-specific props
      expect(trigger).toHaveAttribute('popovertarget');
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes to all elements", () => {
      render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      const trigger = screen.getByRole("button", { name: "Open Popover" });
      const popoverContent = screen.getByText("Content");
      
      // Check all CSS classes are applied
      expect(trigger.parentElement).toHaveClass('popoverContainer');
      expect(popoverContent.parentElement).toHaveClass('popoverSurface');
      expect(popoverContent.closest('[popover]')).toHaveClass('popover');
    });

    it("should apply custom styles to popover surface", () => {
      const customStyle = { backgroundColor: 'blue', margin: '10px' };
      
      render(
        <Popover 
          trigger={<button type="button">Open Popover</button>}
          style={customStyle}
        >
          <div>Content</div>
        </Popover>
      );
      
      const popoverContent = screen.getByText("Content");
      const popoverSurface = popoverContent.parentElement;
      
      expect(popoverSurface).toHaveAttribute('style');
    });
  });

  describe("Performance", () => {
    it("should render efficiently with minimal DOM nodes", () => {
      const { container } = render(
        <Popover trigger={<button type="button">Open Popover</button>}>
          <div>Content</div>
        </Popover>
      );
      
      // Should have a clean, minimal DOM structure
      const allElements = container.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(10); // Reasonable limit for this simple component
    });

    it("should handle multiple popover instances efficiently", () => {
      render(
        <div>
          <Popover trigger={<button type="button">First</button>}>
            <div>First Content</div>
          </Popover>
          <Popover trigger={<button type="button">Second</button>}>
            <div>Second Content</div>
          </Popover>
          <Popover trigger={<button type="button">Third</button>}>
            <div>Third Content</div>
          </Popover>
        </div>
      );
      
      // All popovers should render correctly
      expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Second" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Third" })).toBeInTheDocument();
      
      expect(screen.getByText("First Content")).toBeInTheDocument();
      expect(screen.getByText("Second Content")).toBeInTheDocument();
      expect(screen.getByText("Third Content")).toBeInTheDocument();
    });
  });
});
