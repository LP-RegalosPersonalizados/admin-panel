export default function BentoGrid({ variant = 'page', maxWidth, className = '', children }) {
  const baseClass =
    variant === 'dashboard'
      ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'flex flex-col gap-4 mx-auto';

  const mergedClass = [baseClass, className].filter(Boolean).join(' ');

  const style = variant === 'page' && maxWidth ? { maxWidth } : undefined;

  return (
    <div className={mergedClass} style={style}>
      {children}
    </div>
  );
}
