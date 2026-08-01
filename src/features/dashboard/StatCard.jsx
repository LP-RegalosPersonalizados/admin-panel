import { Package, Briefcase, Tags, Hash, ShoppingCart } from 'lucide-react';

const ICON_MAP = { Package, Briefcase, Tags, Hash, ShoppingCart };

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400' },
};

export default function StatCard({ iconName, title, value, pending, color = 'blue' }) {
  const Icon = ICON_MAP[iconName];
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          {Icon && <Icon size={18} className={colors.icon} />}
        </div>
        <h3 className="text-sm text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
      <div className="flex items-baseline gap-3">
        <p className={`text-4xl font-bold ${colors.value}`}>{value}</p>
        {pending > 0 && (
          <span className="text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 px-2 py-1 rounded font-medium">
            {pending} pendiente(s)
          </span>
        )}
      </div>
    </div>
  );
}
