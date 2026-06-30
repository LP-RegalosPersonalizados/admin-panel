import { useState, useEffect, useCallback } from 'react';
import Layout from './Layout';
import DataTable from './DataTable';
import ProductForm from './ProductForm';
import ConfirmDialog from './ConfirmDialog';
import { api } from '../lib/api';
import { usePendingChanges } from '../context/PendingChangesContext';

function stripMeta(obj) {
  if (!obj) return null;
  const { __pending, __original, __pendingNew, __pendingDelete, ...rest } = obj;
  return rest;
}

export default function Productos() {
  const { state, dispatch, getEffectiveList } = usePendingChanges();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const effectiveData = getEffectiveList('productos', productos);

  const handleSave = useCallback((data) => {
    if (editing) {
      if (editing.__pendingNew) {
        dispatch({ type: 'ADD_UPDATE', resource: 'productos', id: editing.id, original: null, modified: data });
      } else {
        dispatch({
          type: 'ADD_UPDATE',
          resource: 'productos',
          id: editing.id,
          original: editing.__original || editing,
          modified: data,
        });
      }
    } else {
      dispatch({ type: 'ADD_CREATE', resource: 'productos', data });
    }
    setShowForm(false);
    setEditing(null);
  }, [editing, dispatch]);

  const handleDeleteSelected = useCallback((ids) => {
    setConfirmDelete(ids);
  }, []);

  const confirmDeletes = useCallback(() => {
    if (confirmDelete && confirmDelete.length > 0) {
      dispatch({ type: 'MARK_DELETE', resource: 'productos', ids: confirmDelete });
    }
    setConfirmDelete(null);
    setSelectedIds(new Set());
    setDeleteMode(false);
  }, [confirmDelete, dispatch]);

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

  const pendingCount =
    state.productos.creates.length +
    Object.keys(state.productos.updates).length +
    state.pendingDeletes.productos.length;

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">Productos</h1>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium whitespace-nowrap">
              {pendingCount} pendiente(s)
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setDeleteMode(!deleteMode); setSelectedIds(new Set()); }}
            className={`px-4 py-2 border rounded-md text-sm cursor-pointer ${
              deleteMode
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {deleteMode ? 'Cancelar' : 'Modo eliminar'}
          </button>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer hover:bg-blue-600"
          >
            + Nuevo
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={effectiveData}
        onEdit={(row) => { setEditing(row); setShowForm(true); }}
        loading={loading}
        selectable={deleteMode}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleteSelected={handleDeleteSelected}
      />

      {showForm && (
        <ProductForm
          initial={stripMeta(editing)}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Eliminar productos"
        message={`¿Marcar ${confirmDelete?.length} producto(s) para eliminación? Estos cambios se confirmarán al guardar todo.`}
        confirmLabel="Marcar para eliminar"
        variant="danger"
        onConfirm={confirmDeletes}
        onCancel={() => setConfirmDelete(null)}
      />
    </Layout>
  );
}
