import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function QuickActions({ onNewProducto, onNewTrabajo }) {
  return (
    <div className="flex gap-2">
      <Button
        icon={Plus}
        size="sm"
        onClick={onNewProducto}
        aria-label="Nuevo producto"
        title="Nuevo producto"
      >
        Nuevo Producto
      </Button>
      <Button
        icon={Plus}
        variant="secondary"
        size="sm"
        onClick={onNewTrabajo}
        aria-label="Nuevo trabajo"
        title="Nuevo trabajo"
      >
        Nuevo Trabajo
      </Button>
    </div>
  );
}
