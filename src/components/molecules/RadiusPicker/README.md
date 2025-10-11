# RadiusPicker

Componente molecule que permite seleccionar y editar valores de border-radius mediante un popover interactivo.

## Versión

1.0.0

## Descripción

`RadiusPicker` es un selector de radio de borde que combina un botón trigger con preview visual y un `CssRadiusInput` dentro de un `Popover`. Permite configurar valores de border-radius con diferentes unidades CSS.

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `value` | `CssRadiusValue` | Sí | - | Valor actual del radio |
| `onChange` | `(radius: CssRadiusValue) => void` | Sí | - | Callback cuando el radio cambia |
| `name` | `string` | No | - | Nombre descriptivo del radio |
| `min` | `number` | No | - | Valor mínimo permitido |
| `max` | `number` | No | - | Valor máximo permitido |
| `step` | `number` | No | - | Incremento del slider |

## Tipo CssRadiusValue

```typescript
interface CssRadiusValue {
  value: number;
  unit: "px" | "rem" | "em" | "%";
}
```

## Uso

```tsx
import { RadiusPicker } from "@/components/molecules/RadiusPicker";

function MyComponent() {
  const [radius, setRadius] = useState({ value: 0.5, unit: "rem" });

  return (
    <RadiusPicker
      value={radius}
      onChange={setRadius}
      name="Border Radius Medium"
      min={0}
      max={5}
      step={0.25}
    />
  );
}
```

### Diferentes Unidades

```tsx
// Píxeles
<RadiusPicker
  value={{ value: 16, unit: "px" }}
  onChange={setRadius}
  name="Small"
/>

// REM
<RadiusPicker
  value={{ value: 1.5, unit: "rem" }}
  onChange={setRadius}
  name="Large"
/>

// Porcentaje (círculo)
<RadiusPicker
  value={{ value: 50, unit: "%" }}
  onChange={setRadius}
  name="Circle"
/>
```

## Estructura

``` text
RadiusPicker/
├── RadiusPicker.tsx          # Componente principal
├── RadiusPicker.module.css   # Estilos del componente
├── RadiusPicker.test.tsx     # Tests unitarios
├── index.ts                  # Exportaciones
└── README.md                # Documentación
```

## Dependencias

- `@/components/atoms/CssRadiusInput` - Input de radio CSS
- `@/components/atoms/Popover` - Contenedor del picker

## Características

- ✅ Soporte para px, rem, em, %
- ✅ Preview visual del radio en el trigger
- ✅ Control de rango (min, max, step)
- ✅ Popover interactivo
- ✅ Accesibilidad completa (ARIA labels)
- ✅ Preview box con el radio aplicado

## Preview Visual

El trigger muestra una caja de preview con el border-radius aplicado:

- Tamaño: 40x40px
- Background: `var(--surface-100)`
- Border: `2px solid var(--border-200)`
- Border-radius: Valor configurado

## Accesibilidad

- Botón trigger con `aria-label` descriptivo: "Select border radius {name}"
- Atributo `title` para tooltips
- Navegación por teclado
- Roles ARIA apropiados

## Notas

- El valor del radio se pasa al CSS mediante la variable `--radius-value`
- El componente soporta valores decimales (ej: 0.125rem)
- Los valores negativos son técnicamente soportados pero no recomendados
