import { useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { getActivityLog } from '../../utils/activityLog';
import { getCategorySlugs, getCategoryLabels } from '../../utils/categories';
import { TRABAJO_CATEGORIES } from '../../utils/constants';
import DashboardView from './DashboardView';
import {
  getCategoryCount,
  getCategoryDist,
  getPriceStats,
  getAudienceStats,
  getPriceHistogram,
  getTopExpensive,
  getRecentAdded,
  getFeaturedProducts,
  buildActivityFeed,
} from './stats';

export default function DashboardContainer() {
  const { productos, trabajos, categorias, loading, loadIfNeeded } = useData();
  const { state, getEffectiveList, getResourceCounts, pendingCount } = usePendingChanges();

  useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);

  const effectiveProductos = useMemo(
    () => getEffectiveList('productos', productos).filter((item) => !item.__pendingDelete),
    [getEffectiveList, productos]
  );
  const effectiveTrabajos = useMemo(
    () => getEffectiveList('trabajos', trabajos).filter((item) => !item.__pendingDelete),
    [getEffectiveList, trabajos]
  );

  const categorySlugs = useMemo(() => getCategorySlugs(categorias), [categorias]);
  const categoryLabels = useMemo(() => getCategoryLabels(categorias), [categorias]);

  const categoryDist = useMemo(
    () =>
      getCategoryDist(effectiveProductos, categorySlugs).map((d) => ({
        ...d,
        name: categoryLabels[d.name] || d.name,
      })),
    [effectiveProductos, categorySlugs, categoryLabels]
  );

  const stats = useMemo(
    () => ({
      productosCount: effectiveProductos.length,
      trabajosCount: effectiveTrabajos.length,
      categoryCount: getCategoryCount(effectiveProductos),
      categoryDist,
      trabajosByCat: getCategoryDist(effectiveTrabajos, TRABAJO_CATEGORIES),
      priceStats: getPriceStats(effectiveProductos),
      audienceStats: getAudienceStats(effectiveProductos),
      priceHistogram: getPriceHistogram(effectiveProductos),
      topExpensive: getTopExpensive(effectiveProductos, 5),
      recentProductos: getRecentAdded(effectiveProductos, 5),
      recentTrabajos: getRecentAdded(effectiveTrabajos, 5),
      featuredProducts: getFeaturedProducts(effectiveProductos),
    }),
    [effectiveProductos, effectiveTrabajos, categoryDist]
  );

  const activityLog = useMemo(() => buildActivityFeed(state, getActivityLog()), [state]);

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');

  return (
    <DashboardView
      loading={loading}
      productosPending={pCounts.total}
      trabajosPending={tCounts.total}
      featuredTotal={stats.productosCount}
      activityLog={activityLog}
      pendingCount={pendingCount}
      {...stats}
    />
  );
}
