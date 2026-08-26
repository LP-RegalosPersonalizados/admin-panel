import { useMemo } from 'react';
import { Plus, Trash2, X, Search, Briefcase, Hash, Tags } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
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
  searchQuery,
  onSearchChange,
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
  const summaryStats = useMemo(() => {
    const data = effectiveData || [];
    const quantities = data.map((t) => t.quantity).filter((q) => q != null && q > 0);
    const totalQty = quantities.reduce((a, b) => a + b, 0);
    const categories = new Set(data.map((t) => t.category).filter(Boolean));
    return [
      { icon: Briefcase, label: 'Total', value: data.length, color: 'text-[#0071e3] dark:text-[#2997ff]' },
      { icon: Hash, label: 'Cantidad total', value: totalQty, color: 'text-emerald-600 dark:text-emerald-400' },
      { icon: Tags, label: 'Categorías', value: categories.size, color: 'text-[#af52de] dark:text-[#bf5af2]' },
    ];
  }, [effectiveData]);

  return (
    <Layout>
      <div className="bento-page">
        {/* Cell 1: Header */}
        <div className="bento-cell flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Trabajos</h1>
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

        {/* Cell 2: Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bento-cell flex items-center gap-3 !p-4">
              <div className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#1c1c1e]">
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b]">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cell 3: Search */}
        <div className="bento-cell">
          <div className="relative max-w-md">
            <Input
              icon={Search}
              type="text"
              placeholder="Buscar por título o categoría..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] rounded-md cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Cell 4: DataTable */}
        <div className="bento-cell">
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
        </div>
      </div>

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
