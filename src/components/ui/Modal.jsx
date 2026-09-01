import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export default function Modal({ isOpen, onClose, title, size = 'md', children, footer }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    const el = contentRef.current;
    if (el) {
      const firstField = el.querySelector('input, textarea, select');
      if (firstField) firstField.focus();
      else el.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`relative w-full sm:rounded-2xl bg-white dark:bg-[#161617] shadow-xl animate-slide-up sm:animate-fade-in ${sizes[size]} max-h-[90vh] flex flex-col`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#d2d2d7] dark:border-[#38383a]">
            <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#8e8e93] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] dark:hover:text-[#f5f5f7] dark:hover:bg-[#38383a]"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#d2d2d7] dark:border-[#38383a]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
