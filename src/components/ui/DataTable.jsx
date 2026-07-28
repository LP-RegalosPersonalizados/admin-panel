export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  selectable,
  selectedIds,
  onSelectionChange,
  onDeleteSelected,
  onCancelDelete,
}) {
  if (loading) return <p className="text-slate-500">Cargando...</p>;

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

  return (
    <div>
      {selectable && selectedIds && onSelectionChange && (
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4"
            />
            {allSelected ? 'Deseleccionar todo' : `Seleccionar todo (${allIds.length})`}
          </label>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <span className="text-sm text-slate-500">{selectedIds.size} seleccionado(s)</span>
              {onDeleteSelected && (
                <button
                  onClick={() => onDeleteSelected([...selectedIds])}
                  className="px-3 py-1.5 bg-red-500 text-white border-0 rounded text-xs cursor-pointer"
                >
                  Eliminar seleccionados
                </button>
              )}
              {onCancelDelete && (
                <button
                  onClick={() => onSelectionChange(new Set())}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              {selectable && <th className="p-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4" /></th>}
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-left font-semibold text-sm whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-sm whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (selectable ? 1 : 0)} className="p-5 text-center text-slate-400">
                  No hay datos
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const isPendingNew = row.__pendingNew;
                const isPending = row.__pending;
                const isPendingDelete = row.__pendingDelete;
                const isSelected = selectedIds?.has(row.id);

                return (
                  <tr
                    key={row.id || i}
                    className={`border-b border-slate-200 ${
                      isPendingDelete ? 'bg-red-50 opacity-60' : ''
                    } ${isPendingNew ? 'bg-green-50' : ''} ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
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
                      <td key={col.key} className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                          {isPendingNew && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Nuevo</span>}
                          {isPending && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Pendiente</span>}
                          {isPendingDelete && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Eliminar</span>}
                        </div>
                      </td>
                    ))}
                    <td className="p-3">
                      {!isPendingDelete && onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="mr-2 px-3 py-1.5 bg-blue-500 text-white border-0 rounded text-xs cursor-pointer hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && !selectable && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="px-3 py-1.5 bg-red-500 text-white border-0 rounded text-xs cursor-pointer hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
