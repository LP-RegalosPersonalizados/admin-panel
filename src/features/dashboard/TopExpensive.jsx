import { Trophy, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatCurrency } from './format';

export default function TopExpensive({ items }) {
  return (
    <Card title="Productos Más Caros" icon={Trophy} className="h-full bg-transparent! shadow-none! border-none! dark:bg-transparent! dark:border-none! p-0!">
      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[#8e8e93] dark:text-[#636366]">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin productos con precio</p>
        </div>
      ) : (
        <ol className="space-y-1">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#38383a] transition-colors"
            >
              <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-white bg-[#d2d2d7] dark:bg-[#48484a]">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] truncate font-medium">{item.name}</p>
                {item.category && (
                  <p className="text-xs text-[#8e8e93] dark:text-[#636366] capitalize">{item.category}</p>
                )}
              </div>
              <span className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap">
                Bs {formatCurrency(item._price ?? item.price)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
