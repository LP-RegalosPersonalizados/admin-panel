import { Clock, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import { timeAgo } from './format';

export default function RecentAdded({ productos = [], trabajos = [] }) {
  const rows = [
    ...productos.map((p) => ({ ...p, __resource: 'producto' })),
    ...trabajos.map((t) => ({ ...t, __resource: 'trabajo' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Card title="Recientemente Agregados" icon={Clock} className="h-full bg-transparent! shadow-none! border-none! dark:bg-transparent! dark:border-none! p-0!">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[#8e8e93] dark:text-[#636366]">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin registros con fecha</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {rows.slice(0, 5).map((item) => (
            <li
              key={`${item.__resource}-${item.id}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#38383a] transition-colors"
            >
              <div className="p-1.5 rounded-md bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.18)] text-[#0071e3] dark:text-[#2997ff] shrink-0">
                <Clock size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] truncate font-medium">
                  {item.name || item.title}
                </p>
                <p className="text-xs text-[#8e8e93] dark:text-[#636366] capitalize">
                  {item.__resource} · {item.category || 'Sin categoría'}
                </p>
              </div>
              {item.createdAt && (
                <span className="text-xs text-[#8e8e93] dark:text-[#636366] whitespace-nowrap" title={new Date(item.createdAt).toLocaleString('es-VE')}>
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
