import { Plus, Trash2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TrabajoForm from './TrabajoForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Título' },
  { key: 'category', label: 'Categoría' },
  { key: 'quantity', label: 'Cantidad' },
];

export default function TrabajosView({
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
          <h1 className="text-xl md:text-2xl font-bold dark:text-white">Trabajos</h1>
          {pendingCount > 0 && (
            <Badge variant="warning">{pendingCount} pendiente(s)</Badge>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={deleteMode ? 'danger' : 'outline'}
            icon={Trash2}
            onClick={onToggleDeleteMode}
          >
            {deleteMode ? 'Cancelar' : 'Modo eliminar'}
          </Button>
          <Button icon={Plus} onClick={onNew}>
            Nuevo
          </Button>
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
        <TrabajoForm
          initial={editing ? editing.__original || editing : null}
          onSave={onSave}
          onCancel={onCancelForm}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Eliminar trabajos"
        message={`¿Marcar ${confirmDelete?.length} trabajo(s) para eliminación? Estos cambios se confirmarán al guardar todo.`}
        confirmLabel="Marcar para eliminar"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Layout>
  );
}
