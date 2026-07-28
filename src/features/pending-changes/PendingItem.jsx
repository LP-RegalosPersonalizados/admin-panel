export default function PendingItem({ icon, label, sublabel, sublabelClass, onDiscard }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0">{icon}</span>
        <div className="truncate">
          <p className="truncate text-slate-700">{label}</p>
          <p className={`text-xs ${sublabelClass || 'text-slate-400'}`}>{sublabel}</p>
        </div>
      </div>
      <button
        onClick={onDiscard}
        className="flex-shrink-0 ml-2 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        title="Descartar"
      >
        ✕
      </button>
    </div>
  );
}
