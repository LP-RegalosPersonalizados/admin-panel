import { useMemo } from 'react';
import { Plus, Trash2, Check, X, Search, Package, DollarSign, Tags, Star } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import BentoGrid from '../../components/ui/BentoGrid';
import BentoCell from '../../components/ui/BentoCell';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
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
    render: (v) => (v
      ? <Check size={16} className="text-emerald-500" />
      : <X size={16} className="text-[#d2d2d7] dark:text-[#48484a]" />
    ),
  },
];

export default function ProductosView({
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
    const prices = data.map((p) => p.price).filter((p) => p != null && p > 0);
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const categories = new Set(data.map((p) => p.category).filter(Boolean));
    const featured = data.filter((p) => p.featured).length;
    return [
      { icon: Package, label: 'Total', value: data.length, color: 'text-[#0071e3] dark:text-[#2997ff]' },
      { icon: DollarSign, label: 'Precio promedio', value: `Bs ${avgPrice}`, color: 'text-emerald-600 dark:text-emerald-400' },
      { icon: Tags, label: 'Categorías', value: categories.size, color: 'text-[#af52de] dark:text-[#bf5af2]' },
      { icon: Star, label: 'Destacados', value: featured, color: 'text-amber-600 dark:text-amber-400' },
    ];
  }, [effectiveData]);

  return (
    <Layout>
      <BentoGrid variant="page" maxWidth="1200px">
        {/* Cell 1: Header */}
        <BentoCell className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Productos</h1>
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
        </BentoCell>

        {/* Cell 2: Summary stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <BentoCell key={stat.label} compact className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#1c1c1e]">
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-[#6e6e73] dark:text-[#86868b]">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </BentoCell>
          ))}
        </div>

        {/* Cell 3: Search */}
        <BentoCell>
          <div className="relative max-w-md">
            <Input
              icon={Search}
              type="text"
              placeholder="Buscar por nombre o categoría..."
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
        </BentoCell>

        {/* Cell 4: DataTable */}
        <BentoCell>
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
        </BentoCell>
      </BentoGrid>

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
