import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/contexts/ThemeContext";
import CodeBoxHeader from "./CodeBoxHeader";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: vi.fn(() => ({
    currentTheme: {
      name: "Test Theme",
      description: "Test Description",
      colorMode: "light" as const,
      mainColors: {
        surface: {},
        content: {},
        border: {},
      },
      brandColors: {},
      radius: {},
      shadows: {},
    },
    changeColorGroupName: vi.fn(),
    addColorToGroup: vi.fn(),
    removeLastColorFromGroup: vi.fn(),
    addContentColorToGroup: vi.fn(),
    removeContentColorFromGroup: vi.fn(),
    removeColorGroup: vi.fn(),
    addNewColorGroup: vi.fn(),
    updateMainColor: vi.fn(),
    updateBrandColor: vi.fn(),
  })),
}));

// Mock generateCssCode
vi.mock("@/utils/theme", () => ({
  generateCssCode: vi.fn(
    () => `/*
 * Tema: Test Theme
 * Descripción: Test Description
 * Modo de color: light
 */

:root {

}

/* Generado con StyleWeaver */`,
  ),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();

describe("CodeBoxHeader", () => {
  const defaultProps = {
    previewColors: false,
    setPreviewColors: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the useTheme mock to default behavior
    vi.mocked(useTheme).mockReturnValue({
      currentTheme: {
        name: "Test Theme",
        description: "Test Description",
        colorMode: "light" as const,
        mainColors: {
          surface: {},
          content: {},
          border: {},
        },
        brandColors: {},
        radius: {},
        shadows: {},
      },
      changeColorGroupName: vi.fn(),
      addColorToGroup: vi.fn(),
      removeLastColorFromGroup: vi.fn(),
      addContentColorToGroup: vi.fn(),
      removeContentColorFromGroup: vi.fn(),
      removeColorGroup: vi.fn(),
      addNewColorGroup: vi.fn(),
      updateMainColor: vi.fn(),
      updateBrandColor: vi.fn(),
      updateRadius: vi.fn(),
      updateShadow: vi.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders the header with toolbar role", () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const header = screen.getByRole("toolbar");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("role", "toolbar");
      expect(header).toHaveAttribute(
        "aria-label",
        "Herramientas de código CSS",
      );
    });

    it("renders all three action buttons", () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      const downloadButton = screen.getByRole("button", {
        name: /descargar código css/i,
      });
      const previewButton = screen.getByRole("button", {
        name: /mostrar vista previa/i,
      });

      expect(copyButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();
      expect(previewButton).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("renders with proper initial aria-labels", () => {
      render(<CodeBoxHeader {...defaultProps} />);

      expect(
        screen.getByLabelText("Copiar código CSS al portapapeles"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Descargar código CSS como archivo"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Mostrar vista previa de colores"),
      ).toBeInTheDocument();
    });

    it("has proper semantic structure", () => {
      const { container } = render(<CodeBoxHeader {...defaultProps} />);

      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });

    it("has live regions for status announcements", () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyStatus = document.getElementById("copy-status");
      const downloadStatus = document.getElementById("download-status");

      expect(copyStatus).toBeInTheDocument();
      expect(copyStatus).toHaveAttribute("aria-live", "polite");
      expect(downloadStatus).toBeInTheDocument();
      expect(downloadStatus).toHaveAttribute("aria-live", "polite");
    });

    it("disables buttons when no theme is provided", () => {
      vi.mocked(useTheme).mockReturnValueOnce({
        currentTheme: null,
        changeColorGroupName: vi.fn(),
        addColorToGroup: vi.fn(),
        removeLastColorFromGroup: vi.fn(),
        addContentColorToGroup: vi.fn(),
        removeContentColorFromGroup: vi.fn(),
        removeColorGroup: vi.fn(),
        addNewColorGroup: vi.fn(),
        updateMainColor: vi.fn(),
        updateBrandColor: vi.fn(),
        updateRadius: vi.fn(),
        updateShadow: vi.fn(),
      });

      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      const downloadButton = screen.getByRole("button", {
        name: /descargar código css/i,
      });

      expect(copyButton).toBeDisabled();
      expect(downloadButton).toBeDisabled();
    });

    it("preview button has proper aria-pressed state", () => {
      const { rerender } = render(
        <CodeBoxHeader {...defaultProps} previewColors={false} />,
      );

      let previewButton = screen.getByRole("button", {
        name: /mostrar vista previa/i,
      });
      expect(previewButton).toHaveAttribute("aria-pressed", "false");

      rerender(<CodeBoxHeader {...defaultProps} previewColors={true} />);
      previewButton = screen.getByRole("button", {
        name: /ocultar vista previa/i,
      });
      expect(previewButton).toHaveAttribute("aria-pressed", "true");
    });

    it("updates aria-labels during loading states", async () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(
          screen.getByLabelText("Copiando código CSS..."),
        ).toBeInTheDocument();
      });
    });

    it("announces status changes to screen readers", async () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        const copyStatus = document.getElementById("copy-status");
        expect(copyStatus).toHaveTextContent("Copiando código CSS...");
      });

      await waitFor(() => {
        const copyStatus = document.getElementById("copy-status");
        expect(copyStatus).toHaveTextContent(
          "Código CSS copiado al portapapeles",
        );
      });
    });
  });

  describe("Copy Functionality", () => {
    it("calls clipboard API when copy button is clicked", async () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          `/*
 * Tema: Test Theme
 * Descripción: Test Description
 * Modo de color: light
 */

:root {

}

/* Generado con StyleWeaver */`,
        );
      });
    });

    it("disables copy button during loading state", async () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const copyButton = screen.getByRole("button", {
        name: /copiar código css/i,
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton).toBeDisabled();
      });
    });
  });

  describe("Download Functionality", () => {
    it("creates download link when download button is clicked", async () => {
      // Mock document methods
      const mockLink: Partial<HTMLAnchorElement> = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      render(<CodeBoxHeader {...defaultProps} />);
      const createElementSpy = vi
        .spyOn(document, "createElement")
        .mockReturnValue(mockLink as HTMLAnchorElement);
      const appendChildSpy = vi
        .spyOn(document.body, "appendChild")
        .mockImplementation(() => mockLink as HTMLAnchorElement);
      const removeChildSpy = vi
        .spyOn(document.body, "removeChild")
        .mockImplementation(() => mockLink as HTMLAnchorElement);

      const downloadButton = screen.getByRole("button", {
        name: /descargar código css/i,
      });
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(createElementSpy).toHaveBeenCalledWith("a");
        expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
        expect(mockLink.click).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      });

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe("Preview Toggle", () => {
    it("calls setPreviewColors when preview button is clicked", () => {
      const setPreviewColors = vi.fn();
      render(
        <CodeBoxHeader {...defaultProps} setPreviewColors={setPreviewColors} />,
      );

      const previewButton = screen.getByRole("button", {
        name: /mostrar vista previa/i,
      });
      fireEvent.click(previewButton);

      expect(setPreviewColors).toHaveBeenCalledWith(true);
    });

    it("updates button label when preview state changes", () => {
      const { rerender } = render(
        <CodeBoxHeader {...defaultProps} previewColors={false} />,
      );

      expect(
        screen.getByLabelText("Mostrar vista previa de colores"),
      ).toBeInTheDocument();

      rerender(<CodeBoxHeader {...defaultProps} previewColors={true} />);
      expect(
        screen.getByLabelText("Ocultar vista previa de colores"),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("all buttons are focusable", () => {
      render(<CodeBoxHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });
});
