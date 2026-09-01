import useCrudGrid from '../../hooks/useCrudGrid';
import TrabajosView from './TrabajosView';

export default function TrabajosContainer() {
  const grid = useCrudGrid({
    resource: 'trabajos', dataKey: 'trabajos',
    searchFields: ['title', 'category'], resourceLabel: 'trabajo', labelField: 'title'
  });
  return <TrabajosView {...grid} />;
}
