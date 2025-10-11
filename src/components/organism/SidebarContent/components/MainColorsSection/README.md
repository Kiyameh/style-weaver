# MainColorsSection

Componente que gestiona los colores principales del tema (surface, content, border).

## 📋 Descripción

`MainColorsSection` permite editar los tres grupos de colores principales del sistema de diseño:

- **surface**: Colores de fondo y superficies
- **content**: Colores de texto y contenido
- **border**: Colores de bordes

## 🎯 Uso

```tsx
import { MainColorsSection } from "./components/MainColorsSection";

<MainColorsSection />
```

## 🎨 Características

### 1. **Gestión de Variantes**

- Agregar variantes con botón **+** (máximo 10)
- Eliminar variantes con botón **-** (mínimo 1)
- Contador de variantes por grupo

### 2. **ColorPicker por Variante**

- Cada color tiene su propio ColorPicker
- Preview en tiempo real
- Modo específico por tipo (surface/content/border)

### 3. **Ordenamiento Automático**

- Variante "content" siempre aparece primero
- Variantes numéricas ordenadas después

## 📦 Dependencias

### Contexto

- `useTheme`: Acceso al tema actual y funciones de actualización

### Componentes

- `ColorPicker`: Selector de color individual

### Utilidades

- `DEFAULT_LIGHTNESS_INCREMENT`: Incremento de luminosidad para nuevas variantes
- `getNumericVariantCount`: Cuenta variantes numéricas
- `sortColorsWithContentFirst`: Ordena colores con content primero

## 🔧 Funcionalidad

### Agregar Variante

```tsx
const handleVariantAdd = (groupName: string) => {
  addColorToGroup(groupName, false, DEFAULT_LIGHTNESS_INCREMENT);
};
```

### Eliminar Variante

```tsx
const handleVariantRemove = (groupName: string) => {
  removeLastColorFromGroup(groupName, false);
};
```

### Actualizar Color

```tsx
const createMainColorChangeHandler = (
  colorGroup: keyof Theme["mainColors"],
  colorKey: string | number,
) => {
  return (newColor: Color) => updateMainColor(colorGroup, colorKey, newColor);
};
```

## 🎨 Estructura

```tsx
<section>
  <h3>Main Colors</h3>
  
  {/* Por cada grupo (surface, content, border) */}
  <div>
    <header>
      <h4>{groupName}</h4>
      <div>
        <button>-</button>
        <span>{count} Variants</span>
        <button>+</button>
      </div>
    </header>
    
    <div>
      {/* ColorPicker por cada variante */}
      <ColorPicker ... />
    </div>
  </div>
</section>
```

## ♿ Accesibilidad

- ✅ Botones con `type="button"`
- ✅ Botones deshabilitados en límites
- ✅ ColorPickers con `aria-label` descriptivos
- ✅ Estructura semántica con `<header>` y `<section>`

## 🧪 Testing

El componente tiene **16 tests** que cubren:

### Rendering (6 tests)

- Título de sección
- Grupos de colores
- Contador de variantes
- ColorPickers
- Botones de control
- Null theme

### Variant Controls (5 tests)

- Agregar variantes
- Eliminar variantes
- Deshabilitar botones en límites
- No llamar funciones cuando está deshabilitado

### Color Updates (2 tests)

- Abrir popover de ColorPicker
- Renderizar labels correctos

### Color Sorting (1 test)

- Content variant primero

### Edge Cases (2 tests)

- Grupos vacíos
- Grupos con claves mixtas (numeric + content)

## 📊 Cobertura

``` list
✓ MainColorsSection (16 tests)
  ✓ Rendering (6 tests)
  ✓ Variant Controls (5 tests)
  ✓ Color Updates (2 tests)
  ✓ Color Sorting (1 test)
  ✓ Edge Cases (2 tests)
```

## 🎯 Casos de Uso

### Tema Básico

```tsx
mainColors: {
  surface: {
    100: Color("oklch", [1, 0, 0]),
    200: Color("oklch", [0.9, 0, 0]),
  },
  content: {
    100: Color("oklch", [0.2, 0, 0]),
  },
  border: {
    100: Color("oklch", [0.5, 0, 0]),
  }
}
```

### Con Variante Content

```tsx
mainColors: {
  surface: {
    100: Color("oklch", [1, 0, 0]),
    200: Color("oklch", [0.9, 0, 0]),
    content: Color("oklch", [0.1, 0, 0]), // Aparece primero
  },
  // ...
}
```

## 🔄 Flujo de Interacción

``` list
Usuario hace click en ColorPicker
  ↓
Se abre Popover con controles
  ↓
Usuario ajusta Hue/Chroma/Lightness
  ↓
onChange se dispara
  ↓
updateMainColor actualiza el tema
  ↓
Preview se actualiza en tiempo real
```

## 📝 Notas

- Los grupos son **fijos**: surface, content, border
- Los nombres de grupos **no son editables** (a diferencia de BrandColorsSection)
- Las variantes se identifican por **números** (100, 200, 300...) o "content"
- El incremento de luminosidad se usa al agregar nuevas variantes
- Los colores se ordenan automáticamente con "content" primero
