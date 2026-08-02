import { Star, DollarSign, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatCurrency } from './format';

export default function MiniStatsGrid({ featuredStats, priceStats, audienceStats }) {
  const sections = [
    {
      icon: Star,
      title: 'Destacados',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      items: [
        { label: 'Destacados', value: featuredStats?.featured ?? 0, color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Normales', value: featuredStats?.notFeatured ?? 0, color: 'text-slate-500 dark:text-slate-400' },
      ],
    },
    {
      icon: DollarSign,
      title: 'Precios (Bs)',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      items: priceStats
        ? [
            { label: 'Promedio', value: formatCurrency(priceStats.avg), color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Máximo', value: formatCurrency(priceStats.max), color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Mínimo', value: formatCurrency(priceStats.min), color: 'text-emerald-600 dark:text-emerald-400' },
          ]
        : [{ label: 'Sin precios', value: '-', color: 'text-slate-400' }],
    },
    {
      icon: Users,
      title: 'Audiencia',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      items: [
        { label: 'General disponible', value: audienceStats?.general ?? 0, color: 'text-blue-600 dark:text-blue-400' },
        { label: 'Business disponible', value: audienceStats?.business ?? 0, color: 'text-purple-600 dark:text-purple-400' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {sections.map((section) => (
        <Card key={section.title} title={section.title} icon={section.icon} iconClassName={section.color} className="h-full">
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
