export default function Card({ title, subtitle, icon: Icon, iconClassName = 'text-slate-500 dark:text-slate-400', action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 dark:bg-slate-800 dark:border dark:border-slate-700 ${className}`}>
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className={iconClassName} />}
            <div>
              {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
