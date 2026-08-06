import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getProductos } from '../lib/productos';
import { getTrabajos } from '../lib/trabajos';
import { getCategorias } from '../lib/categorias';
import { FALLBACK_CATEGORIES } from '../utils/categories';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [productos, setProductos] = useState(null);
  const [trabajos, setTrabajos] = useState(null);
  const [categorias, setCategorias] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadIfNeeded = useCallback(async () => {
    if (productos !== null && trabajos !== null && categorias !== null) return;
    setLoading(true);
    try {
      const [p, t, c] = await Promise.all([
        productos !== null ? Promise.resolve(productos) : getProductos(),
        trabajos !== null ? Promise.resolve(trabajos) : getTrabajos(),
        categorias !== null ? Promise.resolve(categorias) : getCategorias(),
      ]);
      if (productos === null) setProductos(p);
      if (trabajos === null) setTrabajos(t);
      if (categorias === null) setCategorias(c);
    } catch (err) {
      console.error('Error loading data:', err);
      if (categorias === null) setCategorias(FALLBACK_CATEGORIES);
    }
    setLoading(false);
  }, [productos, trabajos, categorias]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t, c] = await Promise.all([getProductos(), getTrabajos(), getCategorias()]);
      setProductos(p);
      setTrabajos(t);
      setCategorias(c);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    productos: productos ?? [],
    trabajos: trabajos ?? [],
    categorias: categorias ?? [],
    loading: loading || (productos === null && trabajos === null),
    loadIfNeeded,
    refreshAll,
  }), [productos, trabajos, categorias, loading, loadIfNeeded, refreshAll]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
}
