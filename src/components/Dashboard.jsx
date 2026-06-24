import { useState, useEffect } from 'react';
import Layout from './Layout';
import { api } from '../lib/api';

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProductos(), api.getTrabajos()])
      .then(([p, t]) => { setProductos(p); setTrabajos(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><p className="text-slate-500">Cargando...</p></Layout>;
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-sm text-slate-500 mb-2">Total Productos</h3>
          <p className="text-4xl font-bold">{productos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-sm text-slate-500 mb-2">Total Trabajos</h3>
          <p className="text-4xl font-bold">{trabajos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-sm text-slate-500 mb-2">Categorías (Productos)</h3>
          <p className="text-4xl font-bold">{new Set(productos.map(p => p.category)).size}</p>
        </div>
      </div>
    </Layout>
  );
}
