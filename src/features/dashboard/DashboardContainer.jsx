import { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import DashboardView from './DashboardView';

export default function DashboardContainer() {
  const { productos, trabajos, loading, loadIfNeeded } = useData();
  const { getResourceCounts } = usePendingChanges();

  useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);

  const data = productos || [];
  const tdata = trabajos || [];

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');

  const categoryCount = new Set(data.map(p => p.category)).size;

  return (
    <DashboardView
      loading={loading}
      productosCount={data.length}
      trabajosCount={tdata.length}
      categoryCount={categoryCount}
      productosPending={pCounts.total}
      trabajosPending={tCounts.total}
    />
  );
}
