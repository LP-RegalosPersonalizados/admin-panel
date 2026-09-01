import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { usePendingChanges } from '../context/PendingChangesContext';
import { logActivity } from '../utils/activityLog';
import { useToast } from '../components/ui/Toast';

export default function useCrudGrid({ resource, dataKey, searchFields, resourceLabel, labelField }) {
  const { state, dispatch, getEffectiveList } = usePendingChanges();
  const dataContext = useData();
  const dataArray = dataContext[dataKey];
  const { loading, loadIfNeeded } = dataContext;
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('buscar') || '';
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { loadIfNeeded(); }, [loadIfNeeded]);

  useEffect(() => {
    if (searchParams.get('nuevo') === '1') {
      setEditing(null);
      setShowForm(true);
      const next = new URLSearchParams(searchParams);
      next.delete('nuevo');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveData = getEffectiveList(resource, dataArray);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return effectiveData;
    return effectiveData.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [effectiveData, query, searchFields]);

  const handleSearch = useCallback((value) => {
    setSearchParams(value.trim() ? { buscar: value.trim() } : {});
  }, [setSearchParams]);

  const handleSave = useCallback((data) => {
    if (editing) {
      if (editing.__pendingNew) {
        dispatch({ type: 'ADD_UPDATE', resource, id: editing.id, original: null, modified: data });
      } else {
        dispatch({
          type: 'ADD_UPDATE',
          resource,
          id: editing.id,
          original: editing.__original || editing,
          modified: data,
        });
      }
    } else {
      dispatch({ type: 'ADD_CREATE', resource, data });
    }
    const capitalizedLabel = resourceLabel.charAt(0).toUpperCase() + resourceLabel.slice(1);
    logActivity({ type: editing ? 'update' : 'create', resource: resourceLabel, label: data[labelField] || 'Sin nombre' });
    toast({
      type: 'success',
      title: editing ? `${capitalizedLabel} actualizado` : `${capitalizedLabel} creado`,
      message: data[labelField] || 'Sin nombre',
    });
    setShowForm(false);
    setEditing(null);
  }, [editing, dispatch, toast, resource, resourceLabel, labelField]);

  const handleDeleteSelected = useCallback((ids) => {
    setConfirmDelete(ids);
  }, []);

  const confirmDeletes = useCallback(() => {
    if (confirmDelete && confirmDelete.length > 0) {
      dispatch({ type: 'MARK_DELETE', resource, ids: confirmDelete });
    }
    logActivity({ type: 'delete', resource: resourceLabel, label: `${confirmDelete.length} ${resourceLabel}(s)` });
    toast({
      type: 'warning',
      title: 'Marcados para eliminar',
      message: `${confirmDelete.length} ${resourceLabel}(s). Se eliminarán al guardar todo.`,
    });
    setConfirmDelete(null);
    setSelectedIds(new Set());
    setDeleteMode(false);
  }, [confirmDelete, dispatch, toast, resource, resourceLabel]);

  const pendingCount =
    state[resource].creates.length +
    Object.keys(state[resource].updates).length +
    state.pendingDeletes[resource].length;

  const onNew = useCallback(() => { setEditing(null); setShowForm(true); }, []);
  const onEdit = useCallback((row) => { setEditing(row); setShowForm(true); }, []);
  const onCancelForm = useCallback(() => { setShowForm(false); setEditing(null); }, []);
  const onToggleDeleteMode = useCallback(() => { setDeleteMode((d) => !d); setSelectedIds(new Set()); }, []);
  const onCancelDelete = useCallback(() => setConfirmDelete(null), []);

  return {
    effectiveData: filteredData,
    searchQuery: query,
    onSearchChange: handleSearch,
    loading,
    showForm,
    editing,
    deleteMode,
    selectedIds,
    confirmDelete,
    pendingCount,
    onNew,
    onEdit,
    onSave: handleSave,
    onCancelForm,
    onToggleDeleteMode,
    onSelectionChange: setSelectedIds,
    onDeleteSelected: handleDeleteSelected,
    onConfirmDelete: confirmDeletes,
    onCancelDelete,
  };
}
