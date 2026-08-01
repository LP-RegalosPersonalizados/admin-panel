import { useState, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { stripMeta } from '../../utils/stripMeta';
import { logActivity } from '../../utils/activityLog';
import { useToast } from '../../components/ui/Toast';
import ProductosView from './ProductosView';

export default function ProductosContainer() {
  const { state, dispatch, getEffectiveList } = usePendingChanges();
  const { productos, loading, loadIfNeeded } = useData();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);

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
    logActivity({ type: editing ? 'update' : 'create', resource: 'producto', label: data.name || 'Sin nombre' });
    toast({
      type: 'success',
      title: editing ? 'Producto actualizado' : 'Producto creado',
      message: data.name || 'Sin nombre',
    });
    setShowForm(false);
    setEditing(null);
  }, [editing, dispatch, toast]);

  const handleDeleteSelected = useCallback((ids) => {
    setConfirmDelete(ids);
  }, []);

  const confirmDeletes = useCallback(() => {
    if (confirmDelete && confirmDelete.length > 0) {
      dispatch({ type: 'MARK_DELETE', resource: 'productos', ids: confirmDelete });
    }
    logActivity({ type: 'delete', resource: 'producto', label: `${confirmDelete.length} producto(s)` });
    toast({
      type: 'warning',
      title: 'Marcados para eliminar',
      message: `${confirmDelete.length} producto(s). Se eliminarán al guardar todo.`,
    });
    setConfirmDelete(null);
    setSelectedIds(new Set());
    setDeleteMode(false);
  }, [confirmDelete, dispatch, toast]);

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
