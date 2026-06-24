export default function DataTable({ columns, data, onEdit, onDelete, loading }) {
  if (loading) return <p className="text-slate-500">Cargando...</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg">
        <thead>
          <tr className="bg-slate-50 border-b-2 border-slate-200">
            {columns.map((col) => (
              <th key={col.key} className="p-3 text-left font-semibold text-sm">
                {col.label}
              </th>
            ))}
            <th className="p-3 text-left font-semibold text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="p-5 text-center text-slate-400">
                No hay datos
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i} className="border-b border-slate-200">
                {columns.map((col) => (
                  <td key={col.key} className="p-3 text-sm">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="p-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="mr-2 px-3 py-1.5 bg-blue-500 text-white border-0 rounded text-xs cursor-pointer"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row.id)}
                      className="px-3 py-1.5 bg-red-500 text-white border-0 rounded text-xs cursor-pointer"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
