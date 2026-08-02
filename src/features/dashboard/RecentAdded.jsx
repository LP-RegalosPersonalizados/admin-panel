import { Clock, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import { timeAgo } from './format';

export default function RecentAdded({ productos = [], trabajos = [] }) {
  const rows = [
    ...productos.map((p) => ({ ...p, __resource: 'producto' })),
    ...trabajos.map((t) => ({ ...t, __resource: 'trabajo' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Card title="Recientemente Agregados" icon={Clock} className="h-full">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin registros con fecha</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {rows.slice(0, 5).map((item) => (
            <li
              key={`${item.__resource}-${item.id}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 shrink-0">
                <Clock size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
                  {item.name || item.title}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                  {item.__resource} · {item.category || 'Sin categoría'}
                </p>
              </div>
              {item.createdAt && (
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap" title={new Date(item.createdAt).toLocaleString('es-VE')}>
                  {timeAgo(item.createdAt)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
