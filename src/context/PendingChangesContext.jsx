import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const PendingChangesContext = createContext(null);

const STORAGE_KEY = 'pendingChanges';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        productos: parsed.productos || { creates: [], updates: {} },
        trabajos: parsed.trabajos || { creates: [], updates: {} },
        pendingDeletes: parsed.pendingDeletes || { productos: [], trabajos: [] },
      };
    }
  } catch {}
  return {
    productos: { creates: [], updates: {} },
    trabajos: { creates: [], updates: {} },
    pendingDeletes: { productos: [], trabajos: [] },
  };
}

const initialState = loadState();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CREATE': {
      const { resource, data } = action;
      const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      return {
        ...state,
        [resource]: {
          ...state[resource],
          creates: [...state[resource].creates, { tempId, data }],
        },
      };
    }

    case 'ADD_UPDATE': {
      const { resource, id, original, modified } = action;
      const existingCreateIdx = state[resource].creates.findIndex((c) => c.tempId === id);

      if (existingCreateIdx >= 0) {
        const newCreates = [...state[resource].creates];
        newCreates[existingCreateIdx] = { ...newCreates[existingCreateIdx], data: modified };
        return {
          ...state,
          [resource]: { ...state[resource], creates: newCreates },
        };
      }

      return {
        ...state,
        [resource]: {
          ...state[resource],
          updates: {
            ...state[resource].updates,
            [id]: { original, modified },
          },
        },
      };
    }

    case 'DISCARD_CREATE': {
      const { resource, tempId } = action;
      return {
        ...state,
        [resource]: {
          ...state[resource],
          creates: state[resource].creates.filter((c) => c.tempId !== tempId),
        },
      };
    }

    case 'DISCARD_UPDATE': {
      const { resource, id } = action;
      const newUpdates = { ...state[resource].updates };
      delete newUpdates[id];
      return {
        ...state,
        [resource]: { ...state[resource], updates: newUpdates },
      };
    }

    case 'MARK_DELETE': {
      const { resource, ids } = action;
      const idSet = new Set(ids);

      const remainingUpdates = { ...state[resource].updates };
      for (const id of ids) {
        delete remainingUpdates[id];
      }

      const remainingCreates = state[resource].creates.filter((c) => !idSet.has(c.tempId));

      const existingDeletes = new Set(state.pendingDeletes[resource]);
      for (const id of ids) {
        existingDeletes.add(id);
      }

      return {
        ...state,
        [resource]: {
          creates: remainingCreates,
          updates: remainingUpdates,
        },
        pendingDeletes: {
          ...state.pendingDeletes,
          [resource]: [...existingDeletes],
        },
      };
    }

    case 'UNMARK_DELETE': {
      const { resource, id } = action;
      return {
        ...state,
        pendingDeletes: {
          ...state.pendingDeletes,
          [resource]: state.pendingDeletes[resource].filter((d) => d !== id),
        },
      };
    }

    case 'DISCARD_ALL': {
      if (action.resource) {
        return {
          ...state,
          [action.resource]: { creates: [], updates: {} },
          pendingDeletes: {
            ...state.pendingDeletes,
            [action.resource]: [],
          },
        };
      }
      return {
        productos: { creates: [], updates: {} },
        trabajos: { creates: [], updates: {} },
        pendingDeletes: { productos: [], trabajos: [] },
      };
    }

    case 'CLEAR_ALL':
      return {
        productos: { creates: [], updates: {} },
        trabajos: { creates: [], updates: {} },
        pendingDeletes: { productos: [], trabajos: [] },
      };

    default:
      return state;
  }
}

export function PendingChangesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const pendingCount = useMemo(() => {
    const p = state.productos;
    const t = state.trabajos;
    return (
      p.creates.length +
      Object.keys(p.updates).length +
      t.creates.length +
      Object.keys(t.updates).length +
      state.pendingDeletes.productos.length +
      state.pendingDeletes.trabajos.length
    );
  }, [state]);

  const getEffectiveList = useCallback(
    (resource, apiData) => {
      const creates = state[resource].creates;
      const updates = state[resource].updates;
      const deleteIds = new Set(state.pendingDeletes[resource]);

      const base = apiData.map((item) => {
        if (updates[item.id]) {
          return {
            ...updates[item.id].modified,
            id: item.id,
            __pending: true,
            __original: updates[item.id].original,
          };
        }
        if (deleteIds.has(item.id)) {
          return { ...item, __pendingDelete: true };
        }
        return item;
      });

      const newItems = creates.map((c) => ({
        ...c.data,
        id: c.tempId,
        __pendingNew: true,
      }));

      return [...newItems, ...base];
    },
    [state]
  );

  const getResourceCounts = useCallback(
    (resource) => {
      const r = state[resource];
      return {
        creates: r.creates.length,
        updates: Object.keys(r.updates).length,
        deletes: state.pendingDeletes[resource].length,
        total:
          r.creates.length + Object.keys(r.updates).length + state.pendingDeletes[resource].length,
      };
    },
    [state]
  );

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      pendingCount,
      getEffectiveList,
      getResourceCounts,
    }),
    [state, pendingCount, getEffectiveList, getResourceCounts]
  );

  return (
    <PendingChangesContext.Provider value={contextValue}>
      {children}
    </PendingChangesContext.Provider>
  );
}

export function usePendingChanges() {
  const ctx = useContext(PendingChangesContext);
  if (!ctx) throw new Error('usePendingChanges debe usarse dentro de PendingChangesProvider');
  return ctx;
}
