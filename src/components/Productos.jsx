import { useState, useEffect } from 'react';
import Layout from './Layout';
import DataTable from './DataTable';
import ProductForm from './ProductForm';
import { api } from '../lib/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    api.getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await api.updateProducto(editing.id, data);
      } else {
        await api.createProducto(data);
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await api.deleteProducto(id);
      load();
    } catch (err) { alert(err.message); }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    {
      key: 'price',
      label: 'Precio',
      render: (v) => (v != null ? `Bs ${v}` : '-'),
    },
    {
      key: 'featured',
      label: 'Destacado',
      render: (v) => (v ? '✅' : '❌'),
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer"
        >
          + Nuevo
        </button>
      </div>

      <DataTable
        columns={columns}
        data={productos}
        onEdit={(row) => { setEditing(row); setShowForm(true); }}
        onDelete={handleDelete}
        loading={loading}
      />

      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </Layout>
  );
}
