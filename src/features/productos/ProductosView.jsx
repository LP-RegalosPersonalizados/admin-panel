import Layout from '../../components/layout/Layout';
import DataTable from '../../components/ui/DataTable';
import ProductForm from './ProductForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const COLUMNS = [
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

export default function ProductosView({
  effectiveData,
  loading,
  showForm,
  editing,
  deleteMode,
  selectedIds,
  confirmDelete,
  pendingCount,
  onNew,
  onEdit,
  onSave,
  onCancelForm,
  onToggleDeleteMode,
  onSelectionChange,
  onDeleteSelected,
  onConfirmDelete,
  onCancelDelete,
}) {
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
            onClick={onToggleDeleteMode}
            className={`px-4 py-2 border rounded-md text-sm cursor-pointer ${
              deleteMode
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {deleteMode ? 'Cancelar' : 'Modo eliminar'}
          </button>
          <button
            onClick={onNew}
            className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer hover:bg-blue-600"
          >
            + Nuevo
          </button>
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={effectiveData}
        onEdit={onEdit}
        loading={loading}
        selectable={deleteMode}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onDeleteSelected={onDeleteSelected}
      />

      {showForm && (
        <ProductForm
          initial={editing ? editing.__original || editing : null}
          onSave={onSave}
          onCancel={onCancelForm}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Eliminar productos"
        message={`¿Marcar ${confirmDelete?.length} producto(s) para eliminación? Estos cambios se confirmarán al guardar todo.`}
        confirmLabel="Marcar para eliminar"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Layout>
  );
}
