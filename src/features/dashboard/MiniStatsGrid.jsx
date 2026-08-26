import { DollarSign, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatCurrency } from './format';

export default function MiniStatsGrid({ priceStats, audienceStats }) {
  const sections = [
    {
      icon: DollarSign,
      title: 'Precios (Bs)',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      items: priceStats
        ? [
            { label: 'Promedio', value: formatCurrency(priceStats.avg), color: 'text-[#0071e3] dark:text-[#2997ff]' },
            { label: 'Máximo', value: formatCurrency(priceStats.max), color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Mínimo', value: formatCurrency(priceStats.min), color: 'text-emerald-600 dark:text-emerald-400' },
          ]
        : [{ label: 'Sin precios', value: '-', color: 'text-[#8e8e93]' }],
    },
    {
      icon: Users,
      title: 'Audiencia',
      color: 'text-[#0071e3] dark:text-[#2997ff]',
      bg: 'bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.18)]',
      items: [
        { label: 'General disponible', value: audienceStats?.general ?? 0, color: 'text-[#0071e3] dark:text-[#2997ff]' },
        { label: 'Business disponible', value: audienceStats?.business ?? 0, color: 'text-purple-600 dark:text-purple-400' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map((section) => (
        <Card key={section.title} title={section.title} icon={section.icon} iconClassName={section.color} className="h-full bg-transparent! shadow-none! border-none! dark:bg-transparent! dark:border-none! p-0!">
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-[#6e6e73] dark:text-[#86868b]">{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
