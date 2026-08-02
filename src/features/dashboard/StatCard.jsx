import { Package, Briefcase, Tags, Hash, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';

const ICON_MAP = { Package, Briefcase, Tags, Hash, ShoppingCart };

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400' },
};

function StatCardContent({ iconName, title, value, pending, color, showArrow }) {
  const Icon = ICON_MAP[iconName];
  const colors = COLOR_MAP[color];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg shrink-0 ${colors.bg}`}>
          {Icon && <Icon size={18} className={colors.icon} />}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs text-slate-500 dark:text-slate-400 truncate">{title}</h3>
          <p className={`text-2xl font-bold leading-tight ${colors.value}`}>{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pending > 0 && <Badge variant="warning">{pending} pendiente(s)</Badge>}
        {showArrow && <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600" />}
      </div>
    </div>
  );
}

export default function StatCard({ iconName, title, value, pending, color = 'blue', to }) {
  const cardClass = 'bg-white rounded-lg shadow-sm p-4 dark:bg-slate-800 dark:border dark:border-slate-700';

  if (to) {
    return (
      <Link
        to={to}
        className={`${cardClass} block no-underline transition-all duration-150 hover:shadow-md hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <StatCardContent iconName={iconName} title={title} value={value} pending={pending} color={color} showArrow />
      </Link>
    );
  }

  return (
    <div className={cardClass}>
      <StatCardContent iconName={iconName} title={title} value={value} pending={pending} color={color} />
    </div>
  );
}
