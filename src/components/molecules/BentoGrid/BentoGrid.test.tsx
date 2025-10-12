import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BentoGrid from "./BentoGrid";
import BentoItem from "./BentoItem";

describe("BentoGrid Component", () => {
  describe("Rendering", () => {
    it("renders grid with children", () => {
      render(
        <BentoGrid>
          <BentoItem>Item 1</BentoItem>
          <BentoItem>Item 2</BentoItem>
        </BentoGrid>,
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid?.tagName).toBe("DIV");
    });
  });

  describe("Column Configurations", () => {
    it("applies 3 columns by default", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gridCols3");
    });

    it("applies 2 columns when specified", () => {
      const { container } = render(
        <BentoGrid columns={2}>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gridCols2");
    });

    it("applies 4 columns when specified", () => {
      const { container } = render(
        <BentoGrid columns={4}>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gridCols4");
    });

    it("applies 6 columns when specified", () => {
      const { container } = render(
        <BentoGrid columns={6}>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gridCols6");
    });
  });

  describe("Gap Sizes", () => {
    it("applies medium gap by default", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gapMedium");
    });

    it("applies small gap when specified", () => {
      const { container } = render(
        <BentoGrid gap="small">
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gapSmall");
    });

    it("applies large gap when specified", () => {
      const { container } = render(
        <BentoGrid gap="large">
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gapLarge");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <BentoGrid data-testid="custom-grid" id="grid-1">
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = screen.getByTestId("custom-grid");
      expect(grid).toHaveAttribute("id", "grid-1");
    });

    it("applies custom className", () => {
      const { container } = render(
        <BentoGrid className="custom-class">
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid", "custom-class");
    });
  });
});

describe("BentoItem Component", () => {
  describe("Rendering", () => {
    it("renders item with children", () => {
      render(
        <BentoGrid>
          <BentoItem>Item Content</BentoItem>
        </BentoGrid>,
      );
      expect(screen.getByText("Item Content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item?.tagName).toBe("DIV");
    });
  });

  describe("Span Configuration", () => {
    it("applies column span", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem colSpan={2}>Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveStyle({ gridColumn: "span 2" });
    });

    it("applies row span", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem rowSpan={2}>Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveStyle({ gridRow: "span 2" });
    });

    it("applies both column and row span", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem colSpan={3} rowSpan={2}>
            Test
          </BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveStyle({ gridColumn: "span 3", gridRow: "span 2" });
    });
  });

  describe("Variants", () => {
    it("applies default variant by default", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem>Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveClass("itemDefault");
    });

    it("applies elevated variant when specified", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem variant="elevated">Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveClass("itemElevated");
    });

    it("applies outlined variant when specified", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem variant="outlined">Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveClass("itemOutlined");
    });
  });

  describe("Props Forwarding", () => {
    it("forwards standard div attributes", () => {
      render(
        <BentoGrid>
          <BentoItem data-testid="custom-item" id="item-1">
            Test
          </BentoItem>
        </BentoGrid>,
      );
      const item = screen.getByTestId("custom-item");
      expect(item).toHaveAttribute("id", "item-1");
    });

    it("applies custom className", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem className="custom-item-class">Test</BentoItem>
        </BentoGrid>,
      );
      const item = container.querySelector(".item");
      expect(item).toHaveClass("item", "custom-item-class");
    });
  });

  describe("Complex Layouts", () => {
    it("renders multiple items with different spans", () => {
      const { container } = render(
        <BentoGrid columns={4}>
          <BentoItem colSpan={2}>Wide Item</BentoItem>
          <BentoItem>Regular Item 1</BentoItem>
          <BentoItem>Regular Item 2</BentoItem>
          <BentoItem colSpan={4} rowSpan={2}>
            Full Width Tall Item
          </BentoItem>
        </BentoGrid>,
      );

      const items = container.querySelectorAll(".item");
      expect(items).toHaveLength(4);
    });

    it("renders items with different variants", () => {
      const { container } = render(
        <BentoGrid>
          <BentoItem variant="default">Default</BentoItem>
          <BentoItem variant="elevated">Elevated</BentoItem>
          <BentoItem variant="outlined">Outlined</BentoItem>
        </BentoGrid>,
      );

      expect(container.querySelector(".itemDefault")).toBeInTheDocument();
      expect(container.querySelector(".itemElevated")).toBeInTheDocument();
      expect(container.querySelector(".itemOutlined")).toBeInTheDocument();
    });
  });
});
