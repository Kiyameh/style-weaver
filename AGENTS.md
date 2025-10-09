# AGENTS.md

## Project overview

**Style Weaver** es una aplicación web desarrollada con Next.js 15 que permite crear, visualizar y generar código CSS para sistemas de diseño y temas personalizados. La aplicación funciona como un generador de design tokens que facilita la creación de paletas de colores, sistemas de espaciado, sombras y otros elementos de diseño.

### Características principales

- **Generador de temas CSS**: Permite crear y editar temas con diferentes paletas de colores
- **Preview en tiempo real**: Visualización inmediata de los cambios en el diseño
- **Exportación de código CSS**: Genera código CSS listo para usar en proyectos
- **Gestión de estado por URL**: Los temas se pueden compartir y persistir mediante parámetros de URL

### Stack tecnológico

- **Framework**: Next.js 15 con App Router y Turbopack
- **Runtime**: React 19
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules
- **Colores**: colorjs.io para manipulación avanzada de colores
- **Iconos**: Lucide React
- **Testing**: Vitest + Testing Library
- **Linting/Formatting**: Biome
- **Arquitectura**: Atomic Design Pattern

### Estructura del proyecto

```text
src/
├── app/                    # Next.js App Router pages
├── components/            # Componentes organizados por Atomic Design
│   ├── atoms/            # Componentes básicos (Button, Input, etc.)
│   ├── molecules/        # Combinaciones de atoms
│   └── organisms/        # Componentes complejos
├── styles/               # Estilos globales y CSS modules
├── themes/               # Definiciones de temas predeterminados
├── types/                # Definiciones de tipos TypeScript
└── utils/                # Utilidades y helpers
```

## Code style guidelines

### Convenciones de código

#### TypeScript

- Usar `interface` para definir props de componentes
- Exportar tipos desde archivos `.d.ts` dedicados
- Utilizar `type` para uniones y tipos complejos
- Importar tipos con `import type` cuando sea posible

#### Componentes React

- **Naming**: PascalCase para componentes, camelCase para funciones
- **Props**: Definir interfaces explícitas para todas las props
- **Default exports**: Usar export default para componentes principales
- **Estructura de archivos**: Un componente por archivo con su respectivo test

#### CSS Modules

- **Naming**: camelCase para nombres de clases
- **Archivos**: `ComponentName.module.css` para cada componente
- **Organización**: Agrupar estilos relacionados y usar variables CSS cuando sea apropiado

#### Imports

- **Orden**: Librerías externas primero, luego imports internos
- **Alias**: Usar `@/` para imports desde `src/`
- **Organización**: Biome organiza automáticamente los imports

### Patrones específicos del proyecto

#### Temas y colores

- Usar la interfaz `Theme` definida en `src/types/Theme.ts`
- Utilizar `colorjs.io` para manipulación de colores
- Definir colores en formato OKLCH para mejor precisión

#### Componentes

- Seguir Atomic Design: atoms → molecules → organisms
- Cada componente debe tener su archivo de tipos (`types.d.ts`)
- Cada componente en una carpeta con sus test, sus tipos y un readme con la documentación breve

## Testing instructions

### Configuración de testing

- **Framework**: Vitest como test runner
- **Entorno**: jsdom para simular el DOM
- **Utilidades**: Testing Library para testing de componentes React

### Estructura de tests

- **Ubicación**: Tests junto a sus componentes (`Component.test.tsx`)
- **Naming**: Usar `describe` para agrupar tests relacionados
- **Organización**: Separar tests por categoría (rendering, variants, functionality, etc.)

### Patrones de testing

#### Categorías de tests recomendadas

1. **Rendering**: Verificar que el componente se renderiza correctamente
2. **Variants**: Probar diferentes variantes y props
3. **Functionality**: Testear interacciones y eventos
4. **Props Forwarding**: Verificar que las props se pasan correctamente
5. **Accessibility**: Comprobar aspectos de accesibilidad
6. **Edge Cases**: Casos límite y manejo de errores

#### Mocking

- Usar `vi.fn()` para crear mocks de funciones
- Mockear dependencias externas cuando sea necesario
- Evitar mocks excesivos, preferir tests de integración

### Cobertura de testing

- Todos los componentes deben tener tests unitarios
- Priorizar testing de funcionalidad crítica
- Incluir tests de accesibilidad para componentes interactivos
- Testear edge cases y manejo de errores
