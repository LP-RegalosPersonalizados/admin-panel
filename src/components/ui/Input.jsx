export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) {
  const inputClass = `w-full p-2 border rounded-md text-sm bg-white dark:bg-[#38383a] dark:text-[#f5f5f7] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0071e3] ${
    error
      ? 'border-red-400 focus:ring-red-400'
      : 'border-[#d2d2d7] dark:border-[#48484a]'
  } ${Icon ? 'pl-9' : ''} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={16} className="text-[#8e8e93] dark:text-[#636366]" />
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
