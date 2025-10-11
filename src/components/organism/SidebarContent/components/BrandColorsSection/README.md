# BrandColorsSection

Componente que gestiona los colores de marca personalizables del tema.

## 📋 Descripción

`BrandColorsSection` permite crear y editar grupos de colores de marca con nombres personalizados. A diferencia de MainColorsSection, aquí los grupos son completamente editables.

## 🎯 Uso

```tsx
import { BrandColorsSection } from "./components/BrandColorsSection";

<BrandColorsSection />
```

## 🎨 Características

### 1. **Nombres Editables**

- Click en el nombre para editar
- Máximo 14 caracteres
- Icono de lápiz indica editabilidad
- Enter o blur para guardar

### 2. **Variante Content**

- Checkbox para agregar/quitar variante "content"
- Content variant se ordena primero
- Útil para colores de texto sobre fondos de marca

### 3. **Gestión de Variantes**

- Agregar/eliminar variantes (1-10)
- ColorPicker por cada variante
- Contador de variantes

## 📦 Dependencias

### Hooks

- `useTheme`: Contexto del tema
- `useEditableGroupName`: Hook personalizado para edición de nombres

### Componentes

- `ColorGroupHeader`: Header reutilizable con controles
- `ColorPicker`: Selector de color

### Utilidades

- `DEFAULT_LIGHTNESS_INCREMENT`: Incremento de luminosidad
- `getNumericVariantCount`: Cuenta variantes numéricas
- `sortColorsWithContentFirst`: Ordena colores

## 🔧 Funcionalidad

### Editar Nombre

```tsx
const handleNameChange = (oldName: string, newName: string) => {
  changeColorGroupName(oldName, newName);
  cancelEditing();
};
```

### Toggle Content

```tsx
const handleContentToggle = (groupName: string, checked: boolean) => {
  if (checked) {
    addContentColorToGroup(groupName);
  } else {
    removeContentColorFromGroup(groupName);
  }
};
```

## 🧪 Testing

**20 tests** cubriendo:

- Rendering (6 tests)
- Variant Controls (2 tests)
- Name Editing (3 tests)
- Content Checkbox (4 tests)
- Color Updates (2 tests)
- Color Sorting (1 test)
- Edge Cases (2 tests)

## 🎯 Ejemplo

```tsx
brandColors: {
  primary: {
    100: Color("oklch", [0.9, 0.2, 260]),
    200: Color("oklch", [0.7, 0.2, 260]),
    content: Color("oklch", [0.1, 0.05, 260]),
  },
  secondary: {
    100: Color("oklch", [0.8, 0.15, 180]),
  }
}
```

## 📝 Notas

- Usa `ColorGroupHeader` para UI consistente
- Nombres de grupos son únicos
- Hook `useEditableGroupName` gestiona estado de edición
- Checkbox de content es opcional por grupo
