import { useState, useEffect } from 'react';
import Layout from './Layout';
import DataTable from './DataTable';
import TrabajoForm from './TrabajoForm';
import { api } from '../lib/api';

const DEPLOY_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_uc9Q2uvKMpqH2FjJpQytlKg67hPt/ALhaQ6ckGC';

async function triggerVercelBuild() {
  try {
    await fetch(DEPLOY_HOOK, { method: 'POST' });
  } catch (err) {
    console.warn('Error triggering Vercel deploy:', err);
  }
}

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    api.getTrabajos()
      .then(setTrabajos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await api.updateTrabajo(editing.id, data);
      } else {
        await api.createTrabajo(data);
      }
      setShowForm(false);
      setEditing(null);
      load();
      triggerVercelBuild();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar trabajo?')) return;
    try {
      await api.deleteTrabajo(id);
      load();
      triggerVercelBuild();
    } catch (err) { alert(err.message); }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Título' },
    { key: 'category', label: 'Categoría' },
    { key: 'quantity', label: 'Cantidad' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trabajos</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer"
        >
          + Nuevo
        </button>
      </div>

      <DataTable
        columns={columns}
        data={trabajos}
        onEdit={(row) => { setEditing(row); setShowForm(true); }}
        onDelete={handleDelete}
        loading={loading}
      />

      {showForm && (
        <TrabajoForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </Layout>
  );
}
