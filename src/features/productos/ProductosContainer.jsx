import useCrudGrid from '../../hooks/useCrudGrid';
import ProductosView from './ProductosView';

export default function ProductosContainer() {
  const grid = useCrudGrid({
    resource: 'productos', dataKey: 'productos',
    searchFields: ['name', 'category'], resourceLabel: 'producto', labelField: 'name'
  });
  return <ProductosView {...grid} />;
}
