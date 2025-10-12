import { User } from "lucide-react";
import { useMemo, useState } from "react";
import s from "./Avatar.module.css";
import type { AvatarProps } from "./types";

const Avatar = ({
  src,
  alt = "Avatar",
  fallback,
  size = "medium",
  variant = "circle",
  className,
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const avatarClass = useMemo(() => {
    const sizeClass = (() => {
      switch (size) {
        case "small":
          return `${s.avatar} ${s.avatarSmall}`;
        case "medium":
          return `${s.avatar} ${s.avatarMedium}`;
        case "large":
          return `${s.avatar} ${s.avatarLarge}`;
        case "xlarge":
          return `${s.avatar} ${s.avatarXlarge}`;
      }
    })();

    const variantClass = variant === "square" ? s.avatarSquare : s.avatarCircle;

    const classes = [sizeClass, variantClass].filter(Boolean).join(" ");

    return className ? `${classes} ${className}` : classes;
  }, [size, variant, className]);

  const showImage = src && !imageError;
  const showFallback = !showImage && fallback;
  const showIcon = !showImage && !fallback;

  const getFallbackInitials = () => {
    if (!fallback) return "";
    return fallback
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div {...props} className={avatarClass} role="img" aria-label={alt}>
      {showImage && (
        <img
          src={src}
          alt={alt}
          className={s.image}
          onError={() => setImageError(true)}
        />
      )}
      {showFallback && (
        <span className={s.fallback} aria-hidden="true">
          {getFallbackInitials()}
        </span>
      )}
      {showIcon && <User className={s.icon} aria-hidden="true" />}
    </div>
  );
};

export default Avatar;
