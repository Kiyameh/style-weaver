# FakeDashboard

Componente de dashboard falso para previsualizar temas en tiempo real.

## Descripción

`FakeDashboard` es un componente de demostración que muestra un dashboard completo con múltiples elementos de UI. Su propósito es servir como preview del tema actual (`currentTheme`) del contexto, permitiendo visualizar cómo se aplican los colores, sombras, radios y otros estilos del sistema de diseño.

## Características

- **Preview en tiempo real**: Refleja instantáneamente los cambios del `currentTheme` del contexto
- **Variables CSS dinámicas**: Genera y aplica variables CSS desde el tema actual usando el hook `useThemeStyles`
- **Preview completo del tema**: Utiliza todos los componentes de la carpeta `components/ui`
- **Sistema de fallback robusto**: Maneja automáticamente variantes de color faltantes
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Integración con ThemeContext**: Lee automáticamente el tema actual

## Sistema de Fallback

El componente incluye un sistema de fallback inteligente para manejar casos donde el usuario ha eliminado variantes de color:

### Fallback de colores

- **Grupos de colores**: Si falta un grupo completo, usa la variante `-100` del grupo más cercano
- **Variantes `-content` de brand colors**: Si falta, usa `content-100` de mainColors
- **Variantes numéricas**: Si falta una variante específica (ej: `300`), busca la variante inferior más cercana del mismo grupo

### Fallback de radius y shadows

- Busca el tamaño más cercano disponible (sm → md → lg → xl)
- Proporciona valores por defecto si no existe ninguno

## Uso

```tsx
import FakeDashboard from "@/components/ui/FakeDashboard";

function PreviewPage() {
  return <FakeDashboard />;
}
```

## Props

Extiende `HTMLAttributes<HTMLDivElement>`, por lo que acepta todas las props estándar de un div.

```typescript
interface FakeDashboardProps extends HTMLAttributes<HTMLDivElement> {
  // No additional props needed
}
```

## Componentes utilizados

El dashboard hace uso de los siguientes componentes:

- `Alert` - Para notificaciones del sistema
- `Avatar` - Para perfiles de usuario
- `Button` - Para acciones y navegación
- `Card` - Para tarjetas de estadísticas
- `Checkbox` - Para tareas pendientes
- `Chip` - Para etiquetas y estados

## Hooks y Utilidades

### `useThemeStyles(theme)`

Hook que genera las variables CSS dinámicamente desde el tema actual.

```typescript
import { useThemeStyles } from "@/components/ui/FakeDashboard";

function MyComponent() {
  const { currentTheme } = useTheme();
  const themeStyles = useThemeStyles(currentTheme);
  
  return <div style={themeStyles as React.CSSProperties}>
    {/* El contenido tendrá acceso a todas las variables CSS del tema */}
  </div>;
}
```

### Utilidades de Fallback

El componente exporta utilidades que pueden ser usadas en otros componentes:

### `getColorWithFallback(theme, group, variant)`

Obtiene un color con fallback automático.

```typescript
import { getColorWithFallback } from "@/components/ui/FakeDashboard";

const color = getColorWithFallback(theme, "primary", "200");
// Retorna: "var(--primary-200)" o un fallback apropiado
```

### `getRadiusWithFallback(theme, size)`

Obtiene un valor de radius con fallback.

```typescript
import { getRadiusWithFallback } from "@/components/ui/FakeDashboard";

const radius = getRadiusWithFallback(theme, "lg");
// Retorna: "var(--radius-lg)" o un fallback apropiado
```

### `getShadowWithFallback(theme, size)`

Obtiene un valor de shadow con fallback.

```typescript
import { getShadowWithFallback } from "@/components/ui/FakeDashboard";

const shadow = getShadowWithFallback(theme, "md");
// Retorna: "var(--shadow-md)" o un fallback apropiado
```

## Estructura del Dashboard

El dashboard incluye las siguientes secciones:

1. **Header**: Título, avatar, chips y botones de acción
2. **Stats Grid**: 4 tarjetas con estadísticas (Revenue, Users, Orders, Products)
3. **Recent Activity**: Lista de actividades recientes con iconos
4. **System Alerts**: Alertas de información, éxito y advertencia
5. **Quick Actions**: Botones de acciones rápidas
6. **Pending Tasks**: Lista de tareas con checkboxes
7. **Team Members**: Lista de miembros del equipo con avatars
8. **Footer**: Links y copyright

## Notas de implementación

- El componente usa `useTheme()` para acceder al tema actual
- Los estilos inline se usan estratégicamente para aplicar colores dinámicos
- Las variables CSS se usan con valores de fallback en línea
- El componente verifica la disponibilidad de colores antes de renderizar elementos opcionales
