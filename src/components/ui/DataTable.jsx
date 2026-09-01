import { useState, useMemo } from 'react';
import { Pencil, Trash2, Inbox, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function DataTable({
  columns,
  data,
  onEdit,
  loading,
  selectable,
  selectedIds,
  onSelectionChange,
  onDeleteSelected,
  onCancelDelete,
  defaultPageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  if (loading) return <p className="text-[#6e6e73] dark:text-[#86868b]">Cargando...</p>;

  const isSortable = (col) => {
    if (col.sortable !== undefined) return col.sortable;
    return !col.render;
  };

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const aNull = av == null || av === '';
      const bNull = bv == null || bv === '';
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;

      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
        cmp = av === bv ? 0 : av ? 1 : -1;
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  // Clamp page if data shrinks or pageSize changes externally
  const effectivePage = totalPages === 0 ? 0 : Math.min(page, Math.max(0, totalPages - 1));

  const pageData = useMemo(
    () => sortedData.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize),
    [sortedData, effectivePage, pageSize],
  );

  // Keep selection on full data ids for simplicity (not scoped to page)
  const allIds = data.map((r) => r.id).filter(Boolean);
  const allSelected = allIds.length > 0 && selectedIds && selectedIds.size === allIds.length;

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(allIds));
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  };

  // Use effectivePage for navigation handlers to stay in sync when clamped
  const goPrev = () => setPage((p) => Math.max(0, Math.min(p, effectivePage) - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, Math.max(p, effectivePage) + 1));

  // If effectivePage differs from page due to clamping, sync on next render cycle via direct state update is not ideal;
  // instead we rely on effectivePage for slicing and navigation, but also correct page state when needed.
  // This avoids useEffect complexity while keeping UI consistent.

  return (
    <div>
      {selectable && selectedIds && onSelectionChange && (
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm text-[#6e6e73] dark:text-[#86868b]">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4"
            />
            {allSelected ? 'Deseleccionar todo' : `Seleccionar todo (${allIds.length})`}
          </label>
          {selectedIds.size > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-[#6e6e73] dark:text-[#86868b]">{selectedIds.size} seleccionado(s)</span>
              {onDeleteSelected && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDeleteSelected([...selectedIds])}
                >
                  Eliminar seleccionados
                </Button>
              )}
              {onCancelDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange(new Set())}
                >
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f5f5f7] dark:bg-[#161617] border-b-2 border-[#d2d2d7] dark:border-[#38383a]">
              {selectable && <th className="p-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4" /></th>}
              {columns.map((col) => {
                const sortable = isSortable(col);
                const isSorted = sortKey === col.key && sortDir;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, sortable)}
                    className={`p-3 text-left font-semibold text-sm whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7] select-none ${sortable ? 'cursor-pointer hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e]' : ''}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortable && (
                        <span className="inline-flex">
                          {isSorted === 'asc' || (sortKey === col.key && sortDir === 'asc') ? (
                            <ArrowUp size={14} className="text-[#0071e3] dark:text-[#2997ff]" />
                          ) : isSorted === 'desc' || (sortKey === col.key && sortDir === 'desc') ? (
                            <ArrowDown size={14} className="text-[#0071e3] dark:text-[#2997ff]" />
                          ) : (
                            <ArrowUpDown size={14} className="text-[#8e8e93] dark:text-[#636366]" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              <th className="p-3 text-left font-semibold text-sm whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (selectable ? 1 : 0)} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center text-[#8e8e93] dark:text-[#636366]">
                    <Inbox size={40} className="mb-2" />
                    <p className="text-sm">No hay datos</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => {
                const isPendingNew = row.__pendingNew;
                const isPending = row.__pending;
                const isPendingDelete = row.__pendingDelete;
                const isSelected = selectedIds?.has(row.id);

                return (
                  <tr
                    key={row.id || i}
                    className={`border-b border-[#d2d2d7] dark:border-[#38383a] ${
                      isPendingDelete ? 'bg-red-50 dark:bg-red-900/20 opacity-60' : ''
                    } ${isPendingNew ? 'bg-green-50 dark:bg-green-900/20' : ''} ${
                      isSelected ? 'bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.15)]' : ''
                    } ${!isPendingDelete && !isPendingNew && !isSelected ? 'bg-white dark:bg-[#161617]' : ''}`}
                  >
                    {selectable && (
                      <td className="p-3">
                        {!isPendingNew && (
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => toggleSelect(row.id)}
                            className="w-4 h-4"
                          />
                        )}
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="p-3 text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                        <div className="flex items-center gap-2">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                          {isPendingNew && <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">Nuevo</span>}
                          {isPending && <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">Pendiente</span>}
                          {isPendingDelete && <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">Eliminar</span>}
                        </div>
                      </td>
                    ))}
                    <td className="p-3">
                      {!isPendingDelete && onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Pencil}
                          onClick={() => onEdit(row)}
                        >
                          Editar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#d2d2d7] dark:border-[#38383a]">
          <div className="flex items-center gap-2 text-sm text-[#6e6e73] dark:text-[#86868b]">
            <span>Filas por página</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-[#d2d2d7] dark:border-[#48484a] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={effectivePage === 0}
              onClick={goPrev}
            >
              Anterior
            </Button>
            <span className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] px-2">
              Página {totalPages === 0 ? 0 : effectivePage + 1} de {totalPages} ({sortedData.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              iconPosition="right"
              disabled={effectivePage >= totalPages - 1}
              onClick={goNext}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
