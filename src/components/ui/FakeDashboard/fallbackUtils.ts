import type { Theme } from "@/types/Theme";

/**
 * Obtiene un color de un grupo con fallback automático
 * @param theme - Tema actual
 * @param group - Grupo de color (ej: 'surface', 'primary', 'error')
 * @param variant - Variante deseada (ej: '100', '200', 'content')
 * @returns Variable CSS con fallback
 */
export function getColorWithFallback(
  theme: Theme,
  group: string,
  variant: string | number,
): string {
  // Determinar si es mainColor o brandColor
  const isMainColor = ["surface", "content", "border"].includes(group);
  const colorGroup = isMainColor
    ? theme.mainColors[group as keyof typeof theme.mainColors]
    : theme.brandColors[group];

  // Si el grupo no existe, usar fallback
  if (!colorGroup) {
    if (isMainColor) {
      // Fallback para mainColors: usar surface-100
      return "var(--surface-100, #ffffff)";
    }
    // Fallback para brandColors: usar primary-100
    return "var(--primary-100, #8b5cf6)";
  }

  // Si la variante existe, usarla directamente
  if (colorGroup[variant]) {
    return `var(--${group}-${variant})`;
  }

  // Lógica de fallback para variantes
  if (variant === "content") {
    // Fallback para -content de brandColors: usar content-100 de mainColors
    if (!isMainColor) {
      return "var(--content-100, #333333)";
    }
    // Si es mainColor content y no existe, usar content-100
    return "var(--content-100, #333333)";
  }

  // Fallback para variantes numéricas: buscar la variante más cercana inferior
  const numericVariant = Number(variant);
  if (!Number.isNaN(numericVariant)) {
    const availableVariants = Object.keys(colorGroup)
      .filter((key) => !Number.isNaN(Number(key)))
      .map(Number)
      .sort((a, b) => a - b);

    // Buscar la variante más cercana inferior
    const fallbackVariant = availableVariants
      .reverse()
      .find((v) => v <= numericVariant);

    if (fallbackVariant !== undefined) {
      return `var(--${group}-${fallbackVariant})`;
    }

    // Si no hay variante inferior, usar la primera disponible
    if (availableVariants.length > 0) {
      return `var(--${group}-${availableVariants[0]})`;
    }

    // Último fallback: usar 100
    return `var(--${group}-100, #cccccc)`;
  }

  // Fallback genérico
  return `var(--${group}-100, #cccccc)`;
}

/**
 * Obtiene un valor de radius con fallback
 * @param theme - Tema actual
 * @param size - Tamaño deseado (sm, md, lg, xl)
 * @returns Variable CSS con fallback
 */
export function getRadiusWithFallback(theme: Theme, size: string): string {
  if (theme.radius[size]) {
    return `var(--radius-${size})`;
  }

  // Fallback: buscar el tamaño más cercano
  const sizes = ["sm", "md", "lg", "xl"];
  const currentIndex = sizes.indexOf(size);

  if (currentIndex > 0) {
    // Buscar hacia abajo
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (theme.radius[sizes[i]]) {
        return `var(--radius-${sizes[i]})`;
      }
    }
  }

  // Buscar hacia arriba
  for (let i = currentIndex + 1; i < sizes.length; i++) {
    if (theme.radius[sizes[i]]) {
      return `var(--radius-${sizes[i]})`;
    }
  }

  // Fallback final
  return "var(--radius-md, 0.5rem)";
}

/**
 * Obtiene un valor de shadow con fallback
 * @param theme - Tema actual
 * @param size - Tamaño deseado (sm, md, lg, xl)
 * @returns Variable CSS con fallback
 */
export function getShadowWithFallback(theme: Theme, size: string): string {
  if (theme.shadows[size]) {
    return `var(--shadow-${size})`;
  }

  // Fallback: buscar el tamaño más cercano
  const sizes = ["sm", "md", "lg", "xl"];
  const currentIndex = sizes.indexOf(size);

  if (currentIndex > 0) {
    // Buscar hacia abajo
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (theme.shadows[sizes[i]]) {
        return `var(--shadow-${sizes[i]})`;
      }
    }
  }

  // Buscar hacia arriba
  for (let i = currentIndex + 1; i < sizes.length; i++) {
    if (theme.shadows[sizes[i]]) {
      return `var(--shadow-${sizes[i]})`;
    }
  }

  // Fallback final
  return "var(--shadow-md, 0 0 1rem 0px rgba(0, 0, 0, 0.2))";
}
