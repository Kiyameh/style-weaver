# SidebarHeader

Componente de cabecera para editar los metadatos del tema (nombre, descripción y modo de color).

## 📋 Descripción

`SidebarHeader` proporciona una interfaz para editar la información básica del tema. Sigue el mismo estilo de inputs que `ColorGroupHeader` para mantener consistencia visual.

## 🎯 Uso

```tsx
import { SidebarHeader } from "./components/SidebarHeader";

<SidebarHeader
  themeName="My Theme"
  themeDescription="A beautiful theme for my app"
  colorMode="light"
  onNameChange={(name) => updateTheme({ ...theme, name })}
  onDescriptionChange={(desc) => updateTheme({ ...theme, description: desc })}
  onColorModeChange={(mode) => updateTheme({ ...theme, colorMode: mode })}
/>
```

## 📦 Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `themeName` | `string` | Nombre actual del tema |
| `themeDescription` | `string` | Descripción actual del tema |
| `colorMode` | `"dark" \| "light" \| undefined` | Modo de color actual |
| `onNameChange` | `(newName: string) => void` | Callback cuando cambia el nombre |
| `onDescriptionChange` | `(newDescription: string) => void` | Callback cuando cambia la descripción |
| `onColorModeChange` | `(newMode: "dark" \| "light" \| undefined) => void` | Callback cuando cambia el modo de color |

## 🎨 Características

### 1. **Input de Nombre**
- Tipo: `<input type="text">`
- MaxLength: 50 caracteres
- Placeholder: "Enter theme name"
- Estilo consistente con ColorGroupHeader

### 2. **Textarea de Descripción**
- Tipo: `<textarea>`
- MaxLength: 200 caracteres
- Rows: 2 (expandible)
- Placeholder: "Enter theme description"
- Resize vertical permitido

### 3. **Select de Color Mode**
- Opciones: Auto (undefined), Light, Dark
- Estilo personalizado con variables CSS
- Background adaptable al tema

## 🎨 Estructura

```tsx
<header>
  <div> {/* Theme Name Field */}
    <label>Theme Name</label>
    <input type="text" maxLength={50} />
  </div>
  
  <div> {/* Description Field */}
    <label>Description</label>
    <textarea maxLength={200} rows={2} />
  </div>
  
  <div> {/* Color Mode Field */}
    <label>Color Mode</label>
    <select>
      <option value="">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
</header>
```

## 🎨 Estilos

Los estilos se definen en `SidebarHeader.module.css`:

- `.header`: Container principal con border-bottom
- `.field`: Wrapper para cada campo (label + input)
- `.label`: Labels en uppercase con letter-spacing
- `.input`: Input de texto sin border, focus con border-bottom
- `.textarea`: Textarea con resize vertical
- `.select`: Select con border y border-radius

### Variables CSS Usadas
- `--border-200`: Border del header y select
- `--border-300`: Border en focus
- `--content-200`: Placeholder color
- `--content-300`: Label color
- `--surface-100`: Background del select

## ♿ Accesibilidad

- ✅ Labels asociados con `htmlFor` e `id`
- ✅ Inputs con `type` apropiado
- ✅ Placeholders descriptivos
- ✅ MaxLength para prevenir inputs excesivos
- ✅ Select con opciones claras

## 🧪 Testing

El componente tiene **31 tests** que cubren:

### Rendering (5 tests)
- Todos los campos presentes
- Valores correctos en inputs
- Color mode con undefined

### Theme Name Input (3 tests)
- Callback onChange
- MaxLength de 50
- Placeholder text

### Description Textarea (4 tests)
- Callback onChange
- MaxLength de 200
- Placeholder text
- Rows attribute

### Color Mode Select (4 tests)
- Callback con 'light'
- Callback con 'dark'
- Callback con undefined (Auto)
- Todas las opciones renderizadas

### Accessibility (2 tests)
- Labels asociados correctamente
- Input types correctos

### Edge Cases (4 tests)
- Nombre vacío
- Descripción vacía
- Nombre largo (50 chars)
- Descripción larga (200 chars)

## 📊 Cobertura

```
✓ SidebarHeader (31 tests)
  ✓ Rendering (5 tests)
  ✓ Theme Name Input (3 tests)
  ✓ Description Textarea (4 tests)
  ✓ Color Mode Select (4 tests)
  ✓ Accessibility (2 tests)
  ✓ Edge Cases (4 tests)
```

## 🎯 Integración con ThemeContext

```tsx
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarHeader } from "./components/SidebarHeader";

const MyComponent = () => {
  const { currentTheme, updateTheme } = useTheme();
  
  if (!currentTheme) return null;
  
  return (
    <SidebarHeader
      themeName={currentTheme.name}
      themeDescription={currentTheme.description}
      colorMode={currentTheme.colorMode}
      onNameChange={(name) => 
        updateTheme({ ...currentTheme, name })
      }
      onDescriptionChange={(description) => 
        updateTheme({ ...currentTheme, description })
      }
      onColorModeChange={(colorMode) => 
        updateTheme({ ...currentTheme, colorMode })
      }
    />
  );
};
```

## 🔄 Flujo de Interacción

```
Usuario escribe en input de nombre
  ↓
onChange se dispara
  ↓
onNameChange(newValue) se llama
  ↓
Componente padre actualiza el tema
  ↓
Prop themeName se actualiza
  ↓
Input muestra nuevo valor
```

## 📝 Notas

- El componente es **controlado**: Depende de props para su valor
- **No maneja estado interno**: Todo el estado viene de props
- Sigue el mismo estilo visual que `ColorGroupHeader`
- Los cambios se propagan inmediatamente (sin debounce)
- MaxLength previene inputs excesivamente largos
- Color mode "Auto" se representa como `undefined`
