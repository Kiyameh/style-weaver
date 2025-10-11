# ShadowsSection

Componente que gestiona las variantes de box shadow del tema.

## 📋 Descripción

`ShadowsSection` permite crear y editar variantes de box shadow con keys estándar y control completo de propiedades.

## 🎯 Uso

```tsx
import { ShadowsSection } from "./components/ShadowsSection";

<ShadowsSection />
```

## 🎨 Características

### 1. **Generación Automática de Keys**

- Usa keys estándar: sm, md, lg, xl, 2xl, 3xl...
- Genera automáticamente 8xl, 9xl, 10xl si se necesita
- Máximo 10 variantes

### 2. **ShadowPicker**

- Control de offsetX, offsetY, blur, spread
- Selector de color con alpha
- Toggle inset/outset
- Preview en tiempo real

### 3. **Gestión de Variantes**

- Agregar/eliminar variantes (1-10)
- Copia valor de última variante al agregar
- Valor por defecto: "0 2px 4px oklch(0 0 0 / 0.1)"

## 📦 Dependencias

### Componentes

- `ShadowPicker`: Selector de shadow

### Utilidades

- `parseShadowString`: Parsea string CSS a objeto
- `formatShadowValue`: Formatea objeto a string CSS
- `generateNextKey`: Genera siguiente key
- `getKeysToRemove`: Determina keys a eliminar
- `SIZE_KEYS`: Array de keys estándar

## 🔧 Funcionalidad

### Agregar Variante

```tsx
const handleShadowVariantAdd = () => {
  const currentKeys = Object.keys(currentTheme.shadows);
  const nextKey = generateNextKey(currentKeys, SIZE_KEYS);
  const defaultValue = currentKeys.length > 0
    ? currentTheme.shadows[currentKeys[currentKeys.length - 1]]
    : "0 2px 4px oklch(0 0 0 / 0.1)";
  updateShadow(nextKey, defaultValue);
};
```

### Actualizar Shadow

```tsx
const createShadowChangeHandler = (key: string) => {
  return (newShadow: ReturnType<typeof parseShadowString>) => {
    const shadowString = formatShadowValue(newShadow);
    updateShadow(key, shadowString);
  };
};
```

## 🧪 Testing

**18 tests** cubriendo:

- Rendering (4 tests)
- Variant Controls (7 tests)
- Shadow Updates (2 tests)
- Edge Cases (5 tests)

## 🎯 Ejemplo

```tsx
shadows: {
  sm: "0 1px 2px oklch(0 0 0 / 0.1)",
  md: "0 2px 4px oklch(0 0 0 / 0.1)",
  lg: "0 4px 8px oklch(0 0 0 / 0.1)",
  inset: "inset 0 2px 4px oklch(0 0 0 / 0.2)"
}
```

## 📝 Notas

- Keys son generadas automáticamente
- Valores se copian de la última variante
- Soporta inset shadows
- Colores en formato OKLCH con alpha
- Unidades en px para offsets y blur
