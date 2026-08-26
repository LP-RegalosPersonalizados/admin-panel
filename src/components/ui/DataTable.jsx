import { Pencil, Trash2, Inbox } from 'lucide-react';
import Button from './Button';

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
  if (loading) return <p className="text-[#6e6e73] dark:text-[#86868b]">Cargando...</p>;

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
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-left font-semibold text-sm whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {col.label}
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-sm whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (selectable ? 1 : 0)} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center text-[#8e8e93] dark:text-[#636366]">
                    <Inbox size={40} className="mb-2" />
                    <p className="text-sm">No hay datos</p>
                  </div>
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
                      {onDelete && !selectable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onDelete(row.id)}
                        >
                          Eliminar
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
    </div>
  );
}
