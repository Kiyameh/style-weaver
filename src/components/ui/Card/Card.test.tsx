import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Card from "./Card";

describe("Card Component", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.querySelector(".card");
      expect(card?.tagName).toBe("DIV");
    });

    it("renders JSX children correctly", () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies elevated variant by default", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("card", "cardElevated");
    });

    it("applies elevated variant when explicitly set", () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("card", "cardElevated");
    });

    it("applies outlined variant correctly", () => {
      const { container } = render(<Card variant="outlined">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("card", "cardOutlined");
      expect(card).not.toHaveClass("cardElevated");
    });

    it("applies filled variant correctly", () => {
      const { container } = render(<Card variant="filled">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("card", "cardFilled");
      expect(card).not.toHaveClass("cardElevated");
    });
  });

  describe("Padding", () => {
    it("applies medium padding by default", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("paddingMedium");
    });

    it("applies none padding correctly", () => {
      const { container } = render(<Card padding="none">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("paddingNone");
      expect(card).not.toHaveClass("paddingMedium");
    });

    it("applies small padding correctly", () => {
      const { container } = render(<Card padding="small">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("paddingSmall");
    });

    it("applies medium padding when explicitly set", () => {
      const { container } = render(<Card padding="medium">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("paddingMedium");
    });

    it("applies large padding correctly", () => {
      const { container } = render(<Card padding="large">Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("paddingLarge");
    });
  });

  describe("Hoverable", () => {
    it("does not apply hoverable class by default", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).not.toHaveClass("hoverable");
    });

    it("applies hoverable class when prop is true", () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("hoverable");
    });

    it("can be clicked when hoverable", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card hoverable onClick={handleClick}>
          Clickable Card
        </Card>,
      );
      const card = container.querySelector(".card");

      if (card) {
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Combined Props", () => {
    it("can combine variant and padding", () => {
      const { container } = render(
        <Card variant="outlined" padding="large">
          Content
        </Card>,
      );
      const card = container.querySelector(".card");
      expect(card).toHaveClass("cardOutlined", "paddingLarge");
    });

    it("can combine all props", () => {
      const { container } = render(
        <Card variant="filled" padding="small" hoverable>
          Content
        </Card>,
      );
      const card = container.querySelector(".card");
      expect(card).toHaveClass("cardFilled", "paddingSmall", "hoverable");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <Card data-testid="custom-card" title="Card tooltip">
          Content
        </Card>,
      );
      const card = screen.getByTestId("custom-card");
      expect(card).toHaveAttribute("title", "Card tooltip");
    });

    it("applies custom className", () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>,
      );
      const card = container.querySelector(".card");
      expect(card).toHaveClass("card", "cardElevated", "custom-class");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(
        <Card className="class-one class-two">Content</Card>,
      );
      const card = container.querySelector(".card");
      expect(card).toHaveClass(
        "card",
        "cardElevated",
        "class-one",
        "class-two",
      );
    });

    it("forwards onClick handler", () => {
      const handleClick = vi.fn();
      const { container } = render(<Card onClick={handleClick}>Content</Card>);
      const card = container.querySelector(".card");

      if (card) {
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it("forwards onMouseEnter handler", () => {
      const handleMouseEnter = vi.fn();
      const { container } = render(
        <Card onMouseEnter={handleMouseEnter}>Content</Card>,
      );
      const card = container.querySelector(".card");

      if (card) {
        fireEvent.mouseEnter(card);
        expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Accessibility", () => {
    it("can have role attribute", () => {
      // biome-ignore lint/a11y/useSemanticElements: <testing>
      render(<Card role="article">Content</Card>);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Card aria-label="Product card">Content</Card>);
      const card = screen.getByLabelText("Product card");
      expect(card).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      const { container } = render(
        <Card aria-describedby="card-description">Content</Card>,
      );
      const card = container.querySelector(".card");
      expect(card).toHaveAttribute("aria-describedby", "card-description");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children gracefully", () => {
      const { container } = render(<Card>{""}</Card>);
      const card = container.querySelector(".card");
      expect(card).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Card>
          <header>
            <h1>Title</h1>
          </header>
          <main>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </main>
          <footer>Footer content</footer>
        </Card>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("maintains structure with all props", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card
          variant="outlined"
          padding="large"
          hoverable
          onClick={handleClick}
          className="custom"
          data-testid="full-card"
        >
          Full featured card
        </Card>,
      );

      const card = container.querySelector(".card");
      expect(card).toHaveClass(
        "cardOutlined",
        "paddingLarge",
        "hoverable",
        "custom",
      );
      expect(screen.getByTestId("full-card")).toBeInTheDocument();
    });
  });
});
