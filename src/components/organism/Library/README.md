# Library

Sistema de biblioteca para guardar, organizar y gestionar temas de diseño.

## Componentes

### LibraryModal

Componente principal que muestra la interfaz de la biblioteca en un modal.

**Props:**

- `isOpen`: Controla si el modal está abierto
- `onClose`: Callback para cerrar el modal
- `currentTheme`: Tema actual en el editor
- `onLoadTheme`: Callback cuando se carga un tema desde la biblioteca

**Características:**

- Guarda temas en localStorage
- Organiza temas por proyectos
- Filtra temas por nombre, descripción o proyecto
- Muestra estadísticas de cada tema
- Permite eliminar temas guardados

### ThemeCard

Tarjeta que muestra la información de un tema guardado.

**Props:**

- `savedTheme`: Tema guardado a mostrar
- `isActive`: Si el tema está actualmente activo
- `onDelete`: Callback para eliminar el tema
- `onLoad`: Callback para cargar el tema

**Muestra:**

- Nombre y descripción del tema
- Icono de modo de color (sol/luna)
- Proyecto asignado
- Estadísticas (colores main, brand, shadows, radius)
- Controles de carga y eliminación

### FilterBar

Barra de filtros para buscar y filtrar temas.

**Props:**

- `searchQuery`: Consulta de búsqueda actual
- `onSearchChange`: Callback cuando cambia la búsqueda
- `selectedProject`: Proyecto seleccionado para filtrar
- `onProjectChange`: Callback cuando cambia el filtro de proyecto
- `projects`: Lista de proyectos disponibles

### ProjectSelector

Selector de proyecto con opción de crear nuevos proyectos.

**Props:**

- `projects`: Lista de proyectos disponibles
- `selectedProject`: Proyecto actualmente seleccionado
- `onProjectSelect`: Callback cuando se selecciona un proyecto
- `onAddProject`: Callback para agregar un nuevo proyecto

## Utilidades

### localStorage.ts

Funciones para gestionar el almacenamiento de temas:

- `getSavedThemes()`: Obtiene todos los temas guardados
- `saveTheme(theme, project?)`: Guarda un tema
- `deleteTheme(id)`: Elimina un tema
- `getProjects()`: Obtiene todos los proyectos
- `addProject(name)`: Agrega un nuevo proyecto
- `deleteProject(name)`: Elimina un proyecto
- `updateThemeProject(themeId, project)`: Actualiza el proyecto de un tema

### themeStats.ts

Funciones para calcular estadísticas de temas:

- `calculateThemeStats(theme)`: Calcula las estadísticas de un tema

### filterThemes.ts

Funciones para filtrar y ordenar temas:

- `filterThemes(themes, query, project)`: Filtra temas por búsqueda y proyecto
- `sortThemesByDate(themes)`: Ordena temas por fecha (más recientes primero)

## Uso

```tsx
import LibraryModal from "@/components/organism/Library";

function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  return (
    <>
      <button onClick={() => setIsLibraryOpen(true)}>
        Open Library
      </button>

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentTheme={currentTheme}
        onLoadTheme={setCurrentTheme}
      />
    </>
  );
}
```

## Almacenamiento

Los temas se guardan en localStorage con las siguientes claves:

- `styleweaver_library`: Array de temas guardados
- `styleweaver_projects`: Array de nombres de proyectos

Los temas se serializan usando las funciones `serializeTheme` y `deserializeTheme` del módulo de persistencia de URL.
