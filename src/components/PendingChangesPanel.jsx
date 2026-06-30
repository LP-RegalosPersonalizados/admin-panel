import { useState, useEffect, useRef } from 'react';
import { usePendingChanges } from '../context/PendingChangesContext';
import BatchSaveModal from './BatchSaveModal';

export default function PendingChangesPanel({ isOpen, onClose }) {
  const { state, dispatch, getResourceCounts } = usePendingChanges();
  const [showBatchModal, setShowBatchModal] = useState(false);
  const panelRef = useRef(null);

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');
  const totalChanges = pCounts.total + tCounts.total;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/30 md:bg-black/20" onClick={onClose} />}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-40 h-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full md:w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-sm">Cambios pendientes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none cursor-pointer">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {totalChanges === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No hay cambios pendientes</p>
          ) : (
            <div className="space-y-6">
              {/* Productos section */}
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

              {/* Trabajos section */}
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
          <div className="border-t border-slate-200 p-4 space-y-2">
            <button
              onClick={() => setShowBatchModal(true)}
              className="w-full px-4 py-2.5 bg-blue-500 text-white border-0 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-600"
            >
              Guardar todo ({totalChanges})
            </button>
            <button
              onClick={() => { if (confirm('¿Descartar todos los cambios pendientes?')) dispatch({ type: 'DISCARD_ALL' }); }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50"
            >
              Descartar todo
            </button>
          </div>
        )}
      </div>

      <BatchSaveModal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} />
    </>
  );
}

function PendingResourceSection({ title, creates, updates, deletes, resource, dispatch, getName }) {
  const updatesList = Object.entries(updates);

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1.5">
        {creates.map((c) => (
          <PendingItem
            key={c.tempId}
            icon="🆕"
            label={getName(c.data)}
            sublabel="Nuevo"
            onDiscard={() => dispatch({ type: 'DISCARD_CREATE', resource, tempId: c.tempId })}
          />
        ))}
        {updatesList.map(([id, u]) => (
          <PendingItem
            key={id}
            icon="✏️"
            label={getName(u.modified)}
            sublabel="Modificado"
            onDiscard={() => dispatch({ type: 'DISCARD_UPDATE', resource, id })}
          />
        ))}
        {deletes.map((id) => (
          <PendingItem
            key={id}
            icon="🗑️"
            label={`ID: ${id}`}
            sublabel="Eliminación"
            sublabelClass="text-red-500"
            onDiscard={() => dispatch({ type: 'UNMARK_DELETE', resource, id })}
          />
        ))}
      </div>
    </div>
  );
}

function PendingItem({ icon, label, sublabel, sublabelClass, onDiscard }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0">{icon}</span>
        <div className="truncate">
          <p className="truncate text-slate-700">{label}</p>
          <p className={`text-xs ${sublabelClass || 'text-slate-400'}`}>{sublabel}</p>
        </div>
      </div>
      <button
        onClick={onDiscard}
        className="flex-shrink-0 ml-2 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        title="Descartar"
      >
        ✕
      </button>
    </div>
  );
}
