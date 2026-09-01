import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import BentoGrid from '../../components/ui/BentoGrid';
import BentoCell from '../../components/ui/BentoCell';
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
      <BentoGrid variant="dashboard">
        {/* Cell A: StatCard Productos */}
        <BentoCell interactive compact>
          <StatCard to="/productos" iconName="Package" title="Productos" value={productosCount} pending={productosPending} color="blue" />
        </BentoCell>

        {/* Cell B: StatCard Trabajos */}
        <BentoCell interactive compact>
          <StatCard to="/trabajos" iconName="Briefcase" title="Trabajos" value={trabajosCount} pending={trabajosPending} color="amber" />
        </BentoCell>

        {/* Cell C: FeaturedProducts HERO (2col × 2row on desktop) */}
        <BentoCell span={{ col: 2, row: 2 }}>
          <FeaturedProducts items={featuredProducts} total={featuredTotal} />
        </BentoCell>

        {/* Cell D: StatCard Categorias */}
        <BentoCell interactive compact>
          <StatCard to="/productos" iconName="Tags" title="Categorías" value={categoryCount} color="emerald" />
        </BentoCell>

        {/* Cell E: QuickActions */}
        <BentoCell className="flex items-center justify-center">
          <QuickActions
            onNewProducto={() => navigate('/productos?nuevo=1')}
            onNewTrabajo={() => navigate('/trabajos?nuevo=1')}
          />
        </BentoCell>

        {/* Cell F: CategoryBarCharts (2col wide) */}
        <BentoCell span={{ col: 2 }}>
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
        </BentoCell>

        {/* Cell G: MiniStatsGrid (2col wide) */}
        <BentoCell span={{ col: 2 }}>
          <MiniStatsGrid priceStats={priceStats} audienceStats={audienceStats} />
        </BentoCell>

        {/* Cell H: PriceHistogram */}
        <BentoCell>
          <PriceHistogram data={priceHistogram} />
        </BentoCell>

        {/* Cell I: TopExpensive */}
        <BentoCell>
          <TopExpensive items={topExpensive} />
        </BentoCell>

        {/* Cell J: RecentAdded */}
        <BentoCell>
          <RecentAdded productos={recentProductos} trabajos={recentTrabajos} />
        </BentoCell>

        {/* Cell K: ActivityFeed (full width) */}
        <BentoCell span={{ col: 4 }}>
          <ActivityFeed entries={activityLog} />
        </BentoCell>
      </BentoGrid>
    </Layout>
  );
}
