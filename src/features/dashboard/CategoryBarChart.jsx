import { Inbox } from 'lucide-react';

export default function CategoryBarChart({ data, color = 'blue', emptyLabel = 'Sin datos' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
        <Inbox size={32} className="mb-2" />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count));
  const barColor =
    color === 'amber'
      ? 'bg-amber-500 dark:bg-amber-400'
      : color === 'emerald'
        ? 'bg-emerald-500 dark:bg-emerald-400'
        : 'bg-blue-500 dark:bg-blue-400';

  return (
    <div className="space-y-3" role="img" aria-label="Distribución por categoría">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium capitalize text-slate-700 dark:text-slate-300">{item.name}</span>
            <span className="text-slate-500 dark:text-slate-400">
              {item.count} {item.count === 1 ? 'item' : 'items'}
              {max > 1 ? ` (${Math.round((item.count / max) * 100)}%)` : ''}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 dark:bg-slate-700" role="presentation">
            <div
              className={`${barColor} h-2.5 rounded-full transition-all duration-700`}
              style={{ width: `${max > 0 ? (item.count / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
