import { useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { getActivityLog } from '../../utils/activityLog';
import { PRODUCT_CATEGORIES, TRABAJO_CATEGORIES } from '../../utils/constants';
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
  const { productos, trabajos, loading, loadIfNeeded } = useData();
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

  const stats = useMemo(
    () => ({
      productosCount: effectiveProductos.length,
      trabajosCount: effectiveTrabajos.length,
      categoryCount: getCategoryCount(effectiveProductos),
      categoryDist: getCategoryDist(effectiveProductos, PRODUCT_CATEGORIES),
      trabajosByCat: getCategoryDist(effectiveTrabajos, TRABAJO_CATEGORIES),
      priceStats: getPriceStats(effectiveProductos),
      audienceStats: getAudienceStats(effectiveProductos),
      priceHistogram: getPriceHistogram(effectiveProductos),
      topExpensive: getTopExpensive(effectiveProductos, 5),
      recentProductos: getRecentAdded(effectiveProductos, 5),
      recentTrabajos: getRecentAdded(effectiveTrabajos, 5),
      featuredProducts: getFeaturedProducts(effectiveProductos),
    }),
    [effectiveProductos, effectiveTrabajos]
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
