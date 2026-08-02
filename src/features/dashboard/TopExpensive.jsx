import { Trophy, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatCurrency } from './format';

export default function TopExpensive({ items }) {
  return (
    <Card title="Productos Más Caros" icon={Trophy} className="h-full">
      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin productos con precio</p>
        </div>
      ) : (
        <ol className="space-y-1">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-white bg-slate-300 dark:bg-slate-600">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">{item.name}</p>
                {item.category && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{item.category}</p>
                )}
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                Bs {formatCurrency(item._price ?? item.price)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
