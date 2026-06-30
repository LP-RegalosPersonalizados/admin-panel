import { useState, useEffect } from 'react';
import Layout from './Layout';
import { api } from '../lib/api';
import { usePendingChanges } from '../context/PendingChangesContext';

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getResourceCounts } = usePendingChanges();

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');

  useEffect(() => {
    Promise.all([api.getProductos(), api.getTrabajos()])
      .then(([p, t]) => { setProductos(p); setTrabajos(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><p className="text-slate-500">Cargando...</p></Layout>;
  return (
    <Layout>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <StatCard title="Productos" value={productos.length} pending={pCounts.total} />
        <StatCard title="Trabajos" value={trabajos.length} pending={tCounts.total} />
        <div className="bg-white p-6 rounded-lg sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm text-slate-500 mb-2">Categorías (Productos)</h3>
          <p className="text-4xl font-bold">{new Set(productos.map(p => p.category)).size}</p>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, pending }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-sm text-slate-500 mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <p className="text-4xl font-bold">{value}</p>
        {pending > 0 && (
          <span className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">
            {pending} pendiente(s)
          </span>
        )}
      </div>
    </div>
  );
}
