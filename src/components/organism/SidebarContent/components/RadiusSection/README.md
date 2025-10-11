# RadiusSection

Componente que gestiona las variantes de border radius del tema.

## 📋 Descripción

`RadiusSection` permite crear y editar variantes de border radius con keys estándar (sm, md, lg, xl, 2xl, etc.).

## 🎯 Uso

```tsx
import { RadiusSection } from "./components/RadiusSection";

<RadiusSection />
```

## 🎨 Características

### 1. **Generación Automática de Keys**

- Usa keys estándar: sm, md, lg, xl, 2xl, 3xl...
- Genera automáticamente 8xl, 9xl, 10xl si se necesita
- Máximo 10 variantes

### 2. **RadiusPicker**

- Selector visual de border radius
- Unidades: px, rem, em
- Preview en tiempo real

### 3. **Gestión de Variantes**

- Agregar/eliminar variantes (1-10)
- Copia valor de última variante al agregar
- Valor por defecto: 0.5rem

## 📦 Dependencias

### Componentes

- `RadiusPicker`: Selector de radius

### Utilidades

- `parseRadiusString`: Parsea string CSS a objeto
- `formatRadiusValue`: Formatea objeto a string CSS
- `generateNextKey`: Genera siguiente key
- `getKeysToRemove`: Determina keys a eliminar
- `SIZE_KEYS`: Array de keys estándar

## 🔧 Funcionalidad

### Agregar Variante

```tsx
const handleRadiusVariantAdd = () => {
  const currentKeys = Object.keys(currentTheme.radius);
  const nextKey = generateNextKey(currentKeys, SIZE_KEYS);
  const defaultValue = currentKeys.length > 0
    ? currentTheme.radius[currentKeys[currentKeys.length - 1]]
    : "0.5rem";
  updateRadius(nextKey, defaultValue);
};
```

### Actualizar Radius

```tsx
const createRadiusChangeHandler = (key: string) => {
  return (newRadius: ReturnType<typeof parseRadiusString>) => {
    const radiusString = formatRadiusValue(newRadius);
    updateRadius(key, radiusString);
  };
};
```

## 🧪 Testing

**17 tests** cubriendo:

- Rendering (4 tests)
- Variant Controls (7 tests)
- Radius Updates (2 tests)
- Edge Cases (4 tests)

## 🎯 Ejemplo

```tsx
radius: {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "1.5rem"
}
```

## 📝 Notas

- Keys son generadas automáticamente
- Valores se copian de la última variante
- Soporta px, rem, em como unidades
- Máximo 10 variantes por limitación de UI
