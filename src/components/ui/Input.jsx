export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) {
  const inputClass = `w-full p-2 border rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error
      ? 'border-red-400 focus:ring-red-400'
      : 'border-slate-300 dark:border-slate-600'
  } ${Icon ? 'pl-9' : ''} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={16} className="text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <input type={type} className={inputClass} {...props} />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
