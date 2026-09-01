const variants = {
  default: 'bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#38383a] dark:text-[#f5f5f7]',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-[rgba(0,113,227,0.12)] text-[#0071e3] dark:bg-[rgba(10,132,255,0.18)] dark:text-[#2997ff]',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({ variant = 'default', size = 'sm', icon: Icon, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
