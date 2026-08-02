# 🎯 Plan de Modernización — Admin Recuerdos Compartidos

> Documento vivo para coordinar la transformación visual y funcional del panel administrativo.
> Stack: **Astro 7 + React 19 + Tailwind CSS 4 + Lucide React**

---

## 📋 Tabla de Contenidos

- [Arquitectura Actual](#arquitectura-actual)
- [Estrategia de Datos — Capas de Cache](#estrategia-de-datos--capas-de-cache)
- [Flujo Completo de Lectura](#flujo-completo-de-lectura)
- [Design System — Tokens y Estilos](#design-system--tokens-y-estilos)
- [Mapa de Componentes Lucide](#mapa-de-componentes-lucide)
- [Fase 1: Infraestructura Base](#fase-1-infraestructura-base)
- [Fase 2: Layout + Navegación + Buscador + Dark Mode](#fase-2-layout--navegación--buscador--dark-mode)
- [Fase 3: Dashboard con Reportes y Estadísticas](#fase-3-dashboard-con-reportes-y-estadísticas)
- [Fase 4: Gestión de Categorías](#fase-4-gestión-de-categorías)
- [Fase 5: Gestión de Pedidos](#fase-5-gestión-de-pedidos)
- [Fase 6: Exportar + Utilidades Finales](#fase-6-exportar--utilidades-finales)
- [Checklist de Implementación](#checklist-de-implementación)
- [Riesgos y Dependencias](#riesgos-y-dependencias)

---

## 📊 Estado del Proyecto

> Última actualización: **2026-08-02**

| Fase | Estado | Detalle |
|---|---|---|
| **1 — Infraestructura Base** | ✅ **100%** | DataContext, ThemeContext, activityLog, UI kit, refactor completo, correcciones de estilos |
| **2 — Layout + Buscador + Dark Mode** | ✅ **100%** | Dark Mode · PendingChangesPanel · Layout `md:w-64` + active `border-l-2` · GlobalSearch con `Ctrl+K` · búsqueda local en listas con `?buscar=` |
| **3 — Dashboard con Reportes** | ✅ **100%** | stats.js (funciones puras), gráficos CSS, carousel de destacados, skeleton, feed, StatCards compactas clicables, `?nuevo=1` |
| **4 — Gestión de Categorías** | ⚪ Sin empezar | Bloqueado por API `/api/categorias` (fallback localStorage disponible) |
| **5 — Gestión de Pedidos** | ⚪ Sin empezar | **Bloqueado** por API `/api/pedidos` (PII — no usar mock) |
| **6 — Exportar + Utilidades** | ⚪ Sin empezar | Independiente |

**Orden de trabajo recomendado:** cerrar Fase 2 → Fase 3 → (Fase 4/5 cuando exista backend).

### Extras corregidos (fuera del checklist original)

Durante Fases 1 y 2 se corrigieron bugs no previstos que bloqueaban la experiencia:

1. **Tailwind scoped por Astro** — El `@import "tailwindcss"` dentro de `<style>` scoped generaba selectores `data-astro-cid-*` y rompía el preflight global (inputs fuera del box, containers sobrepuestos). **Solución:** CSS centralizado en `src/styles/global.css`.
2. **Dark mode seguía al OS** — Usaba `prefers-color-scheme` en vez de la clase `.dark`, por lo que el toggle no hacía nada. **Solución:** `@custom-variant dark (&:where(.dark, .dark *))` en `global.css`.
3. **Datos desactualizados tras guardar** — `DataContext` nunca refrescaba tras el batch save; el admin mostraba precios viejos aunque la API tuviera los nuevos. **Solución:** `refreshAll()` llamado tras `CLEAR_ALL` en `BatchSaveModal`.
4. **Spinner pegado en "cargando"** — Faltaba `setSaving(false)` en la rama de éxito del batch save. **Solución:** corregido.
5. **Panel pendientes atascado en móvil** — La top bar (`z-50`) tapaba el header del panel (`z-40`), imposible cerrarlo. **Solución:** panel `z-[60]`, overlay `z-[55]`, modales `z-[70]`, + bloqueo de scroll.
6. **`confirm()` nativo** — Reemplazado por `ConfirmDialog` en "Descartar todo".
7. **Toast sin uso** — Integrado en flujos reales (crear/editar/eliminar, batch save, descartar).
8. **Doble X en los buscadores de lista** — Los inputs de búsqueda usaban `type="search"`, lo que hacía que el navegador (Chrome/Edge/Safari) renderizara su botón nativo de limpiar (una X) que se superponía con la X personalizada ya existente — al escribir o al pasar el cursor se veían 2–3 X al mismo tiempo. **Solución:** cambiar a `type="text"` en `ProductosView.jsx` y `TrabajosView.jsx` (la X personalizada basta; se elimina la nativa).

---

## Arquitectura Actual

```
┌───────────────────────────────────────────────────────────────────────────┐
│  BrowserRouter                                                             │
│  ┌─ AuthProvider (token + email en localStorage)                          │
│  │  ┌─ ThemeProvider (dark/light + localStorage)                          │
│  │  │  ┌─ DataProvider ────────────────────────────────┐                  │
│  │  │  │  Caché compartida en memoria React             │                 │
│  │  │  │  (productos[], trabajos[], pedidos[], categorias[])│              │
│  │  │  │  ┌─ PendingChangesProvider (reducer + localStorage)              │
│  │  │  │  │  ┌─ ToastProvider (notificaciones)                           │
│  │  │  │  │  │  ┌─ Routes                                                │
│  │  │  │  │  │  │  ├─ /              → AuthContainer  (público)          │
│  │  │  │  │  │  │  ├─ /dashboard     → DashboardContainer (protegido)    │
│  │  │  │  │  │  │  ├─ /productos     → ProductosContainer (protegido)    │
│  │  │  │  │  │  │  ├─ /trabajos      → TrabajosContainer (protegido)     │
│  │  │  │  │  │  │  ├─ /categorias    → CategoriasContainer (protegido)   │
│  │  │  │  │  │  │  ├─ /pedidos       → PedidosContainer (protegido)      │
│  │  │  │  │  │  │  └─ *              → Navigate to /                     │
│  │  │  │  │  │  └──────────────────────────────────────────────────      │
│  │  │  │  │  └──────────────────────────────────────────────────          │
│  │  │  │  └──────────────────────────────────────────────────              │
│  │  │  └──────────────────────────────────────────────────                  │
│  │  └──────────────────────────────────────────────────                      │
│  └──────────────────────────────────────────────────                          │
└───────────────────────────────────────────────────────────────────────────┘
```

### Patrón de cada feature

```
Container (lógica + estado + fetching)
    └── View (UI pura, recibe props, renderiza)
         ├── DataTable (tabla genérica reutilizable)
         ├── Form (modal overlay con formulario)
         └── ConfirmDialog (confirmación de acciones)
```

### Flujo de escritura (Offline-first)

**Aplica a:** productos, trabajos, categorías.
**No aplica a:** pedidos (PII) — ver sección de Seguridad y Fase 5.

```
Formulario → dispatch(ADD_CREATE | ADD_UPDATE) → localStorage
                                                     ↓
Panel Pendientes → BatchSaveModal → API (batch endpoints)
                                             ↓
                                        CLEAR_ALL → refreshAll (DataContext) → reload
```

---

## Seguridad — Clasificación de Datos

### Clasificación por Sensibilidad

| Tipo | Clasificación | Cache L2 (DataContext) | Cache L3 (cache.js) | Offline-first | localStorage |
|---|---|---|---|---|---|
| Productos | No sensible | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Pendientes |
| Trabajos | No sensible | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Pendientes |
| Categorías | No sensible | ✅ Sí | ✅ Sí (futuro) | ✅ Sí | ✅ Fallback |
| Pedidos | **Sensible (PII)** | ✅ Solo sesión | ❌ No | ❌ No | ❌ Nunca |
| Auth (token) | Sensible | N/A | N/A | N/A | ✅ Existente |

### Políticas por Tipo de Dato

#### Datos No Sensibles (Productos, Trabajos, Categorías)
- Cache libre en memoria (DataContext L2)
- Cache opcional en cache.js (L3, TTL 1 hora)
- Offline-first con PendingChangesContext
- Persistencia en localStorage aceptable para fallback o cambios pendientes

#### Datos Sensibles con PII (Pedidos: nombre, teléfono, email)
- **Sin cache en disco:** No se almacenan en cache.js (L3)
- **Sin offline-first:** No pasan por PendingChangesContext
- **Sin localStorage:** No se persisten localmente bajo ningún concepto
- **Solo DataContext en memoria (L2):** Carga única desde API, solo durante la sesión del navegador
- **Escritura directa a API:** POST/PUT/DELETE van directo al servidor, sin batch ni acumulación
- **refreshAll()** tras cada escritura para mantener consistencia
- **HTTPS obligatorio:** Asumido por el entorno de deploy

#### Auth
- Token JWT en localStorage (existente, no modificar)
- Email en localStorage para UI (existente, no modificar)

### Implicaciones de Arquitectura

| Recurso | Carga en DataContext | Flujo de Escritura |
|---|---|---|
| Productos | `loadIfNeeded()` → L2 → si falta → L3 → si falta → API | Offline-first → PendingChanges → Batch → API |
| Trabajos | `loadIfNeeded()` → L2 → si falta → L3 → si falta → API | Offline-first → PendingChanges → Batch → API |
| Categorías | `loadIfNeeded()` → L2 → si falta → L3 → si falta → API | Offline-first → PendingChanges → Batch → API |
| Pedidos | `loadIfNeeded()` → L2 → si falta → **API directa** (salta L3) | **Directo a API** → refreshAll() |

---

## Estrategia de Datos — Capas de Cache

Toda la arquitectura se basa en 4 capas de cache. **Ningún componente hace fetch directo a la API.** Siempre pasa por DataContext primero.

> **Excepción:** Los pedidos (PII) saltan L3 (cache.js) y van directo L2 → API en escritura. Ver sección de Seguridad.

```
┌─ L1: CONSTANTES ───────────────────────────────────────────┐
│  src/utils/constants.js                                      │
│  Datos estáticos: categorías default, config, enums          │
│  NO requieren API — son valores fijos de la aplicación       │
└─────────────────────────────────────────────────────────────┘

┌─ L2: DATACONTEXT ──────────────────────────────────────────┐
│  src/context/DataContext.jsx  (NUEVO, Fase 1)               │
│  Estado compartido en memoria React                          │
│  (productos[], trabajos[], categorias[], pedidos[])          │
│  Carga perezosa: solo fetch si no hay datos                  │
│  Persiste mientras el usuario navega sin recargar            │
│  loadIfNeeded(): fetch solo si es necesario                  │
│  refreshAll(): forzar recarga desde API                      │
│  ─────────────────────────────────────────────               │
│  Todos los Containers consumen useData() en vez de lib/      │
└─────────────────────────────────────────────────────────────┘
                          ↓ si no hay datos en contexto
┌─ L3: CLIENT CACHE ─────────────────────────────────────────┐
│  src/lib/cache.js  (EXISTENTE)                               │
│  TTL 1 hora en memoria                                       │
│  Retorna data sin fetch HTTP si está en caché                │
│  Se invalida automáticamente al escribir (POST/PUT/DELETE)   │
└─────────────────────────────────────────────────────────────┘
                          ↓ si no hay en caché
┌─ L4: API REST ─────────────────────────────────────────────┐
│  GET /api/productos   (solo si no está en L2 ni L3)          │
│  GET /api/trabajos    (solo si no está en L2 ni L3)          │
│  POST/PUT/DELETE → invalidan L2 y L3                         │
└─────────────────────────────────────────────────────────────┘
```

### Resumen de llamadas API

| Escenario | Antes (sin DataContext) | Después (con DataContext) |
|---|---|---|
| Dashboard carga | 2 (productos + trabajos) | 2 (solo primera vez) |
| Dashboard → Productos | 4 (2+2, fetch duplicado) | 2 (compartidos en memoria) |
| Dashboard → Productos → Dashboard | 6 (2+2+2) | 2 (datos en contexto) |
| Dashboard → Productos → Trabajos → Dashboard | 8 (2+2+2+2) | 2 (una sola vez) |
| Recarga de página | 2 (cache.js fresh) | 2 (cache.js fresh) |
| **Navegación entre tabs** | **Nuevo fetch por cada container** | **Cero fetch adicionales** |

### Activity Log (persistencia local, sin API)

La actividad reciente se guarda en `localStorage` cuando el usuario hace cambios.
**Cero llamadas API.** Se combina con los cambios pendientes del PendingChangesContext.

---

## Flujo Completo de Lectura

```
1. Usuario navega a /dashboard

2. DashboardContainer → useEffect → loadIfNeeded()
   ↓
3. DataContext: productos===null? → getProductos()
   └─ cache.js isCached('/api/productos')? → retorna data cacheados (L3)
      └─ no → fetch GET /api/productos (L4)
   ↓
4. DataContext: trabajos===null? → getTrabajos()
   └─ mismo patrón que productos
   ↓
5. DataContext almacena productos[] y trabajos[] en estado React (L2)
   ↓
6. useMemo en DashboardContainer se gatilla:
   ├─ categoryDist     → filter + reduce sobre productos[]
   ├─ trabajosByCat    → filter + reduce sobre trabajos[]
   ├─ featuredProducts → filter sobre productos[].featured (carousel)
   ├─ priceStats       → map + Math sobre productos[].price
   ├─ audienceStats    → filter sobre productos[].audience
   ├─ priceHistogram   → buckets de rangos de precio
   ├─ topExpensive     → top 5 productos más caros
   ├─ recentProductos / recentTrabajos → orden por createdAt
   └─ activityLog      → localStorage getItem + pending changes
   ↓
7. DashboardView renderiza con todos los datos
   ↓
8. Usuario navega a /productos
   ↓
9. ProductosContainer → loadIfNeeded()
   DataContext: productos ya cargados → retorna inmediato
   getEffectiveList('productos', productos) → merge con pending changes
   ↓
10. Usuario navega de vuelta a /dashboard
    DataContext: datos en memoria → render inmediato (sin fetch)
    Todos los useMemo retornan valores cacheados (sin recálculo)
```

---

## Design System — Tokens y Estilos

### Paleta de Colores

```css
:root {
  --bg-page:          bg-slate-50
  --bg-card:          bg-white
  --bg-sidebar:       bg-slate-900
  --bg-sidebar-hover: bg-slate-800
  --bg-sidebar-active:bg-slate-700
  --bg-input:         bg-white
  --bg-badge:         bg-slate-100

  --border-default:   border-slate-200
  --border-input:     border-slate-300

  --text-primary:     text-slate-900
  --text-secondary:   text-slate-500
  --text-muted:       text-slate-400
  --text-sidebar:     text-white
  --text-sidebar-muted:text-slate-400

  --primary:          bg-blue-600
  --primary-hover:    bg-blue-700
  --danger:           bg-red-500
  --danger-hover:     bg-red-600
  --success:          bg-emerald-500
  --warning:          bg-amber-500
}
```

### Dark Mode

```css
.dark {
  --bg-page:          dark:bg-slate-900
  --bg-card:          dark:bg-slate-800
  --bg-sidebar:       dark:bg-slate-950
  --bg-input:         dark:bg-slate-700
  --border-default:   dark:border-slate-700
  --text-primary:     dark:text-slate-100
  --text-secondary:   dark:text-slate-400
}
```

### Tipografía

- **Tamaños:** `text-xs` (badges), `text-sm` (body/tablas/form inputs), `text-base` (form inputs), `text-lg` (subtítulos), `text-xl`/`text-2xl` (títulos de página)
- **Pesos:** `font-medium` (labels), `font-semibold` (headers tabla, subtítulos), `font-bold` (títulos, valores stats)

### Espaciado

| Contexto | Padding |
|---|---|
| Sidebar | `p-5` |
| Card | `p-6` |
| Table cell | `p-3` |
| Form modal | `p-8` |
| Form input | `p-2` |
| Button | `px-4 py-2` |
| Page content | `px-4 py-4 md:px-8 md:py-8` |

### Sombras

- Cards: `shadow-sm`
- Modales: `shadow-xl`
- Sidebar: `shadow-lg`
- Dropdowns: `shadow-md`

### Border Radius

- Inputs/Buttons: `rounded-md` (6px)
- Cards/Sections: `rounded-lg` (8px)
- Modales: `rounded-xl` (12px)
- Badges: `rounded-full`

---

## Mapa de Componentes Lucide

| Ubicación | Ícono | Import |
|---|---|---|
| **Sidebar** | | |
| Logo / Brand | `Package` | `lucide-react` |
| Dashboard link | `LayoutDashboard` | `lucide-react` |
| Productos link | `Package` | `lucide-react` |
| Trabajos link | `Briefcase` | `lucide-react` |
| Categorías link | `Tags` | `lucide-react` |
| Pedidos link | `ShoppingCart` | `lucide-react` |
| Reportes link | `BarChart3` | `lucide-react` |
| Configuración link | `Settings` | `lucide-react` |
| Pendientes badge | `Bell` | `lucide-react` |
| Dark mode toggle | `Moon` / `Sun` | `lucide-react` |
| Logout | `LogOut` | `lucide-react` |
| Cerrar panel/modal | `X` | `lucide-react` |
| Menú hamburguesa | `Menu` | `lucide-react` |
| **Acciones** | | |
| Nuevo | `Plus` | `lucide-react` |
| Editar | `Pencil` | `lucide-react` |
| Eliminar | `Trash2` | `lucide-react` |
| Guardar | `Save` | `lucide-react` |
| Cancelar | `Ban` | `lucide-react` |
| Buscar | `Search` | `lucide-react` |
| Exportar | `Download` | `lucide-react` |
| Filtrar | `Filter` | `lucide-react` |
| Ordenar | `ArrowUpDown` | `lucide-react` |
| **Estados** | | |
| Cargando | `Loader2` (animado) | `lucide-react` |
| Éxito | `CheckCircle2` | `lucide-react` |
| Error | `AlertCircle` | `lucide-react` |
| Advertencia | `AlertTriangle` | `lucide-react` |
| Vacío | `Inbox` | `lucide-react` |
| **Dashboard** | | |
| Productos count | `Package` | `lucide-react` |
| Trabajos count | `Briefcase` | `lucide-react` |
| Categorías count | `Tags` | `lucide-react` |
| Pedidos count | `ShoppingCart` | `lucide-react` |
| **Formularios** | | |
| Destacado | `Star` | `lucide-react` |
| Imagen | `Image` | `lucide-react` |
| Descripción | `FileText` | `lucide-react` |
| Tags | `Hash` | `lucide-react` |
| Precio | `DollarSign` | `lucide-react` |
| **Cambios Pendientes** | | |
| Nuevo (item) | `PlusCircle` | `lucide-react` |
| Modificado | `Edit3` | `lucide-react` |
| Eliminación | `Trash2` | `lucide-react` |
| Descartar | `XCircle` | `lucide-react` |
| Guardar todo | `Upload` | `lucide-react` |

### Reglas de importación de lucide

```jsx
// ✅ Correcto: importación directa (tree-shakeable)
import { Package, Search, Pencil, Trash2 } from 'lucide-react';

// ❌ Incorrecto: NO importar todo
import * as Lucide from 'lucide-react';  // ← aumenta bundle size

// ✅ Uso con tamaño explícito
<Package size={20} className="text-slate-400" />

// ✅ Tamaños recomendados:
//   Sidebar icons:    size={20}
//   Button icons:     size={16} (sm), size={18} (md), size={20} (lg)
//   Card icons:       size={24}
//   Empty state:      size={48} className="text-slate-300"
//   Loading spinner:  size={24} className="animate-spin"
```

---

## Fase 1: Infraestructura Base

> **✅ COMPLETA (2026-08-01)** — Todos los puntos 1.1–1.9 implementados y verificados con `npm run build`.
> **Objetivo:** Establecer la base visual + el sistema de datos compartido + utilidades.
> Todo lo que sigue depende de esta fase — por eso DataContext ya está aquí.

### 1.1 Instalar dependencias

```bash
npm install lucide-react
# ya instalado
```

### 1.2 Crear `src/context/DataContext.jsx` ← NUEVO (corazón del proyecto)

Cache compartida en memoria React. Todos los Containers consumen `useData()` en vez de llamar `getProductos()` directamente.

```jsx
// Almacena productos, trabajos (y futuro: categorias, pedidos) en un solo lugar
// Carga perezosa: solo cuando algún componente lo solicita
// Expone: { productos, trabajos, loading, loadIfNeeded, refreshAll }

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getProductos } from '../lib/productos';
import { getTrabajos } from '../lib/trabajos';
// Futuro: import { getCategorias } from '../lib/categorias';
// Futuro: import { getPedidos } from '../lib/pedidos';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [productos, setProductos] = useState(null);  // null = no cargado
  const [trabajos, setTrabajos] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadIfNeeded = useCallback(async () => {
    if (productos !== null && trabajos !== null) return;
    setLoading(true);
    try {
      const [p, t] = await Promise.all([
        productos !== null ? Promise.resolve(productos) : getProductos(),
        trabajos !== null ? Promise.resolve(trabajos) : getTrabajos(),
      ]);
      if (productos === null) setProductos(p);
      if (trabajos === null) setTrabajos(t);
    } catch (err) {
      console.error('Error loading data:', err);
    }
    setLoading(false);
  }, [productos, trabajos]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([getProductos(), getTrabajos()]);
      setProductos(p);
      setTrabajos(t);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    productos: productos ?? [],
    trabajos: trabajos ?? [],
    loading: loading || (productos === null && trabajos === null),
    loadIfNeeded,
    refreshAll,
  }), [productos, trabajos, loading, loadIfNeeded, refreshAll]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
}
```

### 1.3 Integrar DataProvider en `src/middleware/AppRouter.jsx`

```jsx
import { DataProvider } from '../context/DataContext';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>             {/* ← NUEVO: datos compartidos */}
          <PendingChangesProvider> {/* ← PendingChanges POR ENCIMA de DataContext */}
            <Routes>
              <Route path="/" element={<AuthContainer />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardContainer /></ProtectedRoute>} />
              <Route path="/productos" element={<ProtectedRoute><ProductosContainer /></ProtectedRoute>} />
              <Route path="/trabajos" element={<ProtectedRoute><TrabajosContainer /></ProtectedRoute>} />
              <Route path="/categorias" element={<ProtectedRoute><CategoriasContainer /></ProtectedRoute>} />
              <Route path="/pedidos" element={<ProtectedRoute><PedidosContainer /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PendingChangesProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

> **Nota:** `PendingChangesProvider` va dentro de `DataProvider` porque los Containers consumen ambos (`useData()` + `usePendingChanges()`). El orden de providers implementado es: Auth → Theme → Data → Pending → Toast → Routes (Theme y Toast se añadieron además de lo planificado).

### 1.4 Crear `src/context/ThemeContext.jsx`

```jsx
// Contexto para tema claro/oscuro con persistencia en localStorage
// State: theme ('light' | 'dark')
// Expone: { theme, toggleTheme, isDark }
// Efecto: añade/remueve clase 'dark' en document.documentElement
// Persistencia: localStorage key 'theme'
```

### 1.5 Refactor `src/pages/index.astro`

> **⚠️ Implementado con enfoque mejorado:** en vez de `<style>` scoped, el CSS se centralizó en `src/styles/global.css`. Razón: el `<style>` scoped de Astro generaba selectores `data-astro-cid-*` que rompían el preflight de Tailwind (ver "Extras corregidos").

`src/pages/index.astro` actual:
```astro
---
import AppRouter from '../middleware/AppRouter';
import '../styles/global.css';
---
<html lang="es">
  <head>
    <!-- Script anti-FOUC: aplica .dark antes del render -->
    <script>
      (function() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body>
    <AppRouter client:only="react" />
  </body>
</html>
```

`src/styles/global.css` (núcleo del design system):
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@theme { /* animaciones + font-sans */ }
@layer base { /* body bg/text, color-scheme, scrollbar, selection */ }
```

### 1.6 Crear `src/utils/activityLog.js`

Persistencia de actividad reciente en localStorage. Cero llamadas API.

```js
const STORAGE_KEY = 'activityLog';
const MAX_ENTRIES = 100;

export function logActivity(entry) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    log.unshift({
      ...entry,
      id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
    });
    if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch { /* localStorage lleno o deshabilitado — silencioso */ }
}

export function getActivityLog(limit = 50) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return log.slice(0, limit);
  } catch { return []; }
}

export function clearActivityLog() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
```

### 1.7 Crear componentes base en `src/components/ui/`

#### Button.jsx
```jsx
// Props: variant ('primary' | 'secondary' | 'danger' | 'ghost' | 'outline')
//        size ('sm' | 'md' | 'lg')
//        icon (nombre de lucide-react, opcional)
//        iconPosition ('left' | 'right')
//        loading (boolean, muestra Loader2 animado)
//        disabled, onClick, type, children, className
//
// Variantes:
//   primary:   bg-blue-600 text-white hover:bg-blue-700
//   secondary: bg-slate-100 text-slate-700 hover:bg-slate-200
//   danger:    bg-red-500 text-white hover:bg-red-600
//   ghost:     text-slate-600 hover:bg-slate-100
//   outline:   border border-slate-300 text-slate-700 hover:bg-slate-50
//
// Dark mode:
//   primary:   dark:bg-blue-500 dark:hover:bg-blue-600
//   secondary: dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600
//   outline:   dark:border-slate-600 dark:text-slate-300
```

#### Input.jsx
```jsx
// Props: label, error, icon (lucide), type, className, ...
// Renderiza: label + ícono + input + mensaje de error
// inputClass: w-full p-2 border rounded-md text-sm
//   default:  border-slate-300
//   error:    border-red-400 focus:ring-red-400
//   dark:     dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100
```

#### Badge.jsx
```jsx
// Props: variant ('default' | 'success' | 'warning' | 'danger' | 'info')
//        size ('sm' | 'md'), icon (opcional), children
//
// Colores:
//   default: bg-slate-100 text-slate-700
//   success: bg-emerald-100 text-emerald-700
//   warning: bg-amber-100 text-amber-700
//   danger:  bg-red-100 text-red-700
//   info:    bg-blue-100 text-blue-700
```

#### Card.jsx
```jsx
// Props: title, subtitle, icon, action (botón), className, children
// Estructura: bg-white rounded-lg shadow-sm p-6
//   dark: dark:bg-slate-800 dark:border-slate-700
```

#### Modal.jsx
```jsx
// Props: isOpen, onClose, title, size ('sm' | 'md' | 'lg' | 'xl' | 'full'),
//        children, footer
//
// - Responsive: mobile slide-up, desktop fade-in centered
// - Cierra con Escape y click en overlay
// - Auto-focus primer input
// - size → max-w-sm / max-w-lg / max-w-2xl / max-w-4xl / max-w-full
```

#### Toast.jsx + ToastProvider
```jsx
// Sistema de notificaciones tipo toast
// ToastProvider: contexto + contenedor fijo (top-right)
// useToast(): { toast({ type, title, message, duration? }) }
//
// Tipos: 'success' | 'error' | 'warning' | 'info'
// Iconos lucide: CheckCircle2, AlertCircle, AlertTriangle, Info
// Auto-dismiss por duración (default 4s)
// Colores: border-l-4 (emerald/red/amber/blue)
```

### 1.8 Refactor componentes existentes (transición progresiva)

1. **ProductosContainer.jsx** — Reemplazar `getProductos()` propio por `useData()`:
   ```jsx
   const { productos, loading, loadIfNeeded } = useData();
   useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);
   const effectiveData = getEffectiveList('productos', productos);
   ```
2. **TrabajosContainer.jsx** — Mismo patrón, usar `useData()`
3. **DashboardContainer.jsx** — Mismo patrón, usar `useData()`
4. **Layout.jsx** — Reemplazar emojis/text buttons por componentes `<Button>` con lucide
5. **DataTable.jsx** — Reemplazar botones por `<Button variant="ghost">`, empty state con lucide
6. **ConfirmDialog.jsx** — Refactor para usar `<Modal>` + `<Button>`
7. **ProductForm.jsx, TrabajoForm.jsx** — Usar `<Input>`, `<Button>`, `<Badge>`
8. **AuthView.jsx** — Rediseño con logo, íconos en inputs, mejor layout

### 1.9 Integrar ActivityLog en Containers

**En ProductosContainer.jsx:**
```jsx
import { logActivity } from '../../utils/activityLog';

// handleSave:
logActivity({ type: editing ? 'update' : 'create', resource: 'producto', label: data.name || 'Sin nombre' });

// confirmDeletes:
logActivity({ type: 'delete', resource: 'producto', label: `${confirmDelete.length} producto(s)` });
```

**En TrabajosContainer.jsx:**
```jsx
import { logActivity } from '../../utils/activityLog';

// handleSave:
logActivity({ type: editing ? 'update' : 'create', resource: 'trabajo', label: data.title || 'Sin nombre' });

// confirmDeletes:
logActivity({ type: 'delete', resource: 'trabajo', label: `${confirmDelete.length} trabajo(s)` });
```

---

## Fase 2: Layout + Navegación + Buscador + Dark Mode

> **Estado: ✅ COMPLETA (2026-08-01)** — Todos los puntos 2.1–2.4 implementados y verificados con `npm run build`.
> **DataContext disponible** — el buscador global lo usa para buscar sin llamadas API.

### 2.1 Layout rediseñado — ✅ Completo

**Implementado:**
- Sidebar desktop fijo: `hidden md:flex fixed left-0 w-60 md:w-64 bg-slate-900 dark:bg-slate-950` + `<main md:ml-64>`
- Active state con barra izquierda: `border-l-2 border-blue-400 bg-slate-700/40` (desktop y menú móvil), hover `bg-slate-800`
- Mobile top bar: `Menu · Admin · Search · theme · Bell` (ícono `Search` abre el buscador global)
- Botón `Search` en sidebar desktop con hint `<kbd>Ctrl K</kbd>`
- Atajo global `Ctrl+K` / `Cmd+K` (con `preventDefault`) registrado en Layout
- Links **Categorías** y **Pedidos** NO se muestran aún (se agregan en Fase 4/5 cuando existan sus rutas)
- Transición suave: `transition-colors duration-200` en el contenedor raíz
- `GlobalSearch` renderizado en el Layout (`isOpen`/`onClose`)

### 2.2 Buscador Global — ✅ Completo

**Componente: `src/components/layout/GlobalSearch.jsx`**

**Implementado:**
- Trigger: `Ctrl+K`/`Cmd+K` (registrado en Layout) o click en ícono `Search` (topbar mobile + sidebar)
- **Lee datos de DataContext** (`useData()`) + `usePendingChanges().getEffectiveList` → incluye items offline pendientes. Cero llamadas API
- Filtra en tiempo real productos y trabajos por `name`/`title` y `category` (case-insensitive)
- Resultados agrupados: secciones "Productos" (`Package`) y "Trabajos" (`Briefcase`), cada item con categoría y badges "Nuevo"/"Pendiente"
- Navegación por teclado: `↑`/`↓` (con wrap y `scrollIntoView`), `Enter` navega al item activo, `Escape` cierra
- Navegación con mouse: `onMouseMove` actualiza el item activo
- Click / `Enter` → `navigate('/productos?buscar=<name>')` o `/trabajos?buscar=<title>` (**Opción 2:** filtro en la tabla existente, sin rutas de detalle). Se usa el nombre del item (no el término tecleado) para que el item exacto aparezca arriba
- UI: overlay `z-[70]`, backdrop `bg-black/50`, contenedor `max-w-xl` centrado con animaciones `animate-fade-in`, dark mode completo, estados vacíos (sin query / sin resultados) y footer con hints de teclado
- Se resetea la query al abrir

### 2.2b Búsqueda local en listas (Productos / Trabajos)

Para soportar la navegación `?buscar=X` del buscador global:
- `ProductosContainer` y `TrabajosContainer`: usan `useSearchParams()` (react-router v7). `query = searchParams.get('buscar')`, filtran `effectiveData` con `useMemo` y `handleSearch` escribe `setSearchParams({ buscar })`
- `ProductosView` y `TrabajosView`: input de búsqueda local (`<Input icon={Search}>` + botón `X`) sincronizado con el `?buscar=` del URL — funciona en ambos sentidos (escribir en la página actualiza el URL, y navegar desde el buscador global pre-rellena el input y filtra la tabla)

### 2.3 Dark Mode Toggle — ✅ COMPLETO

- `ThemeContext` creado en Fase 1 ✅
- Toggle en sidebar (`Moon`/`Sun` con label) ✅
- Toggle en topbar mobile (ícono) ✅
- Persistencia en `localStorage` (clave `theme`) ✅
- Default respeta `prefers-color-scheme` (en `index.astro` + `getInitialTheme`) ✅
- Implementado con `@custom-variant dark` en `global.css` (no media query) ✅

**Extra:** se recomienda añadir `transition-colors duration-200` en el contenedor raíz (`Layout`) para transición suave.

### 2.4 PendingChangesPanel actualizado — ✅ COMPLETO

- Íconos lucide en secciones (`PlusCircle`, `Edit3`, `Trash2`) ✅
- `PendingResourceSection` y `PendingItem` con lucide + dark mode ✅
- Botón "Guardar todo" con `<Button icon={Upload}>` ✅
- Botón "Descartar todo" con `<Button variant="outline" icon={Trash2}>` + `ConfirmDialog` (no `confirm()`) ✅
- `BatchSaveModal` con `Modal` + `Button` + lucide + **`refreshAll()` tras éxito** ✅
- **Fix móvil:** panel `z-[60]` (por encima de top bar `z-50`), overlay `z-[55]`, modales `z-[70]` ✅
- **Bloqueo de scroll** del fondo mientras el panel está abierto ✅
- **Toast** integrado en acciones (guardar, descartar, errores) ✅

---

## Fase 3: Dashboard con Reportes y Estadísticas

> **✅ COMPLETA (2026-08-02)** — Todos los puntos 3.1–3.11 implementados + mejoras adicionales, verificados con `npm run build`.
> **Cero llamadas API adicionales.** Todo se computa desde `DataContext` (Fase 1).
> **Nota:** los snippets 3.3–3.10 documentan el plan original; el código real incorpora las mejoras listadas en la sección **3.12**.

### 3.1 Arquitectura de Datos

```
DataContext (compartido, cargado en Fase 1)
  ├── productos[] ← GET /api/productos (ya cargado)
  ├── trabajos[]  ← GET /api/trabajos  (ya cargado)
  │
  └── DashboardContainer
        ├── getEffectiveList('productos'/'trabajos') → stats incluyen offline pendientes
        ├── useMemo → stats (stats.js, funciones puras):
        │     ├── categoryDist / trabajosByCat   → getCategoryDist (agrupa 'Otros')
        │     ├── featuredProducts               → getFeaturedProducts (carousel)
        │     ├── priceStats                     → getPriceStats (avg/max/min)
        │     ├── audienceStats                  → getAudienceStats
        │     ├── priceHistogram                 → getPriceHistogram (buckets)
        │     ├── topExpensive                   → getTopExpensive (top 5)
        │     ├── recentProductos/recentTrabajos → getRecentAdded (por createdAt)
        │     └── activityLog                    → buildActivityFeed (localStorage + pending)
```

### 3.2 Estructura de Archivos

```
src/features/dashboard/
├── stats.js                 ← Funciones puras de cómputo (testables, sin side-effects)
├── format.js                ← timeAgo() + formatCurrency() (Intl es-VE)
├── DashboardContainer.jsx   ← Lógica: DataContext + getEffectiveList + stats.js
├── DashboardView.jsx        ← UI: layout grid + composición de subcomponentes
├── StatCard.jsx             ← Card compacta horizontal, clicable (prop `to`)
├── CategoryBarChart.jsx     ← Barras horizontales CSS con % real sobre el total
├── FeaturedProducts.jsx     ← Card grande con mini carousel de destacados
├── PriceHistogram.jsx       ← Barras por rangos de precio (buckets)
├── TopExpensive.jsx         ← Top 5 productos más caros
├── RecentAdded.jsx          ← Últimos productos/trabajos agregados (createdAt)
├── MiniStatsGrid.jsx        ← Grid mini (Precios + Audiencia)
├── ActivityFeed.jsx         ← Actividad reciente (localStorage + pendientes)
├── QuickActions.jsx         ← Botones "Nuevo Producto" / "Nuevo Trabajo"
├── DashboardSkeleton.jsx    ← Skeleton de carga (reemplaza "Cargando...")
└── index.js                 ← Re-exportaciones
```

### 3.3 DashboardContainer — Lógica

```jsx
import { useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { getActivityLog } from '../../utils/activityLog';
import { PRODUCT_CATEGORIES, TRABAJO_CATEGORIES } from '../../utils/constants';
import DashboardView from './DashboardView';

export default function DashboardContainer() {
  const { productos, trabajos, loading, loadIfNeeded } = useData();
  const { getResourceCounts, state, pendingCount } = usePendingChanges();

  useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);

  const data = productos || [];
  const tdata = trabajos || [];

  const categoryCount = useMemo(() => new Set(data.map(p => p.category)).size, [data]);

  const categoryDist = useMemo(() => {
    if (!data.length) return [];
    return PRODUCT_CATEGORIES.map(cat => ({
      name: cat,
      count: data.filter(p => p.category === cat).length,
    })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
  }, [data]);

  const trabajosByCat = useMemo(() => {
    if (!tdata.length) return [];
    return TRABAJO_CATEGORIES.map(cat => ({
      name: cat,
      count: tdata.filter(t => t.category === cat).length,
    })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
  }, [tdata]);

  const featuredStats = useMemo(() => ({
    featured: data.filter(p => p.featured).length,
    notFeatured: data.length - data.filter(p => p.featured).length,
  }), [data]);

  const priceStats = useMemo(() => {
    const prices = data.map(p => Number(p.price)).filter(p => !isNaN(p) && p > 0);
    if (!prices.length) return null;
    return {
      avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0),
      max: Math.max(...prices).toFixed(0),
      min: Math.min(...prices).toFixed(0),
    };
  }, [data]);

  const audienceStats = useMemo(() => ({
    general: data.filter(p => p.audience?.general?.available).length,
    business: data.filter(p => p.audience?.business?.available).length,
  }), [data]);

  const totalQuantity = useMemo(
    () => tdata.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0),
    [tdata]
  );

  const activityLog = useMemo(() => {
    const pending = [];
    state.productos.creates.forEach(c => pending.push({ id: c.tempId, type: 'create', resource: 'producto', label: getName(c.data), date: new Date().toISOString() }));
    Object.entries(state.productos.updates).forEach(([id, u]) => pending.push({ id, type: 'update', resource: 'producto', label: getName(u.modified), date: new Date().toISOString() }));
    state.pendingDeletes.productos.forEach(id => pending.push({ id, type: 'delete', resource: 'producto', label: `ID: ${id}`, date: new Date().toISOString() }));
    state.trabajos.creates.forEach(c => pending.push({ id: c.tempId, type: 'create', resource: 'trabajo', label: getName(c.data), date: new Date().toISOString() }));
    Object.entries(state.trabajos.updates).forEach(([id, u]) => pending.push({ id, type: 'update', resource: 'trabajo', label: getName(u.modified), date: new Date().toISOString() }));
    state.pendingDeletes.trabajos.forEach(id => pending.push({ id, type: 'delete', resource: 'trabajo', label: `ID: ${id}`, date: new Date().toISOString() }));
    const history = getActivityLog().slice(0, 20);
    return [...pending.slice(0, 10), ...history].slice(0, 30);
  }, [state]);

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');

  return (
    <DashboardView
      loading={loading}
      productosCount={data.length}
      trabajosCount={tdata.length}
      categoryCount={categoryCount}
      productosPending={pCounts.total}
      trabajosPending={tCounts.total}
      categoryDist={categoryDist}
      trabajosByCat={trabajosByCat}
      featuredStats={featuredStats}
      priceStats={priceStats}
      audienceStats={audienceStats}
      totalQuantity={totalQuantity}
      activityLog={activityLog}
      pendingCount={pendingCount}
    />
  );
}

function getName(d) { return d?.name || d?.title || d?.label || 'Sin nombre'; }
```

### 3.4 DashboardView — Layout

```jsx
import Layout from '../../components/layout/Layout';
import { LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import StatCard from './StatCard';
import CategoryBarChart from './CategoryBarChart';
import MiniStatsGrid from './MiniStatsGrid';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import DashboardSkeleton from './DashboardSkeleton';

export default function DashboardView({
  loading, productosCount, trabajosCount, categoryCount,
  productosPending, trabajosPending, categoryDist, trabajosByCat,
  featuredStats, priceStats, audienceStats, totalQuantity,
  activityLog, pendingCount,
}) {
  const navigate = useNavigate();
  if (loading) return <DashboardSkeleton />;

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={24} className="text-slate-700 dark:text-slate-300" />
          <h1 className="text-xl md:text-2xl font-bold dark:text-white">Dashboard</h1>
        </div>
        <QuickActions onNewProducto={() => navigate('/productos')} onNewTrabajo={() => navigate('/trabajos')} />
      </div>

      {/* Row 1: Stat Cards (4 columnas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard iconName="Package" title="Productos" value={productosCount} pending={productosPending} color="blue" />
        <StatCard iconName="Briefcase" title="Trabajos" value={trabajosCount} pending={trabajosPending} color="amber" />
        <StatCard iconName="Tags" title="Categorías" value={categoryCount} color="emerald" />
        <StatCard iconName="Hash" title="Total Cantidad" value={totalQuantity} color="purple" />
      </div>

      {/* Row 2: Charts (2 columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Productos por Categoría
          </h3>
          <CategoryBarChart data={categoryDist} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Trabajos por Categoría
          </h3>
          <CategoryBarChart data={trabajosByCat} color="amber" />
        </div>
      </div>

      {/* Row 3: Mini Stats */}
      <MiniStatsGrid featuredStats={featuredStats} priceStats={priceStats} audienceStats={audienceStats} />

      {/* Row 4: Activity Feed */}
      <div className="mb-6">
        <ActivityFeed entries={activityLog} />
      </div>
    </Layout>
  );
}
```

### 3.5 StatCard — Rediseñado

```jsx
import { Package, Briefcase, Tags, Hash, ShoppingCart } from 'lucide-react';

const ICON_MAP = { Package, Briefcase, Tags, Hash, ShoppingCart };
const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400' },
  emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400' },
};

export default function StatCard({ iconName, title, value, pending, color = 'blue' }) {
  const Icon = ICON_MAP[iconName];
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          {Icon && <Icon size={18} className={colors.icon} />}
        </div>
        <h3 className="text-sm text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
      <div className="flex items-baseline gap-3">
        <p className={`text-4xl font-bold ${colors.value}`}>{value}</p>
        {pending > 0 && (
          <span className="text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 px-2 py-1 rounded font-medium">
            {pending} pendiente(s)
          </span>
        )}
      </div>
    </div>
  );
}
```

### 3.6 CategoryBarChart — Gráfico de barras (CSS puro)

```jsx
import { Inbox } from 'lucide-react';

export default function CategoryBarChart({ data, color = 'blue' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
        <Inbox size={32} className="mb-2" />
        <p className="text-sm">Sin datos</p>
      </div>
    );
  }
  const max = Math.max(...data.map(d => d.count));
  const barColor = color === 'amber' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-blue-500 dark:bg-blue-400';

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium capitalize text-slate-700 dark:text-slate-300">{item.name}</span>
            <span className="text-slate-500 dark:text-slate-400">{item.count} ({Math.round((item.count / max) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 dark:bg-slate-700">
            <div className={`${barColor} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 3.7 MiniStatsGrid — Featured, Precios, Audiencia

```jsx
import { Star, DollarSign, Users } from 'lucide-react';

export default function MiniStatsGrid({ featuredStats, priceStats, audienceStats }) {
  const sections = [
    {
      icon: Star, title: 'Destacados', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30',
      items: [
        { label: 'Destacados', value: featuredStats?.featured ?? 0, color: 'text-emerald-600' },
        { label: 'Normales', value: featuredStats?.notFeatured ?? 0, color: 'text-slate-500' },
      ],
    },
    {
      icon: DollarSign, title: 'Precios (Bs)', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      items: priceStats
        ? [
          { label: 'Promedio', value: priceStats.avg, color: 'text-blue-600' },
          { label: 'Máximo', value: priceStats.max, color: 'text-amber-600' },
          { label: 'Mínimo', value: priceStats.min, color: 'text-emerald-600' },
        ]
        : [{ label: 'Sin precios', value: '-', color: 'text-slate-400' }],
    },
    {
      icon: Users, title: 'Audiencia', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30',
      items: [
        { label: 'General disponible', value: audienceStats?.general ?? 0, color: 'text-blue-600' },
        { label: 'Business disponible', value: audienceStats?.business ?? 0, color: 'text-purple-600' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${section.bg}`}><section.icon size={16} className={section.color} /></div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{section.title}</h3>
          </div>
          <div className="space-y-2">
            {section.items.map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className={`text-lg font-bold ${item.color} dark:opacity-90`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 3.8 ActivityFeed

```jsx
import { Clock, PlusCircle, Edit3, Trash2, Inbox } from 'lucide-react';

const ACTION_CONFIG = {
  create: { icon: PlusCircle, label: 'Creado', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  update: { icon: Edit3, label: 'Modificado', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  delete: { icon: Trash2, label: 'Eliminado', bg: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

export default function ActivityFeed({ entries = [] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actividad Reciente</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500">
          <Inbox size={28} className="mb-2" />
          <p className="text-sm">Sin actividad reciente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actividad Reciente</h3>
      </div>
      <div className="space-y-1">
        {entries.slice(0, 10).map(entry => {
          const config = ACTION_CONFIG[entry.type] || ACTION_CONFIG.update;
          return (
            <div key={entry.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className={`p-1.5 rounded-full ${config.bg}`}><config.icon size={14} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
                  <span className="font-medium capitalize">{entry.resource}</span> {config.label.toLowerCase()}: <span className="font-medium">{entry.label}</span>
                </p>
              </div>
              {entry.date && <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(entry.date)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 3.9 DashboardSkeleton

```jsx
import Layout from '../../components/layout/Layout';

export default function DashboardSkeleton() {
  return (
    <Layout>
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6 dark:bg-slate-700" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-slate-200 rounded-lg dark:bg-slate-700" />
                <div className="h-4 bg-slate-200 rounded w-20 dark:bg-slate-700" />
              </div>
              <div className="h-9 bg-slate-200 rounded w-16 dark:bg-slate-700" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="h-4 bg-slate-200 rounded w-48 mb-6 dark:bg-slate-700" />
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="mb-4">
                  <div className="h-3 bg-slate-200 rounded w-16 mb-2 dark:bg-slate-700" />
                  <div className="h-3 bg-slate-200 rounded-full dark:bg-slate-700" style={{ width: `${40 + j * 12}%` }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

### 3.10 QuickActions

```jsx
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function QuickActions({ onNewProducto, onNewTrabajo }) {
  return (
    <div className="flex gap-2">
      <Button icon={Plus} size="sm" onClick={onNewProducto}>Nuevo Producto</Button>
      <Button icon={Plus} variant="secondary" size="sm" onClick={onNewTrabajo}>Nuevo Trabajo</Button>
    </div>
  );
}
```

### 3.11 Mapa de Estados

| Componente | Loading | Normal | Vacío | Error | Edge Cases |
|---|---|---|---|---|---|
| **StatCard** | DashboardSkeleton | Valor + badge | Muestra "0" | N/A | pending badge solo si > 0; clicable si `to` |
| **CategoryBarChart** | No render (View espera) | Barras con colores | `Inbox` + "Sin datos" | N/A | max=0 → división segura; % real sobre total |
| **FeaturedProducts** | No render | Mini carousel (img, nombre, cat, precio) | `Inbox` + "Sin destacados" | N/A | sin imagen/fallo → placeholder; auto-play se pausa al hover |
| **PriceHistogram** | No render | Barras por rangos de precio | `Inbox` + "Sin precios" | N/A | sin precios → buckets vacíos |
| **TopExpensive** | No render | Ranking top 5 con precio | `Inbox` + "Sin productos con precio" | N/A | sin precio válido → excluido |
| **RecentAdded** | No render | Lista ordenada por createdAt | `Inbox` + "Sin registros con fecha" | N/A | items sin createdAt → excluidos |
| **MiniStatsGrid** | No render | Grid 2 columnas (Precios, Audiencia) | Audiencia 0; Precios: fallback | N/A | priceStats puede ser null |
| **ActivityFeed** | No render | Lista timestamps | `Inbox` + "Sin actividad" | N/A | entries vacío → empty state |
| **DashboardView** | DashboardSkeleton | Layout completo | Stats en 0 | DashboardSkeleton | Combina loading del DataContext |
| **DataContext** | `loading=true` | `productos[]` + `trabajos[]` | Arrays vacíos | Error silencioso | `?? []` para downstream |

### 3.12 Mejoras implementadas (fuera del plan original)

Durante la implementación se aplicaron mejoras y correcciones no previstas en el checklist original:

1. **Lógica extraída a `stats.js`** — Funciones puras y testables (`getCategoryDist`, `getPriceStats`, `getPriceHistogram`, `buildActivityFeed`, etc.). El Container solo compone `useMemo`.
2. **Stats con cambios pendientes offline** — `DashboardContainer` usa `getEffectiveList()` en vez de los arrays crudos, por lo que los counts reflejan creates/updates/deletes sin guardar (coherente con el offline-first). Los items marcados para eliminar se filtran (`!__pendingDelete`).
3. **% real en `CategoryBarChart`** — Bug corregido: el % se calculaba relativo a la categoría con más items (`count/max`) en vez del total. Ahora muestra el peso real sobre el total (`count/total`); la barra sigue escalada al máximo para lectura visual.
4. **Agrupación "Otros"** — `getCategoryDist` agrupa en "Otros" cualquier categoría fuera de las constantes (o vacía), de modo que los pesos siempre suman 100%.
5. **Card grande de Destacados (`FeaturedProducts`)** — Mini carousel con imagen, nombre, categoría y precio; flechas + dots, auto-play 4s con pausa al hover, badge "X de Y" en el header.
6. **Layout reorganizado** — Fila de gráficos a 3 columnas (Productos por Categoría, Trabajos por Categoría, Destacados). `MiniStatsGrid` pasa a 2 cards (Precios + Audiencia).
7. **StatCards compactas y clicables** — Rediseño horizontal (`p-4`, valor `text-2xl`) que ocupa ~40% de la altura original; navegan a su sección vía `to` (Link). Se eliminó la card "Total Cantidad" (sin datos reales).
8. **QuickActions reubicados** — Los botones "Nuevo Producto"/"Nuevo Trabajo" se movieron a una fila propia debajo de las StatCards (header solo con título). Labels siempre visibles + `aria-label`.
9. **`?nuevo=1`** — `ProductosContainer` y `TrabajosContainer` abren el formulario automáticamente al recibir el query param (limpian el param tras abrir).
10. **`Button.jsx` spread `...rest`** — Acepta `aria-label`, `title`, etc. (mejora compatible con todo el proyecto).
11. **`Card.jsx` prop `iconClassName`** — Permite colorear el ícono del header (compatible hacia atrás, default `text-slate-500`).
12. **`format.js`** — `timeAgo()` y `formatCurrency()` (Intl `es-VE`) reutilizados por ActivityFeed, RecentAdded, TopExpensive y MiniStatsGrid.
13. **Código muerto eliminado** — `getFeaturedStats` y `getTotalQuantity` removidos tras el rediseño (se limpiaron imports y re-exports).

---

## Fase 4: Gestión de Categorías

> **Datos no sensibles.** Usan el mismo patrón offline-first que productos/trabajos.
> `categorias[]` se añade al DataContext compartido. Sin API: fallback localStorage.

### 4.1 Extender DataContext para incluir categorías

```jsx
// En DataContext.jsx, añadir:
const [categorias, setCategorias] = useState(null);

// loadIfNeeded actualizado:
const loadIfNeeded = useCallback(async () => {
  if (productos !== null && trabajos !== null && categorias !== null) return;
  const [p, t, c] = await Promise.all([
    productos !== null ? null : getProductos(),
    trabajos !== null ? null : getTrabajos(),
    categorias !== null ? null : getCategorias(),
  ]);
  if (p && productos === null) setProductos(p);
  if (t && trabajos === null) setTrabajos(t);
  if (c && categorias === null) setCategorias(c);
}, [productos, trabajos, categorias]);
```

### 4.2 Reemplazar constants.js por datos dinámicos

`PRODUCT_CATEGORIES` y `TRABAJO_CATEGORIES` se obtienen de la API (`/api/categorias?type=producto` y `?type=trabajo`), con fallback a constantes hardcodeadas mientras no haya API.

### 4.3 Pantalla `/categorias`

- CRUD completo con tabla + formulario
- Dos secciones: Categorías de Productos y Categorías de Trabajos (filtradas por `type`)
- Formulario inline/modal con nombre + descripción opcional
- Íconos en tabla: `Tags` para producto, `Briefcase` para trabajo
- Badge de tipo: "Producto" (`bg-blue-100`) / "Trabajo" (`bg-amber-100`)

### 4.4 Contrato API

```js
// src/lib/categorias.js — mismo patrón que productos.js, con cache.js L3

GET    /api/categorias
  → 200 { data: Categoria[] }

GET    /api/categorias/:id
  → 200 Categoria
  → 404 { error: 'Categoría no encontrada' }

POST   /api/categorias
  Body: { type: 'producto' | 'trabajo', name: string, description?: string }
  → 201 Categoria
  → 400 { error: string, fields?: Record<string, string> }

PUT    /api/categorias/:id
  Body: { name?: string, description?: string }
  → 200 Categoria
  → 404 { error: 'Categoría no encontrada' }

DELETE /api/categorias/:id
  → 200 { success: true }
  → 409 { error: 'Categoría en uso — tiene productos o trabajos asociados' }
  → 404 { error: 'Categoría no encontrada' }
```

Modelo:
```json
{
  "id": "cat_001",
  "type": "producto",
  "name": "Tazas",
  "description": "Tazas personalizadas",
  "createdAt": "2026-07-29T10:00:00Z",
  "updatedAt": "2026-07-29T10:00:00Z"
}
```

### 4.5 Fallback localStorage

Mientras no haya endpoint `/api/categorias`, el estado se persiste en localStorage (clave `categorias`). Al migrar a API real, los datos locales deben migrarse o convivir con los remotos.

---

## Fase 5: Gestión de Pedidos

> **⚠️ Contiene PII (nombre, teléfono, email). NO usa offline-first.**
> Los pedidos se guardan **directo a la API**. Sin cache L3, sin localStorage, sin PendingChangesContext.
> Solo DataContext en memoria (L2) durante la sesión del navegador.

### 5.1 Modelo

```js
{
  id: 'ped_001',
  customerName: 'Juan Pérez',
  customerPhone: '0412-1234567',
  customerEmail: 'juan@email.com',
  productId: 'prod_001',
  productName: 'Taza personalizada',
  quantity: 3,
  notes: 'Logo corporativo en azul',
  status: 'pending',  // pending | in_progress | completed | delivered | cancelled
  total: 450,
  createdAt: '2026-07-29T...',
  updatedAt: '2026-07-29T...',
}
```

### 5.2 Pantalla `/pedidos`

- Tabla con columnas: ID, Cliente, Producto, Cantidad, Total, Estado, Fecha, Acciones
- Formulario: cliente (nombre, teléfono, email), producto (select de DataContext), cantidad, notas, estado
- Badge de estado con color:
  - Pendiente: `bg-amber-100 text-amber-700`
  - En Proceso: `bg-blue-100 text-blue-700`
  - Completado: `bg-emerald-100 text-emerald-700`
  - Entregado: `bg-slate-100 text-slate-700`
  - Cancelado: `bg-red-100 text-red-700`
- Filtros por estado y fecha
- Botón "Nuevo Pedido" abre modal con formulario

### 5.3 Estrategia de Cache

```
PedidosContainer
  ├── Lectura: DataContext.pedidos[] (L2, solo memoria)
  │     └── loadIfNeeded() → GET /api/pedidos (NUNCA pasa por cache.js L3)
  ├── Escritura: POST/PUT/DELETE directo a API
  │     └── NO pasa por PendingChangesContext
  └── refreshAll() tras cada escritura exitosa
        └── GET /api/pedidos actualiza pedidos[] en memoria

Controles de seguridad:
  ✅ Solo memoria React — no cache.js (L3)
  ✅ Sin localStorage para pedidos
  ✅ Sin offline-first — escritura directa
  ✅ refreshAll() mantiene consistencia tras cada operación
```

### 5.4 Contrato API

```js
// src/lib/pedidos.js — SIN cache L3, llama a fetch() directamente

GET    /api/pedidos?page=1&limit=50&status=pending&search=
  → 200 { data: Pedido[], total: number, page: number, limit: number }

GET    /api/pedidos/:id
  → 200 Pedido
  → 404 { error: 'Pedido no encontrado' }

POST   /api/pedidos
  Body: { customerName, customerPhone, customerEmail, productId, quantity, notes, status }
  → 201 Pedido
  → 400 { error: string, fields?: Record<string, string> }

PUT    /api/pedidos/:id
  Body: { customerName?, customerPhone?, customerEmail?, productId?, quantity?, notes?, status? }
  → 200 Pedido
  → 404 { error: 'Pedido no encontrado' }
  → 400 { error: string, fields?: Record<string, string> }

DELETE /api/pedidos/:id
  → 200 { success: true }
  → 404 { error: 'Pedido no encontrado' }

PATCH  /api/pedidos/:id/status
  Body: { status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled' }
  → 200 Pedido
  → 400 { error: 'Estado inválido' }
  → 404 { error: 'Pedido no encontrado' }
```

### 5.5 DataContext — Integración

En `DataContext.jsx` se añade:

```jsx
const [pedidos, setPedidos] = useState(null);

// loadIfNeeded incluye pedidos (solo si es necesario)
const loadIfNeeded = useCallback(async () => {
  if (productos !== null && trabajos !== null && categorias !== null && pedidos !== null) return;
  // fetch de pedidos si es necesario (NUNCA usa cache.js)
}, [productos, trabajos, categorias, pedidos]);

// savePedido() — función expuesta para escritura directa
const savePedido = useCallback(async (pedidoData, id) => {
  // POST o PUT directo a API
  // refreshAll() tras éxito
}, []);
```

### 5.6 Integración con PendingChangesContext

**No hay integración.** Los pedidos no acumulan cambios pendientes. Cada operación (crear, editar, eliminar) ejecuta su llamada HTTP directa inmediatamente.

### 5.7 Contraste con Categorías

| Aspecto | Categorías (Fase 4) | Pedidos (Fase 5) |
|---|---|---|
| Clasificación | No sensible | **Sensible (PII)** |
| Cache L3 (cache.js) | ✅ Sí | ❌ No |
| Offline-first | ✅ Sí | ❌ No |
| localStorage | ✅ Fallback datos | ❌ Nunca |
| Escritura | Batch (offline-first) → API | Directa (inmediata) a API |
| Refresco | refreshAll() tras batch | refreshAll() tras cada op |

---

## Fase 6: Exportar + Utilidades Finales

### 6.1 Exportar CSV

```js
// src/utils/exportCSV.js
export function exportToCSV(data, columns, filename) {
  // Convierte array de objetos a CSV
  // Crea Blob + download link
}
```

Botón en pantallas de Productos y Trabajos.

### 6.2 Ordenamiento en DataTable

- Click en header de columna → toggle ASC/DESC
- Indicador visual: `ArrowUpDown`, `ArrowUp`, `ArrowDown`

### 6.3 Validación inline en formularios

- Estados de error en `<Input>` y `<Select>`
- Validación en submit y/o blur
- Mensajes debajo del campo (text-red-500 text-xs)

### 6.4 Atajos de teclado

| Tecla | Acción |
|---|---|
| `Ctrl+K` | Buscador global |
| `Escape` | Cerrar modal/panel/buscador |
| `Ctrl+N` | Nuevo item |
| `Ctrl+S` | Guardar formulario |
| `Ctrl+Shift+D` | Toggle dark mode |

---

## Roadmap de Backend (api-recuerdos)

> Endpoints necesarios para que el frontend funcione completamente.
> El orden de implementación sigue las fases del frontend.

### Estado Actual

| Endpoint | Estado | Uso en Frontend |
|---|---|---|
| `POST /api/login` | ✅ Existente | Auth |
| `GET /api/productos` | ✅ Existente | DataContext |
| `POST /api/productos` | ✅ Existente | Offline batch |
| `PUT /api/productos/:id` | ✅ Existente | Offline batch |
| `DELETE /api/productos/:id` | ✅ Existente | Offline batch |
| `GET /api/trabajos` | ✅ Existente | DataContext |
| `POST /api/trabajos` | ✅ Existente | Offline batch |
| `PUT /api/trabajos/:id` | ✅ Existente | Offline batch |
| `DELETE /api/trabajos/:id` | ✅ Existente | Offline batch |
| `GET /api/categorias` | ❌ No existe | Fase 4 |
| `POST /api/categorias` | ❌ No existe | Fase 4 |
| `PUT /api/categorias/:id` | ❌ No existe | Fase 4 |
| `DELETE /api/categorias/:id` | ❌ No existe | Fase 4 |
| `GET /api/pedidos` | ❌ No existe | Fase 5 |
| `POST /api/pedidos` | ❌ No existe | Fase 5 |
| `PUT /api/pedidos/:id` | ❌ No existe | Fase 5 |
| `DELETE /api/pedidos/:id` | ❌ No existe | Fase 5 |
| `PATCH /api/pedidos/:id/status` | ❌ No existe | Fase 5 |

### APIs por Implementar

#### `/api/categorias`

```
GET    /api/categorias          → { data: Categoria[] }
GET    /api/categorias/:id       → Categoria
POST   /api/categorias           → Crear categoría
PUT    /api/categorias/:id       → Actualizar categoría
DELETE /api/categorias/:id       → Eliminar (falla si tiene productos/trabajos asociados)
```

Modelo:
```json
{
  "id": "cat_001",
  "type": "producto",
  "name": "Tazas",
  "description": "Tazas personalizadas",
  "createdAt": "2026-07-29T10:00:00Z",
  "updatedAt": "2026-07-29T10:00:00Z"
}
```

Consideraciones de negocio:
- `type` separa categorías de productos (`"producto"`) vs trabajos (`"trabajo"`)
- `DELETE` debe validar que ningún producto/trabajo use esa categoría (responder `409`)
- GET público necesario para el frontend público de recuerdoscompartidos.com
- Endpoints protegidos con autenticación para escritura

#### `/api/pedidos`

```
GET    /api/pedidos?page=1&limit=50&status=pending&search=
  → { data: Pedido[], total, page, limit }

GET    /api/pedidos/:id           → Pedido
POST   /api/pedidos               → Crear pedido
PUT    /api/pedidos/:id           → Actualizar pedido
DELETE /api/pedidos/:id           → Eliminar pedido
PATCH  /api/pedidos/:id/status    → Cambiar estado
```

Modelo:
```json
{
  "id": "ped_001",
  "customerName": "Juan Pérez",
  "customerPhone": "0412-1234567",
  "customerEmail": "juan@email.com",
  "productId": "prod_001",
  "productName": "Taza personalizada",
  "quantity": 3,
  "notes": "Logo corporativo en azul",
  "status": "pending",
  "total": 450,
  "createdAt": "2026-07-29T10:00:00Z",
  "updatedAt": "2026-07-29T10:00:00Z"
}
```

Consideraciones de seguridad:
- Todos los endpoints protegidos con autenticación
- Datos PII manejados con cuidado: no loguear campos sensibles, cifrado en tránsito
- GET público NO debe exponer pedidos
- `total` se computa en backend (quantity × product.price), el frontend solo envía quantity

### Prioridad de Implementación

| Orden | API | Frontend Fase | Impacto |
|---|---|---|---|
| 1 | `/api/categorias` | 4 | Sin esto, Fase 4 usa fallback localStorage (funcional pero sin persistencia real) |
| 2 | `/api/pedidos` | 5 | Sin esto, Fase 5 está **bloqueada** (no se puede guardar PII en mock/localStorage) |

---

## Checklist de Implementación

### Fase 1 — Infraestructura Base ✅ COMPLETA
- [x] Instalar `lucide-react`
- [x] **Crear `DataContext.jsx` — caché compartida productos/trabajos**
- [x] **Integrar `DataProvider` en `AppRouter.jsx`**
- [x] **Refactor `ProductosContainer.jsx` → usar `useData()`**
- [x] **Refactor `TrabajosContainer.jsx` → usar `useData()`**
- [x] **Refactor `DashboardContainer.jsx` → usar `useData()`**
- [x] **Crear `activityLog.js` — persistencia localStorage**
- [x] **Integrar `logActivity()` en ProductosContainer y TrabajosContainer**
- [x] Crear `ThemeContext.jsx`
- [x] Actualizar `index.astro` (script anti-FOUC + `global.css`)
- [x] Crear `Button.jsx` con variantes
- [x] Crear `Input.jsx` con label/error/icon
- [x] Crear `Badge.jsx`
- [x] Crear `Card.jsx`
- [x] Crear `Modal.jsx` (auto-focus primer input ✅)
- [x] Crear `Toast` + `ToastProvider` (integrado en flujos ✅)
- [x] Refactor `Layout.jsx` → componentes + lucide
- [x] Refactor `DataTable.jsx` → botones + empty state lucide
- [x] Refactor `ConfirmDialog.jsx` → Modal + Button
- [x] Refactor `AuthView.jsx` → Input + Button + lucide
- [x] Refactor `ProductForm.jsx` → Input + Button
- [x] Refactor `TrabajoForm.jsx` → Input + Button
- [x] Corregir Tailwind scoped por Astro → `global.css`
- [x] Corregir dark mode (media query → `.dark` class)
- [x] Corregir `refreshAll()` tras batch save (datos desactualizados)
- [x] Corregir spinner pegado en BatchSaveModal
- [x] Fix panel pendientes móvil (z-index + scroll lock)

### Fase 2 — Navegación + Buscador + Dark Mode ✅ COMPLETA
- [x] Toggle dark mode funcional en sidebar y topbar mobile
- [x] Refactor `PendingChangesPanel` con lucide + dark mode
- [x] Refactor `PendingResourceSection` con lucide + dark mode
- [x] Refactor `PendingItem` con lucide + dark mode
- [x] Refactor `BatchSaveModal` con lucide + componentes + refreshAll
- [x] Fix móvil: panel por encima de top bar, modales `z-[70]`
- [x] Sidebar `md:w-64` + `main md:ml-64`
- [x] Active state con barra `border-l-2 border-blue-400`
- [x] Botón `Search` en topbar mobile y sidebar
- [x] **Implementar `GlobalSearch.jsx` (usa `useData()` + pendientes)**
- [x] Integrar `Ctrl+K` para abrir buscador
- [x] Navegación por teclado en buscador (↑↓ + Enter + Esc)
- [x] Búsqueda local en `ProductosView` y `TrabajosView` sincronizada con `?buscar=`
- [x] Links Categorías/Pedidos diferidos (se agregan cuando existan rutas, Fase 4/5)
- [x] Transición suave `transition-colors duration-200` en Layout

### Fase 3 — Dashboard ✅ COMPLETA
- [x] Crear `StatCard.jsx` con ícono, color dinámico, dark mode (compacta + clicable)
- [x] Crear `CategoryBarChart.jsx` (barras CSS) con **% real sobre el total**
- [x] Crear `MiniStatsGrid.jsx` (precios, audiencia — Destacados movido a card grande)
- [x] Crear `ActivityFeed.jsx` (localStorage + pending changes)
- [x] Crear `QuickActions.jsx` (reubicado debajo de StatCards, `?nuevo=1`)
- [x] Crear `DashboardSkeleton.jsx`
- [x] Rediseñar `DashboardView.jsx` (5 filas: stats, gráficos, mini, insights, feed)
- [x] **Verificar: cero llamadas API — todo desde DataContext**
- [x] **Extra:** `stats.js` funciones puras + `format.js`
- [x] **Extra:** `FeaturedProducts.jsx` mini carousel de destacados
- [x] **Extra:** `PriceHistogram.jsx`, `TopExpensive.jsx`, `RecentAdded.jsx`
- [x] **Extra:** Card de "Total Cantidad" eliminada (sin datos reales)
- [x] **Extra:** `?nuevo=1` abre formulario directo desde el dashboard
- [x] **Extra:** `Button.jsx` spread `...rest` + `Card.jsx` prop `iconClassName`

### Fase 4 — Categorías
- [ ] Crear `src/lib/categorias.js`
- [ ] Crear `CategoriasContainer.jsx`
- [ ] Crear `CategoriasView.jsx`
- [ ] Formulario de categorías
- [ ] Ruta `/categorias` en `AppRouter`
- [ ] Extender `DataContext` con `categorias[]`
- [ ] Actualizar `ProductForm` y `TrabajoForm` → categorías dinámicas
- [ ] Fallback localStorage

### Fase 5 — Pedidos
- [ ] Crear `src/lib/pedidos.js` (SIN cache.js)
- [ ] Crear `PedidosContainer.jsx`
- [ ] Crear `PedidosView.jsx`
- [ ] Crear `PedidoForm.jsx`
- [ ] Ruta `/pedidos` en `AppRouter`
- [ ] Extender `DataContext` con `pedidos[]` (solo L2, sin L3)
- [ ] Implementar escritura directa a API (sin PendingChangesContext)

### Fase 6 — Utilidades
- [ ] Crear `src/utils/exportCSV.js`
- [ ] Botón exportar en ProductosView
- [ ] Botón exportar en TrabajosView
- [ ] Ordenamiento en DataTable
- [ ] Validación inline en formularios
- [ ] Atajos de teclado

---

## Riesgos y Dependencias

### Dependencias Externas

| Feature | Dependencia | Nota |
|---|---|---|
| DataContext (Fase 1) | Ninguna | Datos desde `lib/productos.js` y `lib/trabajos.js` (ya existen) |
| Categorías (Fase 4) | API `/api/categorias` | Sin API: localStorage fallback |
| Pedidos (Fase 5) | API `/api/pedidos` | Sin API: **bloqueado** (no usar mock con PII) |
| Dashboard (Fase 3) | Ninguna | Datos vía DataContext |
| Buscador (Fase 2) | Ninguna | Datos vía DataContext |
| Exportar (Fase 6) | Ninguna | Puramente client-side |
| Dark Mode (Fase 2) | Ninguna | Solo CSS + React context |

### Riesgos Técnicos

| Riesgo | Mitigación |
|---|---|
| **FOUC en dark mode** | Script inline en `<head>` antes del render ✅ implementado |
| **DataContext — estado desactualizado** | `refreshAll()` disponible. **Se llama tras batch save exitoso** ✅ corregido |
| **ActivityLog — localStorage lleno** | Try/catch + límite 100 entradas |
| **ProductosContainer antes usaba su propio fetch** | Refactorizado a `useData()` ✅ |
| **useMemo — dependencias incorrectas** | Siempre depender de los datos fuente, no de computaciones |
| **Romper flujo offline-first** | No modificar PendingChangesContext, solo UI |
| **Duplicación `navigate` en BatchSaveModal** | ✅ Corregido |
| **Tailwind scoped por Astro** | CSS centralizado en `global.css` ✅ |
| **Dark mode solo respondía al OS** | `@custom-variant dark` con clase `.dark` ✅ |
| **Panel pendientes atascado en móvil** | z-index por capas: topbar 50, panel 60, modales 70 ✅ |
| **GlobalSearch — rutas de detalle inexistentes** | **Resuelto:** se navega a `/productos?buscar=X` / `/trabajos?buscar=X` (Opción 2) y la tabla filtra con el query param |
| **Ctrl+K conflicto con navegador** | `preventDefault()` al abrir el buscador (funciona incluso con input enfocado) ✅ implementado |

### Principios a mantener

1. **DataContext first** — Ningún componente hace fetch directo a la API
2. **Offline-first intacto** — Los cambios se acumulan en localStorage, batch save igual
3. **Container/View separation** — Lógica de negocio separada de UI
4. **Responsive first** — Mobile y desktop deben funcionar
5. **Progresivo** — Cada fase es independiente y desplegable por sí sola
6. **Sin regresiones** — Verificar `npm run build` después de cada fase

---

> **Próximo paso:** **Fase 3 completa ✅** (Dashboard con reportes y estadísticas: stats puras, gráficos CSS con % real, carousel de destacados, skeleton, feed de actividad, StatCards compactas clicables). Continuar con **Fase 4 (Gestión de Categorías)**: requiere API `/api/categorias` (fallback localStorage disponible) — ver sección de Roadmap de Backend. Ejecutar `npm run build` después de cada cambio para verificar que no hay errores de compilación.
>
> **Documentación de referencia:**
> - [Lucide React Icons](https://lucide.dev/icons/)
> - [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
> - [React Router v7](https://reactrouter.com/)
