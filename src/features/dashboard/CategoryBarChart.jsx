import { Inbox } from 'lucide-react';

export default function CategoryBarChart({ data, color = 'blue', emptyLabel = 'Sin datos' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-[#8e8e93] dark:text-[#636366]">
        <Inbox size={32} className="mb-2" />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const barColor =
    color === 'amber'
      ? 'bg-amber-500 dark:bg-amber-400'
      : color === 'emerald'
        ? 'bg-emerald-500 dark:bg-emerald-400'
        : 'bg-[#0071e3] dark:bg-[#2997ff]';

  return (
    <div className="space-y-3" role="img" aria-label="Distribución por categoría">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium capitalize text-[#1d1d1f] dark:text-[#f5f5f7]">{item.name}</span>
            <span className="text-[#6e6e73] dark:text-[#86868b]">
              {item.count} {item.count === 1 ? 'item' : 'items'}
              {total > 0 ? ` (${Math.round((item.count / total) * 100)}%)` : ''}
            </span>
          </div>
          <div className="w-full bg-[#f5f5f7] rounded-full h-2.5 dark:bg-[#38383a]" role="presentation">
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
