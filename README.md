# Admin Recuerdos Compartidos

Panel administrativo para la gestión de productos y trabajos de **Recuerdos Compartidos**, un negocio de recuerdos y productos personalizados. Es una SPA construida con **Astro + React** que consume una API REST independiente (`api-recuerdos`), la cual a su vez utiliza **SheetDB.io** como capa de persistencia sobre Google Sheets.

```
Admin Panel (Astro + React) → API REST (Express 5) → SheetDB.io → Google Sheets
```

---

## Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tech Stack](#tech-stack)
- [Funcionalidades](#funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)
- [Consumo de API](#consumo-de-api)
- [Flujo de Datos](#flujo-de-datos)

---

## Arquitectura

El sistema está dividido en dos proyectos independientes:

| Proyecto | Rol | Tecnologías |
|---|---|---|
| **admin-recuerdos** | Panel administrativo (frontend) | Astro 7 + React 19 + Tailwind CSS 4 |
| **api-recuerdos** | API REST (backend) | Express 5 + SheetDB.io + JWT |

El panel **nunca se comunica directamente** con SheetDB ni con Google Sheets. Todas las operaciones pasan por la API, que se encarga de:

- Autenticación mediante JWT
- Rate limiting por IP
- Transformación de datos entre el formato anidado del frontend y el formato plano de SheetDB
- Caché con patrón stale-while-revalidate
- Operaciones batch para escrituras masivas

```
┌─────────────────────┐       ┌─────────────────────┐       ┌──────────────┐       ┌────────────────┐
│                     │       │                     │       │              │       │                │
│   Admin Panel       │──────>│   API REST          │──────>│   SheetDB    │──────>│   Google Sheets│
│   (Astro + React)   │<──────│   (Express 5)       │<──────│   .io        │<──────│                │
│                     │  HTTP │                     │  HTTP │              │ REST  │                │
│  localhost:4321     │       │  localhost:3001      │       │              │       │                │
└─────────────────────┘       └─────────────────────┘       └──────────────┘       └────────────────┘
```

---

## Tech Stack

| Tecnología | Versión | Propósito |
|---|---|---|
| [Astro](https://astro.build) | 7.x | Framework de construcción y SSR (usado solo como entry point SPA) |
| [React](https://react.dev) | 19.x | UI components e interactividad |
| [React Router](https://reactrouter.com) | 7.x | Enrutamiento del lado del cliente |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Estilos utilitarios |
| [Vercel](https://vercel.com) | — | Hosting y despliegue |

---

## Funcionalidades

### Autenticación

- Login con email y contraseña contra `POST /api/auth/login`
- Token JWT almacenado en `localStorage` con expiración de 24 horas
- Ruta protegida mediante componente `ProtectedRoute` que redirige al login si no hay token
- Cierre de sesión que limpia el token y redirige

### Dashboard

- Cards informativas con totales de **Productos** y **Trabajos**
- Conteo de categorías únicas entre productos
- Indicador visual de cambios pendientes por recurso
- Carga inicial de datos desde la API al montar el componente

### Gestión de Productos

- Tabla con columnas: ID, Nombre, Categoría, Precio (Bs), Destacado
- Modal de formulario para crear/editar con campos:
  - Nombre, Slug (auto-generable), Categoría, Precio
  - Imagen URL, Galería (múltiples URLs), Descripción
  - Configuración de audiencia: General (disponible/personalizable) y Business (disponible/personalizable)
  - Tags, Destacado (checkbox)
- Modo eliminar batch con selección múltiple
- Confirmación antes de marcar elementos para eliminación

### Gestión de Trabajos

- Tabla con columnas: ID, Título, Categoría, Cantidad
- Modal de formulario para crear/editar con campos:
  - Título, Descripción, Imagen URL, Categoría (Corporativo, Educativo, Decoración, Particular), Cantidad
- Modo eliminar batch con selección múltiple
- Confirmación antes de marcar elementos para eliminación

### Sistema de Cambios Pendientes (Offline-first)

- Los cambios (crear, editar, eliminar) se acumulan localmente antes de enviarse a la API
- Persistencia en `localStorage` bajo la clave `pendingChanges`
- Panel lateral deslizable que lista todos los cambios pendientes agrupados por recurso:
  - Nuevos (🆕), Modificados (✏️), Eliminaciones (🗑️)
  - Cada cambio puede descartarse individualmente
- Modal de **guardado batch** que:
  - Envía todos los cambios acumulados a los endpoints batch de la API
  - Muestra progreso y errores individuales por operación
  - Al completar exitosamente, dispara el **deploy hook de Vercel** para regenerar el sitio público
  - Recarga la página automáticamente tras el guardado exitoso

### DataTable Reutilizable

- Componente genérico de tabla que recibe `columns` y `data` como props
- Soporta render personalizado por columna
- Indicadores visuales integrados: `Nuevo`, `Pendiente`, `Eliminar`
- Modo seleccionable con checkbox para operaciones batch
- Estado vacío y estados de carga

### Diseño Responsive

- **Desktop**: Sidebar fijo a la izquierda con navegación y acceso a cambios pendientes
- **Mobile**: Top bar con menú hamburguesa que despliega el sidebar como overlay
- Panel de cambios pendientes se adapta: slide-up en mobile, slide-in desde la derecha en desktop

---

## Estructura del Proyecto

```
admin-recuerdos/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Layout.jsx             # Sidebar, topbar mobile, main content wrapper
│   │   └── ui/
│   │       ├── DataTable.jsx          # Tabla genérica reutilizable
│   │       └── ConfirmDialog.jsx      # Diálogo de confirmación responsive
│   ├── context/
│   │   ├── AuthContext.jsx            # Estado de autenticación (token, email, login, logout)
│   │   └── PendingChangesContext.jsx   # Estado de cambios pendientes (reducer + localStorage)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthContainer.jsx      # Lógica de login
│   │   │   ├── AuthView.jsx           # UI del formulario de login
│   │   │   ├── ProtectedRoute.jsx     # Guardia de autenticación
│   │   │   └── index.js
│   │   ├── dashboard/
│   │   │   ├── DashboardContainer.jsx # Lógica: fetch + cómputo de stats
│   │   │   ├── DashboardView.jsx      # UI: grid de tarjetas
│   │   │   ├── StatCard.jsx           # Tarjeta individual de métrica
│   │   │   └── index.js
│   │   ├── productos/
│   │   │   ├── ProductosContainer.jsx # Lógica CRUD de productos
│   │   │   ├── ProductosView.jsx      # UI: tabla + formulario + modales
│   │   │   ├── ProductForm.jsx        # Modal de formulario de producto
│   │   │   └── index.js
│   │   ├── trabajos/
│   │   │   ├── TrabajosContainer.jsx  # Lógica CRUD de trabajos
│   │   │   ├── TrabajosView.jsx       # UI: tabla + formulario + modales
│   │   │   ├── TrabajoForm.jsx        # Modal de formulario de trabajo
│   │   │   └── index.js
│   │   └── pending-changes/
│   │       ├── PendingChangesPanel.jsx  # Panel lateral de cambios pendientes
│   │       ├── BatchSaveModal.jsx       # Modal de guardado masivo
│   │       ├── PendingResourceSection.jsx  # Sección de recurso en el panel
│   │       ├── PendingItem.jsx           # Item individual descartable
│   │       └── index.js
│   ├── hooks/                          # (reservado para hooks compartidos)
│   ├── lib/
│   │   ├── client.js                  # Cliente HTTP base (fetch + token + caché)
│   │   ├── cache.js                   # Lógica de caché en memoria (TTL 1 hora)
│   │   ├── auth.js                    # Endpoints de autenticación
│   │   ├── productos.js               # Endpoints de productos
│   │   └── trabajos.js                # Endpoints de trabajos
│   ├── middleware/
│   │   └── AppRouter.jsx              # Providers globales + definición de rutas
│   ├── pages/
│   │   └── index.astro                # Entry point: HTML shell + AppRouter
│   └── utils/
│       ├── stripMeta.js               # Limpieza de metadatos de pending changes
│       └── constants.js               # Categorías de productos y trabajos
├── .env                               # Variables de entorno
├── .env.example                       # Template de variables documentadas
├── astro.config.mjs                   # Configuración de Astro
├── tsconfig.json                      # Configuración de TypeScript
├── vercel.json                        # Configuración de despliegue Vercel
├── package.json
└── README.md
```

### Descripción de Componentes

| Componente | Archivo | Rol |
|---|---|---|
| `AppRouter` | `middleware/AppRouter.jsx` | Providers globales (`AuthProvider`, `PendingChangesProvider`) + definición de rutas |
| `Layout` | `components/layout/Layout.jsx` | Sidebar, topbar mobile, botón de cambios pendientes y slot para contenido |
| `AuthContainer` | `features/auth/AuthContainer.jsx` | Lógica de login: estado del form, validación, llamada API |
| `AuthView` | `features/auth/AuthView.jsx` | UI del formulario de inicio de sesión |
| `ProtectedRoute` | `features/auth/ProtectedRoute.jsx` | Guardia que redirige al login si no hay sesión activa |
| `DashboardContainer` | `features/dashboard/DashboardContainer.jsx` | Fetch de datos + cómputo de totales y pendientes |
| `DashboardView` | `features/dashboard/DashboardView.jsx` | Grid de tarjetas con estadísticas |
| `StatCard` | `features/dashboard/StatCard.jsx` | Tarjeta individual de métrica con badge de pendientes |
| `ProductosContainer` | `features/productos/ProductosContainer.jsx` | Lógica CRUD de productos: fetch, estado local, dispatch a contexto |
| `ProductosView` | `features/productos/ProductosView.jsx` | UI: tabla de productos, modo eliminar, formularios y modales |
| `ProductForm` | `features/productos/ProductForm.jsx` | Modal con formulario completo de producto (13 campos) |
| `TrabajosContainer` | `features/trabajos/TrabajosContainer.jsx` | Lógica CRUD de trabajos: fetch, estado local, dispatch a contexto |
| `TrabajosView` | `features/trabajos/TrabajosView.jsx` | UI: tabla de trabajos, modo eliminar, formularios y modales |
| `TrabajoForm` | `features/trabajos/TrabajoForm.jsx` | Modal con formulario de trabajo (5 campos) |
| `DataTable` | `components/ui/DataTable.jsx` | Tabla genérica con selección, render custom y badges de estado |
| `ConfirmDialog` | `components/ui/ConfirmDialog.jsx` | Diálogo modal de confirmación con soporte para variante danger |
| `PendingChangesPanel` | `features/pending-changes/PendingChangesPanel.jsx` | Panel lateral que lista cambios pendientes con opción de descartar |
| `PendingResourceSection` | `features/pending-changes/PendingResourceSection.jsx` | Sección por recurso (productos/trabajos) dentro del panel |
| `PendingItem` | `features/pending-changes/PendingItem.jsx` | Item individual descartable con icono y etiqueta |
| `BatchSaveModal` | `features/pending-changes/BatchSaveModal.jsx` | Modal que envía cambios batch a la API y dispara deploy hook |

### Contextos

| Contexto | Archivo | Estado | Persistencia |
|---|---|---|---|
| `AuthContext` | `context/AuthContext.jsx` | token, email, isAuthenticated | localStorage (token, email) |
| `PendingChangesContext` | `context/PendingChangesContext.jsx` | productos (creates, updates), trabajos (creates, updates), pendingDeletes | localStorage (pendingChanges) |

#### PendingChangesContext — Acciones del Reducer

| Acción | Descripción |
|---|---|
| `ADD_CREATE` | Agrega un nuevo registro pendiente de crear |
| `ADD_UPDATE` | Marca un registro como modificado |
| `DISCARD_CREATE` | Descarta una creación pendiente |
| `DISCARD_UPDATE` | Descarta una modificación pendiente |
| `MARK_DELETE` | Marca registros para eliminación (remueve creates/updates si aplica) |
| `UNMARK_DELETE` | Quita la marca de eliminación |
| `DISCARD_ALL` | Descarta todos los cambios (por recurso o global) |
| `CLEAR_ALL` | Limpia todos los cambios pendientes (tras guardado exitoso) |

#### Funciones del Contexto

| Función | Descripción |
|---|---|
| `getEffectiveList(resource, apiData)` | Combina datos de API con cambios locales y pending deletes para renderizar la tabla |
| `getResourceCounts(resource)` | Retorna conteo de creates, updates, deletes y total |

### Cliente API (`src/lib/`)

El cliente HTTP está dividido en módulos independientes por recurso:

| Módulo | Archivo | Contenido |
|---|---|---|
| **Cliente base** | `lib/client.js` | `request()` — fetch con base URL, inyección de token JWT, manejo de 401, caché automática en GET |
| **Caché** | `lib/cache.js` | Estado de caché en memoria con TTL de 1 hora para lecturas (GET) |
| **Auth** | `lib/auth.js` | `login(email, password)` |
| **Productos** | `lib/productos.js` | `getProductos`, `getProducto`, `createProducto`, `updateProducto`, `deleteProducto`, `batchSave`, `batchDelete` |
| **Trabajos** | `lib/trabajos.js` | `getTrabajos`, `getTrabajo`, `createTrabajo`, `updateTrabajo`, `deleteTrabajo`, `batchSave`, `batchDelete` |

Todas las funciones comparten el mismo cliente base que proporciona:

- **Base URL** desde `PUBLIC_API_URL` (variable de entorno)
- **Inyección automática** de token JWT del `localStorage` en header `Authorization`
- **Caché en memoria** de 1 hora para lecturas (GET), invalidada automáticamente en escrituras
- **Manejo de 401**: limpia token y redirige al login

---

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd admin-recuerdos

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con PUBLIC_API_URL (ver sección Variables de Entorno)

# Iniciar servidor de desarrollo
npm run dev
```

---

## Variables de Entorno

| Variable | Descripción | Obligatorio | Ejemplo |
|---|---|---|---|
| `PUBLIC_API_URL` | URL base de la API REST | Sí | `http://localhost:3001` |
| `PUBLIC_VERCEL_DEPLOY_HOOK` | URL del Deploy Hook de Vercel para rebuild automático tras guardar cambios | No (solo producción) | `https://api.vercel.com/v1/integrations/deploy/...` |

Las variables deben estar definidas en un archivo `.env` en la raíz del proyecto. Astro expone automáticamente las variables con prefijo `PUBLIC_` al cliente.

> ⚠️ `PUBLIC_VERCEL_DEPLOY_HOOK` debe dejarse **vacío en local** y configurarse únicamente en el Dashboard de Vercel para el entorno de producción. Así se evitan deploys innecesarios durante el desarrollo.

---

## Desarrollo

### Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo (puerto 4321 por defecto) |
| `npm run build` | Genera build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |

### Modo Background (recomendado)

```bash
# Iniciar servidor en segundo plano
astro dev --background

# Ver logs
astro dev logs

# Ver estado
astro dev status

# Detener
astro dev stop
```

### Requisitos

- Node.js >= 22.12.0

---

## Despliegue

El proyecto está configurado para desplegarse en **Vercel** como una SPA estática.

### Configuración (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/[^.]+", "dest": "/index.html" }
  ]
}
```

- **Build estático**: `astro build` genera los archivos en `dist/`
- **SPA routing**: Todas las rutas que no coinciden con archivos estáticos redirigen a `index.html` para que React Router las maneje

### Deploy Hook Automático

El `BatchSaveModal` incluye un deploy hook de Vercel que se dispara automáticamente al guardar cambios batch exitosamente. Esto asegura que el sitio público (que consume la misma API) se reconstruya con los datos actualizados.

> **Comportamiento condicional:** El hook se controla mediante la variable de entorno `PUBLIC_VERCEL_DEPLOY_HOOK`.
> - En **local** la variable está vacía → **no se dispara** el deploy.
> - En **producción** debe configurarse en el Dashboard de Vercel → se dispara solo al guardar desde el panel en vivo.
>
> Esto evita deploys innecesarios durante el desarrollo y pruebas con datos de prueba.

---

## Consumo de API

El panel consume los siguientes endpoints de `api-recuerdos`. Todos los endpoints de escritura requieren el header `Authorization: Bearer <token>`.

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión (body: `{ email, password }`) → `{ token, email }` |
| `GET` | `/api/auth/verify` | Verificar validez del token |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Listar todos los productos |
| `GET` | `/api/productos/:id` | Obtener producto por ID |
| `POST` | `/api/productos` | Crear producto |
| `PUT` | `/api/productos/:id` | Actualizar producto |
| `DELETE` | `/api/productos/:id` | Eliminar producto |
| `POST` | `/api/productos/batch` | Crear/actualizar múltiples productos |
| `POST` | `/api/productos/batch/delete` | Eliminar múltiples productos |

### Trabajos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/trabajos` | Listar todos los trabajos |
| `GET` | `/api/trabajos/:id` | Obtener trabajo por ID |
| `POST` | `/api/trabajos` | Crear trabajo |
| `PUT` | `/api/trabajos/:id` | Actualizar trabajo |
| `DELETE` | `/api/trabajos/:id` | Eliminar trabajo |
| `POST` | `/api/trabajos/batch` | Crear/actualizar múltiples trabajos |
| `POST` | `/api/trabajos/batch/delete` | Eliminar múltiples trabajos |

---

## Flujo de Datos

### Lectura

```
Usuario → View → Container → lib/client.js (fetch) → API REST → SheetDB → Google Sheets
                                                    ↓
                                              Caché en memoria (1 hora)
                                                    ↓
                                              Transformación (plano → anidado)
                                                    ↓
                                              Respuesta JSON
```

- Las lecturas se cachean en memoria del navegador durante 1 hora
- La API también cachea del lado del servidor con patrón stale-while-revalidate

### Escritura (Offline-first)

```
Usuario → Formulario → PendingChangesContext → localStorage
                                                    ↓
                                          (usuario acumula cambios)
                                                    ↓
                               BatchSaveModal → lib/client.js (batch) → API REST
                                                    ↓
                                          SheetDB (Google Sheets)
                                                    ↓
                                          Deploy Hook Vercel (trigger rebuild)
                                                    ↓
                                          CLEAR_ALL + Recarga de página
```

- Los cambios se acumulan localmente en `localStorage` bajo la clave `pendingChanges`
- El usuario puede ver, revisar y descartar cambios individualmente desde el panel lateral
- Al guardar, se envían todos los cambios en una sola petición batch
- Si hay errores parciales, se muestran individualmente sin perder el resto de cambios
- Al guardar exitosamente, se dispara el deploy hook de Vercel para regenerar el sitio público

---

## Relación con `api-recuerdos`

El proyecto `api-recuerdos` es el backend indispensable para el funcionamiento de este panel. Debe estar corriendo (localmente o en producción) para que el panel funcione.

| Aspecto | `admin-recuerdos` | `api-recuerdos` |
|---|---|---|
| Puerto dev | `4321` | `3001` |
| Hosting | Vercel (static) | Vercel (serverless) |
| Persistencia | — | SheetDB.io → Google Sheets |
| Autenticación | Consume JWT | Genera JWT |
| Transformación de datos | Formato anidado (React) | Conversión anidado ↔ plano |

El archivo `.env` debe apuntar a la URL donde esté desplegada o corriendo la API:

```
PUBLIC_API_URL=http://localhost:3001
```
