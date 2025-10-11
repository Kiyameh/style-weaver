# ShadowPicker

Componente molecule que permite seleccionar y editar valores de box-shadow mediante un popover interactivo.

## Versión

1.0.0

## Descripción

`ShadowPicker` es un selector de sombra que combina un botón trigger con la sombra aplicada visualmente y un `CssShadowInput` dentro de un `Popover`. Soporta todas las propiedades de box-shadow incluyendo offset, blur, spread, color e inset.

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `value` | `CssShadowValue` | Sí | - | Valor actual de la sombra |
| `onChange` | `(shadow: CssShadowValue) => void` | Sí | - | Callback cuando la sombra cambia |
| `name` | `string` | No | - | Nombre descriptivo de la sombra |
| `showBlur` | `boolean` | No | `true` | Mostrar control de blur |
| `showSpread` | `boolean` | No | `false` | Mostrar control de spread |
| `min` | `number` | No | - | Valor mínimo para offsets |
| `max` | `number` | No | - | Valor máximo para offsets |
| `step` | `number` | No | - | Incremento de los sliders |

## Tipo CssShadowValue

```typescript
interface CssShadowValue {
  offsetX: { value: number; unit: CssUnit };
  offsetY: { value: number; unit: CssUnit };
  blur?: { value: number; unit: CssUnit };
  spread?: { value: number; unit: CssUnit };
  color: Color;
  inset: boolean;
}

type CssUnit = "px" | "rem" | "em" | "%";
```

## Uso

```tsx
import { ShadowPicker } from "@/components/molecules/ShadowPicker";
import Color from "colorjs.io";

function MyComponent() {
  const [shadow, setShadow] = useState({
    offsetX: { value: 2, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0.5, 0.1, 200]),
    inset: false,
  });

  return (
    <ShadowPicker
      value={shadow}
      onChange={setShadow}
      name="Card Shadow"
      showBlur={true}
      showSpread={false}
    />
  );
}
```

### Con Spread

```tsx
<ShadowPicker
  value={{
    offsetX: { value: 0, unit: "px" },
    offsetY: { value: 4, unit: "px" },
    blur: { value: 8, unit: "px" },
    spread: { value: 2, unit: "px" },
    color: new Color("oklch", [0.3, 0.1, 200], 0.5),
    inset: false,
  }}
  onChange={setShadow}
  name="Elevated Shadow"
  showSpread={true}
/>
```

### Sombra Inset

```tsx
<ShadowPicker
  value={{
    offsetX: { value: 0, unit: "px" },
    offsetY: { value: 2, unit: "px" },
    blur: { value: 4, unit: "px" },
    color: new Color("oklch", [0, 0, 0], 0.1),
    inset: true,
  }}
  onChange={setShadow}
  name="Inner Shadow"
/>
```

## Estructura

``` text
ShadowPicker/
├── ShadowPicker.tsx          # Componente principal
├── ShadowPicker.module.css   # Estilos del componente
├── ShadowPicker.test.tsx     # Tests unitarios
├── index.ts                  # Exportaciones
└── README.md                # Documentación
```

## Dependencias

- `@/components/atoms/CssShadowInput` - Input de sombra CSS
- `@/components/atoms/Popover` - Contenedor del picker
- `colorjs.io` - Librería de manejo de colores

## Características

- ✅ Soporte completo de box-shadow CSS
- ✅ Formato OKLCH para colores
- ✅ Preview visual de la sombra en el trigger
- ✅ Control de offset X/Y, blur, spread
- ✅ Soporte para sombras inset
- ✅ Transparencia (alpha channel)
- ✅ Popover de 480px de ancho
- ✅ Accesibilidad completa

## Generación de String CSS

El componente genera automáticamente el string CSS de la sombra:

```css
/* Sombra básica */
2px 2px 4px oklch(0.50 0.10 200 / 1.00)

/* Con inset */
inset 0 2px 4px oklch(0.30 0.05 200 / 0.50)

/* Con spread */
0 4px 8px 2px oklch(0.20 0.10 220 / 0.80)
```

## Preview Visual

El trigger muestra la sombra aplicada directamente:

- Tamaño: 40x40px
- Background: `var(--surface-100)`
- Border: `2px solid var(--border-200)`
- Box-shadow: Valor configurado

## Accesibilidad

- Botón trigger con `aria-label` descriptivo: "Select box shadow {name}"
- Atributo `title` para tooltips
- Navegación por teclado
- Roles ARIA apropiados

## Formato de Color

El componente usa exclusivamente formato OKLCH:

- Lightness: 0-1
- Chroma: 0-0.4 típicamente
- Hue: 0-360 grados
- Alpha: 0-1 (incluido en el formato cuando < 1)

## Notas

- El popover tiene un ancho máximo de 480px para acomodar el layout de dos columnas
- Los colores siempre se formatean en OKLCH, nunca en RGBA
- Los valores de offset pueden ser negativos
- El blur siempre tiene un mínimo de 0
