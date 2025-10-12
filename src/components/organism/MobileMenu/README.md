# MobileMenu

## Descripción

Componente de menú móvil desplegable con botón hamburguesa. Se muestra únicamente en dispositivos móviles (< 1024px) y contiene todas las opciones de navegación y acciones del header.

## Características

- **Botón hamburguesa**: Icono que alterna entre menú y cerrar
- **Overlay**: Fondo oscuro que cierra el menú al hacer click
- **Menú deslizante**: Aparece desde la derecha con animación suave
- **Navegación completa**: Incluye todos los botones y enlaces del header
- **Accesible**: Atributos ARIA y navegación por teclado

## Props

### `onResetTheme`

- **Tipo**: `() => void`
- **Requerido**: Sí
- **Descripción**: Función callback para resetear el tema a sus valores por defecto

## Uso

```tsx
import MobileMenu from "@/components/organism/MobileMenu";

<MobileMenu onResetTheme={handleResetTheme} />
```

## Contenido del menú

El menú muestra los siguientes elementos en orden:

1. Botón "Reset theme"
2. Botón "Library"
3. Enlace "Support" (buymeacoffee)
4. Enlace "Back to Kiyameh.com"
5. Texto de versión

## Comportamiento responsive

- **Desktop (> 1024px)**: Oculto completamente
- **Mobile (≤ 1024px)**: Visible el botón hamburguesa, menú desplegable al hacer click

## Accesibilidad

- `aria-label` descriptivo en el botón
- `aria-expanded` indica el estado del menú
- `aria-label` en la navegación
- `focus-visible` para navegación por teclado
- Overlay con `aria-hidden="true"`
