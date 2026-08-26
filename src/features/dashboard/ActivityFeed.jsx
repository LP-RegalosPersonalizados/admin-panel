import { Clock, PlusCircle, Edit3, Trash2, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import { timeAgo } from './format';

const ACTION_CONFIG = {
  create: { icon: PlusCircle, label: 'Creado', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  update: { icon: Edit3, label: 'Modificado', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  delete: { icon: Trash2, label: 'Eliminado', bg: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

export default function ActivityFeed({ entries = [] }) {
  return (
    <Card title="Actividad Reciente" icon={Clock} className="bg-transparent! shadow-none! border-none! dark:bg-transparent! dark:border-none! p-0!">
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-[#8e8e93] dark:text-[#636366]">
          <Inbox size={28} className="mb-2" />
          <p className="text-sm">Sin actividad reciente</p>
        </div>
      ) : (
        <div className="space-y-1">
          {entries.slice(0, 10).map((entry) => {
            const config = ACTION_CONFIG[entry.type] || ACTION_CONFIG.update;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#38383a] transition-colors"
              >
                <div className={`p-1.5 rounded-full ${config.bg}`}>
                  <config.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                    <span className="font-medium capitalize">{entry.resource}</span>{' '}
                    {config.label.toLowerCase()}: <span className="font-medium">{entry.label}</span>
                  </p>
                </div>
                {entry.date && (
                  <span
                    className="text-xs text-[#8e8e93] dark:text-[#636366] whitespace-nowrap"
                    title={new Date(entry.date).toLocaleString('es-VE')}
                  >
                    {timeAgo(entry.date)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
