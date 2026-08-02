import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
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
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <LayoutDashboard size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Resumen general del catálogo</p>
          </div>
        </div>
      </div>

      {/* Row 1: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <StatCard to="/productos" iconName="Package" title="Productos" value={productosCount} pending={productosPending} color="blue" />
        <StatCard to="/trabajos" iconName="Briefcase" title="Trabajos" value={trabajosCount} pending={trabajosPending} color="amber" />
        <StatCard to="/productos" iconName="Tags" title="Categorías" value={categoryCount} color="emerald" />
      </div>

      {/* Quick actions */}
      <div className="flex justify-end mb-6">
        <QuickActions
          onNewProducto={() => navigate('/productos?nuevo=1')}
          onNewTrabajo={() => navigate('/trabajos?nuevo=1')}
        />
      </div>

      {/* Row 2: Category bar charts + Featured carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card title="Productos por Categoría" icon={Package} iconClassName="text-blue-500 dark:text-blue-400" className="h-full">
          <CategoryBarChart data={categoryDist} color="blue" emptyLabel="Sin productos por categoría" />
        </Card>
        <Card title="Trabajos por Categoría" icon={Briefcase} iconClassName="text-amber-500 dark:text-amber-400" className="h-full">
          <CategoryBarChart data={trabajosByCat} color="amber" emptyLabel="Sin trabajos por categoría" />
        </Card>
        <FeaturedProducts items={featuredProducts} total={featuredTotal} />
      </div>

      {/* Row 3: Mini stats */}
      <MiniStatsGrid priceStats={priceStats} audienceStats={audienceStats} />

      {/* Row 4: Extra insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <PriceHistogram data={priceHistogram} />
        <TopExpensive items={topExpensive} />
        <RecentAdded productos={recentProductos} trabajos={recentTrabajos} />
      </div>

      {/* Row 5: Activity feed */}
      <ActivityFeed entries={activityLog} />
    </Layout>
  );
}
