import { useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { getActivityLog } from '../../utils/activityLog';
import { PRODUCT_CATEGORIES, TRABAJO_CATEGORIES } from '../../utils/constants';
import DashboardView from './DashboardView';
import {
  getCategoryCount,
  getCategoryDist,
  getFeaturedStats,
  getPriceStats,
  getAudienceStats,
  getTotalQuantity,
  getPriceHistogram,
  getTopExpensive,
  getRecentAdded,
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
      featuredStats: getFeaturedStats(effectiveProductos),
      priceStats: getPriceStats(effectiveProductos),
      audienceStats: getAudienceStats(effectiveProductos),
      totalQuantity: getTotalQuantity(effectiveTrabajos),
      priceHistogram: getPriceHistogram(effectiveProductos),
      topExpensive: getTopExpensive(effectiveProductos, 5),
      recentProductos: getRecentAdded(effectiveProductos, 5),
      recentTrabajos: getRecentAdded(effectiveTrabajos, 5),
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
      activityLog={activityLog}
      pendingCount={pendingCount}
      {...stats}
    />
  );
}
