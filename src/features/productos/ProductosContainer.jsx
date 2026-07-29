import { useState, useEffect, useCallback } from 'react';
import { getProductos } from '../../lib/productos';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { stripMeta } from '../../utils/stripMeta';
import ProductosView from './ProductosView';

export default function ProductosContainer() {
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
    getProductos()
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

  const pendingCount =
    state.productos.creates.length +
    Object.keys(state.productos.updates).length +
    state.pendingDeletes.productos.length;

  return (
    <ProductosView
      effectiveData={effectiveData}
      loading={loading}
      showForm={showForm}
      editing={editing}
      deleteMode={deleteMode}
      selectedIds={selectedIds}
      confirmDelete={confirmDelete}
      pendingCount={pendingCount}
      onNew={() => { setEditing(null); setShowForm(true); }}
      onEdit={(row) => { setEditing(row); setShowForm(true); }}
      onSave={handleSave}
      onCancelForm={() => { setShowForm(false); setEditing(null); }}
      onToggleDeleteMode={() => { setDeleteMode(d => !d); setSelectedIds(new Set()); }}
      onSelectionChange={setSelectedIds}
      onDeleteSelected={handleDeleteSelected}
      onConfirmDelete={confirmDeletes}
      onCancelDelete={() => setConfirmDelete(null)}
    />
  );
}
