import { XCircle } from 'lucide-react';

export default function PendingItem({ icon: Icon, iconClass, label, sublabel, sublabelClass, onDiscard }) {
  return (
    <div className="flex items-center justify-between bg-[#f5f5f7] dark:bg-[#38383a] rounded-lg px-3 py-2 text-sm group">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`flex-shrink-0 ${iconClass || ''}`}>
          {Icon && <Icon size={16} />}
        </span>
        <div className="truncate">
          <p className="truncate text-[#1d1d1f] dark:text-[#f5f5f7]">{label}</p>
          <p className={`text-xs ${sublabelClass || 'text-[#8e8e93] dark:text-[#636366]'}`}>{sublabel}</p>
        </div>
      </div>
      <button
        onClick={onDiscard}
        className="flex-shrink-0 ml-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        title="Descartar"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
}
