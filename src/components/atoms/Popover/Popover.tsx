import React, { useId, useMemo } from "react";
import styles from "./Popover.module.css";

/**
 * @version 2
 * @description Un componente Popover que utiliza la API nativa de HTML.
 * @param trigger - El elemento que abrirá el popover.
 * @param children - El contenido a mostrar dentro del popover.
 * @param style - Estilos en línea para la superficie del popover.
 * @param position - Posición del popover: 'bottom' (por defecto) o 'top'.
 * @param key - Clave para identificar el popover.
 */
const Popover = ({
  trigger,
  children,
  style,
  position = "bottom",
  key,
}: {
  trigger: React.ReactElement;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  position?: "bottom" | "top";
  key?: string;
}) => {
  const popoverId = useId();
  const popoverKey = useMemo(() => {
    return key;
  }, [key]);

  return (
    <div className={styles.popoverContainer}>
      {React.cloneElement(trigger, {
        popoverTarget: popoverId,
      } as React.HTMLAttributes<HTMLElement>)}

      <div
        id={popoverId}
        popover="auto"
        className={styles.popover}
        data-position={position}
        style={
          {
            "--popover-key": popoverKey,
          } as React.CSSProperties
        }
      >
        <div className={styles.popoverSurface} style={style}>
          {children ? (
            children
          ) : (
            <div className={styles.noContent}>{`no content :(`}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popover;
