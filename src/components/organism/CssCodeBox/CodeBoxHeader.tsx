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
  return (
    <header className={s.header}>
      <button type="button" className={s.iconButton} onClick={handleCopy}>
        {getCopyIcon()}
      </button>
      <button type="button" className={s.iconButton} onClick={handleDownload}>
        {getDownloadIcon()}
      </button>
      <button
        type="button"
        className={s.iconButton}
        onClick={() => setPreviewColors(!previewColors)}
      >
        {previewColors ? <Eye size={22} /> : <EyeClosed size={22} />}
      </button>
    </header>
  );
};

export default CodeBoxHeader;
