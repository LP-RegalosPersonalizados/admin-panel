import Layout from '../../components/layout/Layout';
import StatCard from './StatCard';

export default function DashboardView({ loading, productosCount, trabajosCount, categoryCount, productosPending, trabajosPending }) {
  if (loading) return <Layout><p className="text-slate-500">Cargando...</p></Layout>;
  return (
    <Layout>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <StatCard title="Productos" value={productosCount} pending={productosPending} />
        <StatCard title="Trabajos" value={trabajosCount} pending={trabajosPending} />
        <div className="bg-white p-6 rounded-lg sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm text-slate-500 mb-2">Categorías (Productos)</h3>
          <p className="text-4xl font-bold">{categoryCount}</p>
        </div>
      </div>
    </Layout>
  );
}
