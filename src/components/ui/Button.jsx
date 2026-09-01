import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#0071e3] text-white hover:bg-[#0077ed] dark:bg-[#0a84ff] dark:hover:bg-[#409cff]',
  secondary: 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] dark:bg-[#38383a] dark:text-[#f5f5f7] dark:hover:bg-[#48484a]',
  danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
  ghost: 'text-[#6e6e73] hover:bg-[#f5f5f7] dark:text-[#86868b] dark:hover:bg-[#38383a]',
  outline: 'border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] dark:border-[#48484a] dark:text-[#f5f5f7] dark:hover:bg-[#38383a]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 dark:focus:ring-offset-[#000000] disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      {...rest}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} />
      )}
    </button>
  );
}
