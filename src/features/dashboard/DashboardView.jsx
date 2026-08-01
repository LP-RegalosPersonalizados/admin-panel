import Layout from '../../components/layout/Layout';
import StatCard from './StatCard';

export default function DashboardView({ loading, productosCount, trabajosCount, categoryCount, productosPending, trabajosPending }) {
  if (loading) return <Layout><p className="text-slate-500 dark:text-slate-400">Cargando...</p></Layout>;
  return (
    <Layout>
      <h1 className="text-xl md:text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <StatCard iconName="Package" title="Productos" value={productosCount} pending={productosPending} color="blue" />
        <StatCard iconName="Briefcase" title="Trabajos" value={trabajosCount} pending={trabajosPending} color="amber" />
        <StatCard iconName="Tags" title="Categorías" value={categoryCount} color="emerald" />
      </div>
    </Layout>
  );
}
