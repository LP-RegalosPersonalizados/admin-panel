import { useEffect, useRef } from 'react';

export default function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel, variant = 'default', onConfirm, onCancel }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmColor = variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white w-full md:max-w-md md:rounded-xl rounded-t-xl p-6 shadow-xl animate-slide-up md:animate-fade-in">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50"
          >
            {cancelLabel || 'Cancelar'}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 text-white border-0 rounded-lg text-sm cursor-pointer ${confirmColor}`}
          >
            {confirmLabel || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
