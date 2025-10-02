import {
  Check,
  Clipboard,
  ClipboardCheck,
  Download,
  Eye,
  EyeClosed,
  Loader,
} from "lucide-react";
import { useState } from "react";
import s from "./CodeBoxHeader.module.css";

const CodeBoxHeader = ({
  cssCode,
  previewColors,
  setPreviewColors,
}: {
  cssCode?: string;
  previewColors: boolean;
  setPreviewColors: (value: boolean) => void;
}) => {
  const [copyState, setCopyState] = useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [downloadState, setDownloadState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const handleCopy = async () => {
    if (!cssCode || copyState !== "idle") return;

    setCopyState("loading");

    try {
      await navigator.clipboard.writeText(cssCode);
      setCopyState("success");

      // Reset to idle after 1 second
      setTimeout(() => {
        setCopyState("idle");
      }, 1000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setCopyState("idle");
    }
  };

  const handleDownload = () => {
    if (!cssCode || downloadState !== "idle") return;

    setDownloadState("loading");

    try {
      const blob = new Blob([cssCode], { type: "text/css" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "theme.css";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadState("success");

      // Reset to idle after 1 second
      setTimeout(() => {
        setDownloadState("idle");
      }, 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
      setDownloadState("idle");
    }
  };

  const getCopyIcon = () => {
    switch (copyState) {
      case "loading":
        return <Loader size={22} className={s.spin} />;
      case "success":
        return <ClipboardCheck size={22} />;
      default:
        return <Clipboard size={22} />;
    }
  };

  const getDownloadIcon = () => {
    switch (downloadState) {
      case "loading":
        return <Loader size={22} className={s.spin} />;
      case "success":
        return <Check size={22} />;
      default:
        return <Download size={22} />;
    }
  };
  // Get accessible labels for buttons based on current state
  const getCopyLabel = () => {
    switch (copyState) {
      case "loading":
        return "Copiando código CSS...";
      case "success":
        return "Código CSS copiado exitosamente";
      default:
        return "Copiar código CSS al portapapeles";
    }
  };

  const getDownloadLabel = () => {
    switch (downloadState) {
      case "loading":
        return "Descargando archivo CSS...";
      case "success":
        return "Archivo CSS descargado exitosamente";
      default:
        return "Descargar código CSS como archivo";
    }
  };

  const getPreviewLabel = () => {
    return previewColors
      ? "Ocultar vista previa de colores"
      : "Mostrar vista previa de colores";
  };

  return (
    <header
      className={s.header}
      role="toolbar"
      aria-label="Herramientas de código CSS"
    >
      <button
        type="button"
        className={s.iconButton}
        onClick={handleCopy}
        aria-label={getCopyLabel()}
        aria-describedby={copyState !== "idle" ? "copy-status" : undefined}
        disabled={!cssCode || copyState === "loading"}
      >
        {getCopyIcon()}
        <span className={s.srOnly}>{getCopyLabel()}</span>
      </button>

      <button
        type="button"
        className={s.iconButton}
        onClick={handleDownload}
        aria-label={getDownloadLabel()}
        aria-describedby={
          downloadState !== "idle" ? "download-status" : undefined
        }
        disabled={!cssCode || downloadState === "loading"}
      >
        {getDownloadIcon()}
        <span className={s.srOnly}>{getDownloadLabel()}</span>
      </button>

      <button
        type="button"
        className={s.iconButton}
        onClick={() => setPreviewColors(!previewColors)}
        aria-label={getPreviewLabel()}
        aria-pressed={previewColors}
      >
        {previewColors ? <Eye size={22} /> : <EyeClosed size={22} />}
        <span className={s.srOnly}>{getPreviewLabel()}</span>
      </button>

      {/* Live region for status announcements */}
      <output id="copy-status" className={s.srOnly} aria-live="polite">
        {copyState === "success" && "Código CSS copiado al portapapeles"}
        {copyState === "loading" && "Copiando código CSS..."}
      </output>

      <output id="download-status" className={s.srOnly} aria-live="polite">
        {downloadState === "success" && "Archivo CSS descargado"}
        {downloadState === "loading" && "Descargando archivo CSS..."}
      </output>
    </header>
  );
};

export default CodeBoxHeader;

// Named export for testing
export { CodeBoxHeader };
