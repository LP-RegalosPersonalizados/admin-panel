import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatCard from './StatCard';
import CategoryBarChart from './CategoryBarChart';
import MiniStatsGrid from './MiniStatsGrid';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import PriceHistogram from './PriceHistogram';
import TopExpensive from './TopExpensive';
import RecentAdded from './RecentAdded';
import FeaturedProducts from './FeaturedProducts';
import DashboardSkeleton from './DashboardSkeleton';

export default function DashboardView({
  loading,
  productosCount,
  trabajosCount,
  categoryCount,
  productosPending,
  trabajosPending,
  categoryDist,
  trabajosByCat,
  priceStats,
  audienceStats,
  priceHistogram,
  topExpensive,
  recentProductos,
  recentTrabajos,
  featuredProducts,
  featuredTotal,
  activityLog,
}) {
  const navigate = useNavigate();
  if (loading) return <DashboardSkeleton />;

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.18)]">
            <LayoutDashboard size={22} className="text-[#0071e3] dark:text-[#2997ff]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Dashboard</h1>
            <p className="text-xs text-[#6e6e73] dark:text-[#86868b]">Resumen general del catálogo</p>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="bento-dashboard">
        {/* Cell A: StatCard Productos */}
        <div className="bento-cell bento-cell-interactive !p-4">
          <StatCard to="/productos" iconName="Package" title="Productos" value={productosCount} pending={productosPending} color="blue" />
        </div>

        {/* Cell B: StatCard Trabajos */}
        <div className="bento-cell bento-cell-interactive !p-4">
          <StatCard to="/trabajos" iconName="Briefcase" title="Trabajos" value={trabajosCount} pending={trabajosPending} color="amber" />
        </div>

        {/* Cell C: FeaturedProducts HERO (2col × 2row on desktop) */}
        <div className="bento-cell lg:col-span-2 lg:row-span-2">
          <FeaturedProducts items={featuredProducts} total={featuredTotal} />
        </div>

        {/* Cell D: StatCard Categorias */}
        <div className="bento-cell bento-cell-interactive !p-4">
          <StatCard to="/productos" iconName="Tags" title="Categorías" value={categoryCount} color="emerald" />
        </div>

        {/* Cell E: QuickActions */}
        <div className="bento-cell flex items-center justify-center">
          <QuickActions
            onNewProducto={() => navigate('/productos?nuevo=1')}
            onNewTrabajo={() => navigate('/trabajos?nuevo=1')}
          />
        </div>

        {/* Cell F: CategoryBarCharts (2col wide) */}
        <div className="bento-cell lg:col-span-2">
          <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Distribución por Categoría</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-[#6e6e73] dark:text-[#86868b] mb-3 flex items-center gap-1.5">
                <Package size={12} className="text-[#0071e3] dark:text-[#2997ff]" />
                Productos
              </p>
              <CategoryBarChart data={categoryDist} color="blue" emptyLabel="Sin productos por categoría" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#6e6e73] dark:text-[#86868b] mb-3 flex items-center gap-1.5">
                <Briefcase size={12} className="text-amber-500 dark:text-amber-400" />
                Trabajos
              </p>
              <CategoryBarChart data={trabajosByCat} color="amber" emptyLabel="Sin trabajos por categoría" />
            </div>
          </div>
        </div>

        {/* Cell G: MiniStatsGrid (2col wide) */}
        <div className="bento-cell lg:col-span-2">
          <MiniStatsGrid priceStats={priceStats} audienceStats={audienceStats} />
        </div>

        {/* Cell H: PriceHistogram */}
        <div className="bento-cell">
          <PriceHistogram data={priceHistogram} />
        </div>

        {/* Cell I: TopExpensive */}
        <div className="bento-cell">
          <TopExpensive items={topExpensive} />
        </div>

        {/* Cell J: RecentAdded */}
        <div className="bento-cell">
          <RecentAdded productos={recentProductos} trabajos={recentTrabajos} />
        </div>

        {/* Cell K: ActivityFeed (full width) */}
        <div className="bento-cell lg:col-span-4">
          <ActivityFeed entries={activityLog} />
        </div>
      </div>
    </Layout>
  );
}
