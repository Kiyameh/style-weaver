# ProjectBadges Component

Componente que muestra los proyectos disponibles como badges interactivos que permiten filtrar temas y eliminar proyectos.

## Características

- **Selección múltiple**: Los usuarios pueden seleccionar uno, varios o ningún proyecto
- **Filtrado visual**: Los badges seleccionados cambian de color para indicar el estado activo
- **Eliminación con confirmación**: Al hacer clic en el icono de basura, se muestra un icono de check durante 2 segundos para confirmar la eliminación
- **Diseño responsive**: Los badges se apilan horizontalmente con wrap automático

## Uso

```tsx
import ProjectBadges from "@/components/organism/Library/components/ProjectBadges";

<ProjectBadges
  projects={["Project A", "Project B", "Project C"]}
  selectedProjects={["Project A"]}
  onProjectToggle={(project) => console.log("Toggled:", project)}
  onProjectDelete={(project) => console.log("Deleted:", project)}
/>
```

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `projects` | `string[]` | Lista de proyectos disponibles |
| `selectedProjects` | `string[]` | Lista de proyectos actualmente seleccionados |
| `onProjectToggle` | `(project: string) => void` | Callback cuando se selecciona/deselecciona un proyecto |
| `onProjectDelete` | `(project: string) => void` | Callback cuando se confirma la eliminación de un proyecto |

## Comportamiento de eliminación

1. Usuario hace clic en el icono de basura (Trash2)
2. El badge muestra una animación de pulso y el icono cambia a check (Check)
3. El usuario tiene 2 segundos para confirmar haciendo clic en el check
4. Si confirma: se ejecuta `onProjectDelete` y se elimina el proyecto
5. Si no confirma: el icono vuelve a basura automáticamente

## Accesibilidad

- Cada badge tiene `aria-label` descriptivo
- Los badges usan `aria-pressed` para indicar el estado de selección
- Los botones de eliminación tienen labels específicos según el estado de confirmación
