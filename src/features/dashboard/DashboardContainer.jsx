import { useState, useEffect } from 'react';
import { getProductos } from '../../lib/productos';
import { getTrabajos } from '../../lib/trabajos';
import { usePendingChanges } from '../../context/PendingChangesContext';
import DashboardView from './DashboardView';

export default function DashboardContainer() {
  const [productos, setProductos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getResourceCounts } = usePendingChanges();

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');

  useEffect(() => {
    Promise.all([getProductos(), getTrabajos()])
      .then(([p, t]) => { setProductos(p); setTrabajos(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categoryCount = new Set(productos.map(p => p.category)).size;

  return (
    <DashboardView
      loading={loading}
      productosCount={productos.length}
      trabajosCount={trabajos.length}
      categoryCount={categoryCount}
      productosPending={pCounts.total}
      trabajosPending={tCounts.total}
    />
  );
}
