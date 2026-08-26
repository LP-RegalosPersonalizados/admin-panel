import { Package, Briefcase, Tags, Hash, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';

const ICON_MAP = { Package, Briefcase, Tags, Hash, ShoppingCart };

const COLOR_MAP = {
  blue: { bg: 'bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.18)]', icon: 'text-[#0071e3] dark:text-[#2997ff]', value: 'text-[#0071e3] dark:text-[#2997ff]' },
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
          <h3 className="text-xs text-[#6e6e73] dark:text-[#86868b] truncate">{title}</h3>
          <p className={`text-2xl font-bold leading-tight ${colors.value}`}>{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pending > 0 && <Badge variant="warning">{pending} pendiente(s)</Badge>}
        {showArrow && <ArrowUpRight size={16} className="text-[#d2d2d7] dark:text-[#48484a]" />}
      </div>
    </div>
  );
}

export default function StatCard({ iconName, title, value, pending, color = 'blue', to }) {
  const cardClass = 'bg-white rounded-lg shadow-sm p-4 dark:bg-[#161617] dark:border dark:border-[#38383a]';

  if (to) {
    return (
      <Link
        to={to}
        className={`${cardClass} block no-underline transition-all duration-150 hover:shadow-md hover:ring-2 hover:ring-[rgba(0,113,227,0.15)] dark:hover:ring-[rgba(10,132,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#0071e3]`}
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
