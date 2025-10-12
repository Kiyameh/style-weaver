import {
  AlertCircle,
  CheckCircle,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { useMemo } from "react";
import s from "./Alert.module.css";
import type { AlertProps } from "./types";

const Alert = ({
  children,
  variant = "info",
  title,
  onClose,
  icon,
  className,
  ...props
}: AlertProps) => {
  const alertClass = useMemo(() => {
    const baseClass = (() => {
      switch (variant) {
        case "info":
          return `${s.alert} ${s.alertInfo}`;
        case "success":
          return `${s.alert} ${s.alertSuccess}`;
        case "warning":
          return `${s.alert} ${s.alertWarning}`;
        case "error":
          return `${s.alert} ${s.alertError}`;
      }
    })();

    return className ? `${baseClass} ${className}` : baseClass;
  }, [variant, className]);

  const defaultIcon = useMemo(() => {
    if (icon !== undefined) return icon;

    switch (variant) {
      case "info":
        return <Info size={20} aria-hidden="true" />;
      case "success":
        return <CheckCircle size={20} aria-hidden="true" />;
      case "warning":
        return <TriangleAlert size={20} aria-hidden="true" />;
      case "error":
        return <AlertCircle size={20} aria-hidden="true" />;
    }
  }, [variant, icon]);

  const ariaRole = variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <div {...props} className={alertClass} role={ariaRole}>
      {defaultIcon && <span className={s.icon}>{defaultIcon}</span>}
      <div className={s.content}>
        {title && <div className={s.title}>{title}</div>}
        <div className={s.message}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className={s.closeButton}
          onClick={onClose}
          aria-label="Close alert"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Alert;
