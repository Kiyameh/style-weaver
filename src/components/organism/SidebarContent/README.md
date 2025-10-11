# SidebarContent

Componente principal del sidebar que orquesta todas las secciones de edición del tema.

## 📋 Descripción

Este componente ha sido refactorizado desde un monolito de **632 líneas** a una estructura modular de **34 líneas** que orquesta subcomponentes especializados.

## 🏗️ Estructura

``` table
SidebarContent/
├── SidebarContent.tsx              # Componente principal (34 líneas)
├── SidebarContent.module.css       # Estilos globales
├── SidebarContent.old.tsx          # Versión anterior (backup)
├── README.md                       # Este archivo
│
├── components/                     # Subcomponentes
│   ├── MainColorsSection/          # Sección de colores principales
│   ├── BrandColorsSection/         # Sección de colores de marca
│   ├── RadiusSection/              # Sección de border radius
│   ├── ShadowsSection/             # Sección de box shadows
│   └── ColorGroupHeader/           # Header reutilizable para grupos
│
└── utils/                          # Utilidades
    ├── cssParser.ts                # Parseo de CSS strings
    ├── cssFormatter.ts             # Formateo a CSS strings
    ├── keyGeneration.ts            # Generación de keys (sm, md, lg...)
    ├── colorSorting.ts             # Ordenamiento de colores
    ├── variantManagement.ts        # Gestión de variantes
    └── index.ts                    # Exportaciones centralizadas
```

## 📦 Componentes

### SidebarContent (Principal)

**Responsabilidad**: Orquestar las secciones  
**Líneas**: 34  
**Dependencias**: MainColorsSection, BrandColorsSection, RadiusSection, ShadowsSection

### MainColorsSection

**Responsabilidad**: Gestionar colores principales (surface, content, border)  
**Líneas**: ~100  
**Features**:

- Agregar/eliminar variantes
- ColorPicker para cada variante
- Ordenamiento automático (content primero)

### BrandColorsSection

**Responsabilidad**: Gestionar colores de marca  
**Líneas**: ~120  
**Features**:

- Agregar/eliminar variantes
- Editar nombres de grupos
- Checkbox para variante "content"
- ColorPicker para cada variante
- Ordenamiento automático (content primero)

### RadiusSection

**Responsabilidad**: Gestionar border radius  
**Líneas**: ~80  
**Features**:

- Agregar/eliminar variantes
- RadiusPicker para cada variante
- Generación automática de keys (sm, md, lg, xl, 2xl...)

### ShadowsSection

**Responsabilidad**: Gestionar box shadows  
**Líneas**: ~80  
**Features**:

- Agregar/eliminar variantes
- ShadowPicker para cada variante
- Generación automática de keys (sm, md, lg, xl, 2xl...)

### ColorGroupHeader (Reutilizable)

**Responsabilidad**: Header con controles de variantes  
**Líneas**: ~90  
**Props**:

- `groupName`: Nombre del grupo
- `currentCount`: Número actual de variantes
- `maxVariants`: Máximo permitido (default: 10)
- `minVariants`: Mínimo permitido (default: 1)
- `onVariantAdd`: Callback para agregar
- `onVariantRemove`: Callback para eliminar
- `onNameChange`: Callback para cambiar nombre (opcional)
- `editable`: Si el nombre es editable
- `showContentCheckbox`: Mostrar checkbox de content
- `hasContent`: Si tiene variante content
- `onContentToggle`: Callback para toggle de content

## 🛠️ Utilidades

### cssParser.ts

Funciones para parsear strings CSS a objetos:

- `parseRadiusString(radiusStr: string): CssRadiusValue`
- `parseShadowString(shadowStr: string): CssShadowValue`
- `parseColorFromString(colorStr: string): Color`

### cssFormatter.ts

Funciones para formatear objetos a strings CSS:

- `formatRadiusValue(radius: CssRadiusValue): string`
- `formatShadowValue(shadow: CssShadowValue): string`
- `formatColorToOklch(color: Color): string`

### keyGeneration.ts

Funciones para generar keys de variantes:

- `SIZE_KEYS`: Array de keys estándar
- `getNextSizeKey(lastKey: string): string`
- `generateNextKey(currentKeys: string[]): string`

### colorSorting.ts

Funciones para ordenar colores:

- `isContentKey(key: string): boolean`
- `sortColorsWithContentFirst<T>(entries: [string, T][]): [string, T][]`
- `getNumericVariantCount(keys: string[]): number`

### variantManagement.ts

Funciones para gestionar variantes:

- `getKeysToRemove(currentKeys: string[], targetCount: number): string[]`
- `calculateVariantDiff(currentCount: number, targetCount: number): number`
- `isValidVariantCount(targetCount: number, max: number, min: number): boolean`

## 📊 Comparación

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Líneas en archivo principal** | 632 | 34 |
| **Componentes** | 1 monolítico | 6 modulares |
| **Funciones de utilidad** | Dentro del componente | 5 archivos externos |
| **Reutilización** | Baja | Alta (ColorGroupHeader) |
| **Testabilidad** | Difícil | Fácil (funciones puras) |
| **Mantenibilidad** | Baja | Alta |

## ✅ Ventajas

1. **Separación de Responsabilidades**: Cada componente tiene una única responsabilidad
2. **Reutilización**: ColorGroupHeader se usa en múltiples secciones
3. **Testabilidad**: Funciones puras fáciles de testear
4. **Mantenibilidad**: Cambios localizados en archivos pequeños
5. **Escalabilidad**: Fácil agregar nuevas secciones o funcionalidades

## 🔄 Migración Completada

- ✅ Fase 1: Utilidades extraídas
- ✅ Fase 2: ColorGroupHeader creado
- ✅ Fase 3: Secciones creadas
- ✅ Fase 4: SidebarContent refactorizado

## 📝 Notas

- El archivo original se guardó como `SidebarContent.old.tsx` por seguridad
- Todos los estilos se mantuvieron en archivos `.module.css` separados
- La funcionalidad es idéntica a la versión anterior
- Los tests existentes deberían seguir funcionando sin cambios
