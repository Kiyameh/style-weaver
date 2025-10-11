# ColorGroupHeader

Componente reutilizable que renderiza el header de un grupo de colores con controles de variantes y opciones de edición.

## 📋 Descripción

`ColorGroupHeader` es un componente que proporciona una interfaz consistente para gestionar grupos de colores. Incluye:

- Nombre del grupo (editable o estático)
- Controles para agregar/eliminar variantes (+/-)
- Contador de variantes
- Checkbox opcional para variante "content"

## 🎯 Uso

### Básico (No editable)

```tsx
import { ColorGroupHeader } from "./components/ColorGroupHeader";

<ColorGroupHeader
  groupName="primary"
  currentCount={5}
  onVariantAdd={() => handleAdd()}
  onVariantRemove={() => handleRemove()}
/>
```

### Con nombre editable

```tsx
<ColorGroupHeader
  groupName="primary"
  currentCount={5}
  editable={true}
  isEditing={isEditing}
  tempName={tempName}
  onEditStart={() => setIsEditing(true)}
  onTempNameChange={setTempName}
  onNameChange={(newName) => handleNameChange(newName)}
  onVariantAdd={() => handleAdd()}
  onVariantRemove={() => handleRemove()}
/>
```

### Con checkbox de content

```tsx
<ColorGroupHeader
  groupName="primary"
  currentCount={5}
  showContentCheckbox={true}
  hasContent={hasContent}
  onContentToggle={(checked) => handleContentToggle(checked)}
  onVariantAdd={() => handleAdd()}
  onVariantRemove={() => handleRemove()}
/>
```

### Completo (Todas las opciones)

```tsx
<ColorGroupHeader
  groupName="primary"
  currentCount={5}
  maxVariants={10}
  minVariants={1}
  editable={true}
  isEditing={isEditing}
  tempName={tempName}
  showContentCheckbox={true}
  hasContent={hasContent}
  onEditStart={() => setIsEditing(true)}
  onTempNameChange={setTempName}
  onNameChange={(newName) => handleNameChange(newName)}
  onContentToggle={(checked) => handleContentToggle(checked)}
  onVariantAdd={() => handleAdd()}
  onVariantRemove={() => handleRemove()}
/>
```

## 📦 Props

### Requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `groupName` | `string` | Nombre del grupo de colores |
| `currentCount` | `number` | Número actual de variantes |
| `onVariantAdd` | `() => void` | Callback cuando se agrega una variante |
| `onVariantRemove` | `() => void` | Callback cuando se elimina una variante |

### Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `maxVariants` | `number` | `10` | Máximo de variantes permitidas |
| `minVariants` | `number` | `1` | Mínimo de variantes permitidas |
| `editable` | `boolean` | `false` | Si el nombre es editable |
| `isEditing` | `boolean` | `false` | Si está en modo edición |
| `tempName` | `string` | `""` | Nombre temporal mientras se edita |
| `onEditStart` | `() => void` | - | Callback cuando inicia la edición |
| `onTempNameChange` | `(name: string) => void` | - | Callback cuando cambia el nombre temporal |
| `onNameChange` | `(newName: string) => void` | - | Callback cuando se confirma el nuevo nombre |
| `showContentCheckbox` | `boolean` | `false` | Si mostrar checkbox de content |
| `hasContent` | `boolean` | `false` | Si tiene variante content |
| `onContentToggle` | `(checked: boolean) => void` | - | Callback cuando se toggle el checkbox |

## 🎨 Características

### 1. **Controles de Variantes**

- Botón **-**: Elimina una variante (deshabilitado en el mínimo)
- Contador: Muestra el número actual de variantes
- Botón **+**: Agrega una variante (deshabilitado en el máximo)

### 2. **Nombre Editable**

- Input con `maxLength` de 14 caracteres
- Icono de lápiz (Pencil) para indicar editabilidad
- Presionar **Enter** guarda el cambio
- **Blur** guarda el cambio
- Trim automático de espacios
- No guarda si el nombre está vacío o no cambió

### 3. **Checkbox de Content**

- Opcional (solo se muestra si `showContentCheckbox={true}`)
- Label "Content" asociado
- Toggle para agregar/quitar variante content

### 4. **Validaciones**

- El botón **-** no llama `onVariantRemove` si está en el mínimo
- El botón **+** se deshabilita al alcanzar el máximo
- El nombre se valida antes de guardarse (trim, no vacío, diferente)

## 🔧 Comportamiento

### Edición de Nombre

1. Usuario hace **focus** en el input → `onEditStart()` se llama
2. Usuario escribe → `onTempNameChange(value)` se llama en cada cambio
3. Usuario presiona **Enter** o hace **blur**:
   - Si `tempName.trim()` está vacío → No hace nada
   - Si `tempName.trim() === groupName` → No hace nada
   - Si es válido → `onNameChange(tempName.trim())` se llama

### Controles de Variantes

**Botón -:**

- Si `currentCount <= minVariants` → Deshabilitado
- Si se hace click y `currentCount > minVariants` → `onVariantRemove()` se llama

**Botón +:**

- Si `currentCount >= maxVariants` → Deshabilitado
- Si se hace click → `onVariantAdd()` se llama

### Content Checkbox

- Solo visible si `showContentCheckbox={true}`
- Checked si `hasContent={true}`
- Al hacer click → `onContentToggle(checked)` se llama

## ♿ Accesibilidad

- ✅ Botones con `type="button"`
- ✅ Input con `id` único (`colorName-${groupName}`)
- ✅ Label asociado al input con `htmlFor`
- ✅ Checkbox con `id` único (`content-${groupName}`)
- ✅ Label asociado al checkbox
- ✅ Icono SVG con `aria-hidden="true"`

## 🧪 Testing

El componente tiene **42 tests** que cubren:

### Rendering (7 tests)

- Renderizado básico
- Nombre no editable (h4)
- Nombre editable (input)
- Botones de control
- Icono de lápiz
- Checkbox de content

### Variant Controls (7 tests)

- Callbacks de agregar/eliminar
- Deshabilitado en límites
- Contador de variantes
- Rangos personalizados

### Editable Name (10 tests)

- Focus, change, blur
- Mostrar tempName vs groupName
- Guardar con trim
- No guardar si vacío o sin cambios
- Enter para guardar
- MaxLength

### Content Checkbox (6 tests)

- Checked/unchecked
- Callbacks con true/false
- IDs correctos
- Label asociado

### Accessibility (3 tests)

- Tipos de botones
- Labels asociados
- IDs correctos

### Edge Cases (9 tests)

- Count de 0
- Count muy grande
- Nombre vacío
- Nombre largo
- Min = Max
- Límites exactos

## 📊 Cobertura

``` list
✓ ColorGroupHeader (42 tests) 514ms
  ✓ Rendering (7 tests)
  ✓ Variant Controls (7 tests)
  ✓ Editable Name (10 tests)
  ✓ Content Checkbox (6 tests)
  ✓ Accessibility (3 tests)
  ✓ Edge Cases (9 tests)
```

## 🎯 Casos de Uso

### MainColorsSection

```tsx
// No editable, sin content checkbox
<ColorGroupHeader
  groupName="surface"
  currentCount={numericCount}
  onVariantAdd={() => handleAdd("surface")}
  onVariantRemove={() => handleRemove("surface")}
/>
```

### BrandColorsSection

```tsx
// Editable, con content checkbox
<ColorGroupHeader
  groupName={colorGroup}
  currentCount={numericCount}
  editable={true}
  isEditing={editingGroupName === colorGroup}
  tempName={tempGroupName}
  showContentCheckbox={true}
  hasContent={hasContent}
  onEditStart={() => startEditing(colorGroup)}
  onTempNameChange={setTempGroupName}
  onNameChange={(newName) => changeName(colorGroup, newName)}
  onContentToggle={(checked) => toggleContent(colorGroup, checked)}
  onVariantAdd={() => handleAdd(colorGroup)}
  onVariantRemove={() => handleRemove(colorGroup)}
/>
```

## 🔄 Flujo de Estado

``` list
Usuario hace focus en input
  ↓
onEditStart() → isEditing = true
  ↓
Usuario escribe "newName"
  ↓
onTempNameChange("newName") → tempName = "newName"
  ↓
Usuario presiona Enter o hace blur
  ↓
Validación: trim, no vacío, diferente
  ↓
onNameChange("newName") → groupName actualizado
```

## 🎨 Estilos

Los estilos se definen en `ColorGroupHeader.module.css`:

- `.groupHeader`: Container principal
- `.editableHeader`: Wrapper para input editable
- `.variantControl`: Controles de variantes
- `.contentCheckbox`: Checkbox de content
- `.pencilIcon`: Icono de lápiz

## 📝 Notas

- El componente es **controlado**: Depende de props para su estado
- **No maneja estado interno** excepto para el manejo de eventos
- Es **reutilizable** en diferentes contextos (Main/Brand colors)
- Sigue el patrón de **Atomic Design** (Molecule)
