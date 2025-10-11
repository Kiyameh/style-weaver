# ColorPicker

Componente molecule que permite seleccionar y editar colores en formato OKLCH mediante un popover interactivo.

## Versión

1.0.0

## Descripción

`ColorPicker` es un selector de color que combina un botón trigger visual con un `OklchColorInput` dentro de un `Popover`. Soporta tres modos de visualización (content, surface, border) y permite configurar el color de fondo del trigger.

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `value` | `Color` | Sí | - | Color actual en formato Color.js |
| `onChange` | `(color: Color) => void` | Sí | - | Callback cuando el color cambia |
| `name` | `string` | No | - | Nombre descriptivo del color |
| `background` | `Color` | No | - | Color de fondo para el trigger |
| `mode` | `"content" \| "surface" \| "border"` | No | `"surface"` | Modo de visualización del color |

## Modos de Visualización

### `content`

- El color se muestra como texto/contenido (variable `--color`)
- Background usa el color proporcionado o fallback

### `surface`

- El color se muestra como fondo (variable `--background`)
- Ideal para colores de superficie

### `border`

- El color se muestra como borde (variable `--border`)
- Útil para colores de borde

## Uso

```tsx
import { ColorPicker } from "@/components/molecules/ColorPicker";
import Color from "colorjs.io";

function MyComponent() {
  const [color, setColor] = useState(new Color("oklch", [0.7, 0.15, 180]));

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      name="Primary Color"
      mode="surface"
    />
  );
}
```

### Con Background Personalizado

```tsx
<ColorPicker
  value={contentColor}
  onChange={setContentColor}
  background={surfaceColor}
  mode="content"
  name="Text Color"
/>
```

## Estructura

``` text
ColorPicker/
├── ColorPicker.tsx          # Componente principal
├── ColorPicker.module.css   # Estilos del componente
├── ColorPicker.test.tsx     # Tests unitarios
├── index.ts                 # Exportaciones
└── README.md               # Documentación
```

## Dependencias

- `@/components/atoms/OklchColorInput` - Input de color OKLCH
- `@/components/atoms/Popover` - Contenedor del picker
- `colorjs.io` - Librería de manejo de colores

## Características

- ✅ Formato OKLCH exclusivo
- ✅ Tres modos de visualización
- ✅ Preview visual del color en el trigger
- ✅ Popover interactivo
- ✅ Accesibilidad completa (ARIA labels)
- ✅ Soporte para background personalizado

## Accesibilidad

- Botón trigger con `aria-label` descriptivo
- Atributo `title` para tooltips
- Navegación por teclado
- Roles ARIA apropiados

## Notas

- El trigger muestra el símbolo `&` como contenido
- Los colores se manejan siempre en formato OKLCH
- El componente usa CSS custom properties para aplicar los colores
