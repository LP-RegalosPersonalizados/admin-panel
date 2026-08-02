import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function QuickActions({ onNewProducto, onNewTrabajo }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button icon={Plus} size="sm" onClick={onNewProducto}>
        Nuevo Producto
      </Button>
      <Button icon={Plus} variant="secondary" size="sm" onClick={onNewTrabajo}>
        Nuevo Trabajo
      </Button>
    </div>
  );
}
