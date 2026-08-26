export default function Card({ title, subtitle, icon: Icon, iconClassName = 'text-[#6e6e73] dark:text-[#86868b]', action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 dark:bg-[#161617] dark:border dark:border-[#38383a] ${className}`}>
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className={iconClassName} />}
            <div>
              {title && <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#6e6e73] dark:text-[#86868b]">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
