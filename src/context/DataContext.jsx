import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getProductos } from '../lib/productos';
import { getTrabajos } from '../lib/trabajos';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [productos, setProductos] = useState(null);
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
