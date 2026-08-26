import { TrendingUp, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function PriceHistogram({ data }) {
  const buckets = data || [];
  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  return (
    <Card title="Distribución de Precios" icon={TrendingUp} className="h-full bg-transparent! shadow-none! border-none! dark:bg-transparent! dark:border-none! p-0!">
      {buckets.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[#8e8e93] dark:text-[#636366]">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin precios registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buckets.map((bucket) => (
            <div key={bucket.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{bucket.label}</span>
                <span className="text-[#6e6e73] dark:text-[#86868b]">
                  {bucket.count} {bucket.count === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              <div className="w-full bg-[#f5f5f7] rounded-full h-2.5 dark:bg-[#38383a]" role="presentation">
                <div
                  className="bg-emerald-500 dark:bg-emerald-400 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${(bucket.count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
