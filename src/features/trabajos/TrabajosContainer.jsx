import { useState, useEffect, useCallback } from 'react';
import { getTrabajos } from '../../lib/trabajos';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { stripMeta } from '../../utils/stripMeta';
import TrabajosView from './TrabajosView';

export default function TrabajosContainer() {
  const { state, dispatch, getEffectiveList } = usePendingChanges();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getTrabajos()
      .then(setTrabajos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const effectiveData = getEffectiveList('trabajos', trabajos);

  const handleSave = useCallback((data) => {
    if (editing) {
      if (editing.__pendingNew) {
        dispatch({ type: 'ADD_UPDATE', resource: 'trabajos', id: editing.id, original: null, modified: data });
      } else {
        dispatch({
          type: 'ADD_UPDATE',
          resource: 'trabajos',
          id: editing.id,
          original: editing.__original || editing,
          modified: data,
        });
      }
    } else {
      dispatch({ type: 'ADD_CREATE', resource: 'trabajos', data });
    }
    setShowForm(false);
    setEditing(null);
  }, [editing, dispatch]);

  const handleDeleteSelected = useCallback((ids) => {
    setConfirmDelete(ids);
  }, []);

  const confirmDeletes = useCallback(() => {
    if (confirmDelete && confirmDelete.length > 0) {
      dispatch({ type: 'MARK_DELETE', resource: 'trabajos', ids: confirmDelete });
    }
    setConfirmDelete(null);
    setSelectedIds(new Set());
    setDeleteMode(false);
  }, [confirmDelete, dispatch]);

  const pendingCount =
    state.trabajos.creates.length +
    Object.keys(state.trabajos.updates).length +
    state.pendingDeletes.trabajos.length;

  return (
    <TrabajosView
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
