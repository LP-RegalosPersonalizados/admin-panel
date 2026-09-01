import { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Inbox } from 'lucide-react';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import BatchSaveModal from './BatchSaveModal';
import PendingResourceSection from './PendingResourceSection';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function PendingChangesPanel({ isOpen, onClose }) {
  const { state, dispatch, getResourceCounts } = usePendingChanges();
  const { toast } = useToast();
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const panelRef = useRef(null);

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');
  const totalChanges = pCounts.total + tCounts.total;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handler);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-[55] bg-black/30 md:bg-black/20" onClick={onClose} />}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-[60] h-full bg-white dark:bg-[#161617] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full md:w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#d2d2d7] dark:border-[#38383a] bg-[#f5f5f7] dark:bg-[#000000]">
          <h2 className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">Cambios pendientes</h2>
          <button
            onClick={onClose}
            className="p-1 text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#38383a] rounded-md cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {totalChanges === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#8e8e93] dark:text-[#636366]">
              <Inbox size={32} className="mb-2" />
              <p className="text-sm">No hay cambios pendientes</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(state.productos.creates.length > 0 || Object.keys(state.productos.updates).length > 0 || state.pendingDeletes.productos.length > 0) && (
                <PendingResourceSection
                  title="Productos"
                  creates={state.productos.creates}
                  updates={state.productos.updates}
                  deletes={state.pendingDeletes.productos}
                  resource="productos"
                  dispatch={dispatch}
                  getName={(d) => d.name || d.title || 'Sin nombre'}
                />
              )}

              {(state.trabajos.creates.length > 0 || Object.keys(state.trabajos.updates).length > 0 || state.pendingDeletes.trabajos.length > 0) && (
                <PendingResourceSection
                  title="Trabajos"
                  creates={state.trabajos.creates}
                  updates={state.trabajos.updates}
                  deletes={state.pendingDeletes.trabajos}
                  resource="trabajos"
                  dispatch={dispatch}
                  getName={(d) => d.title || d.name || 'Sin nombre'}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalChanges > 0 && (
          <div className="border-t border-[#d2d2d7] dark:border-[#38383a] p-4 space-y-2">
            <Button icon={Upload} className="w-full" onClick={() => setShowBatchModal(true)}>
              Guardar todo ({totalChanges})
            </Button>
            <Button
              variant="outline"
              icon={Trash2}
              className="w-full"
              onClick={() => setShowDiscardConfirm(true)}
            >
              Descartar todo
            </Button>
          </div>
        )}
      </div>

      <BatchSaveModal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} />

      <ConfirmDialog
        isOpen={showDiscardConfirm}
        title="Descartar cambios"
        message="¿Descartar todos los cambios pendientes? Esta acción no se puede deshacer."
        confirmLabel="Descartar todo"
        variant="danger"
        onConfirm={() => {
          dispatch({ type: 'DISCARD_ALL' });
          toast({ type: 'info', title: 'Cambios descartados', message: 'Se eliminaron todos los cambios pendientes.' });
          setShowDiscardConfirm(false);
        }}
        onCancel={() => setShowDiscardConfirm(false)}
      />
    </>
  );
}
