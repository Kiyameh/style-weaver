# ThemeCard Component

Tarjeta que muestra la información de un tema guardado con opciones para cargarlo o eliminarlo.

## Características

- **Visualización completa**: Muestra nombre, descripción, modo de color, proyecto y estadísticas del tema
- **Carga rápida**: Botón para cargar el tema en el editor
- **Eliminación con confirmación**: Sistema de confirmación de dos pasos para evitar eliminaciones accidentales
- **Estadísticas visuales**: Muestra contadores de colores, sombras y radius

## Uso

```tsx
import ThemeCard from "@/components/organism/Library/components/ThemeCard";

<ThemeCard
  savedTheme={savedTheme}
  isActive={false}
  onDelete={(id) => console.log("Delete:", id)}
  onLoad={(theme) => console.log("Load:", theme)}
/>
```

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `savedTheme` | `SavedTheme` | Tema guardado a mostrar |
| `isActive` | `boolean` | Si el tema está actualmente activo (opcional) |
| `onDelete` | `(id: string) => void` | Callback cuando se confirma la eliminación |
| `onLoad` | `(theme: Theme) => void` | Callback cuando se carga el tema |

## Comportamiento de eliminación

1. Usuario hace clic en el botón de basura (Trash2)
2. El botón muestra una animación de pulso y el icono cambia a check (Check)
3. El usuario tiene 2 segundos para confirmar haciendo clic en el check
4. Si confirma: se ejecuta `onDelete` con el ID del tema
5. Si no confirma: el icono vuelve a basura automáticamente

## Estadísticas mostradas

- **Main colors**: Número de colores principales (surface, content, border)
- **Brand colors**: Número de colores de marca (primary, secondary, accent, neutral)
- **Shadows**: Número de variantes de sombra
- **Radius**: Número de variantes de border-radius

## Accesibilidad

- Usa elemento semántico `<article>` para la tarjeta
- Botones con `aria-label` descriptivos
- Los labels cambian según el estado de confirmación
- Iconos marcados con `aria-hidden="true"`

## Estilos

- Fondo con borde redondeado
- Hover state con elevación
- Animación pulse en estado de confirmación
- Colores de error para el botón de eliminar
- Colores de accent para el estado de confirmación
