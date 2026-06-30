import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingChanges } from '../context/PendingChangesContext';
import { api } from '../lib/api';

export default function BatchSaveModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { state, getResourceCounts, dispatch } = usePendingChanges();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const confirmRef = useRef(null);

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');
  const totalChanges = pCounts.total + tCounts.total;

  const DEPLOY_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_uc9Q2uvKMpqH2FjJpQytlKg67hPt/ALhaQ6ckGC';

  useEffect(() => {
    if (isOpen && confirmRef.current) confirmRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  async function triggerVercelBuild() {
    try { await fetch(DEPLOY_HOOK, { method: 'POST' }); } catch {}
  }

  async function handleConfirm() {
    setSaving(true);
    setResult(null);
    const errors = [];

    try {
      if (state.productos.creates.length > 0 || Object.keys(state.productos.updates).length > 0) {
        const res = await api.batchSaveProductos({
          creates: state.productos.creates.map((c) => c.data),
          updates: Object.entries(state.productos.updates).map(([id, u]) => ({ id, ...u.modified })),
        });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'productos', type: 'save', items: res.failed });
        }
      }

      if (state.trabajos.creates.length > 0 || Object.keys(state.trabajos.updates).length > 0) {
        const res = await api.batchSaveTrabajos({
          creates: state.trabajos.creates.map((c) => c.data),
          updates: Object.entries(state.trabajos.updates).map(([id, u]) => ({ id, ...u.modified })),
        });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'trabajos', type: 'save', items: res.failed });
        }
      }

      if (state.pendingDeletes.productos.length > 0) {
        const res = await api.batchDeleteProductos({ ids: state.pendingDeletes.productos });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'productos', type: 'delete', items: res.failed });
        }
      }

      if (state.pendingDeletes.trabajos.length > 0) {
        const res = await api.batchDeleteTrabajos({ ids: state.pendingDeletes.trabajos });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'trabajos', type: 'delete', items: res.failed });
        }
      }

      if (errors.length === 0) {
        dispatch({ type: 'CLEAR_ALL' });
        triggerVercelBuild();
        setResult({ success: true });
        setTimeout(() => { navigate('/dashboard'); }, 1200);
      } else {
        setResult({ success: false, errors });
        setSaving(false);
      }
    } catch (err) {
      setResult({ success: false, errors: [{ message: err.message }] });
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-lg md:rounded-xl rounded-t-xl p-6 shadow-xl animate-slide-up md:animate-fade-in">
        {!saving && !result && (
          <>
            <h3 className="text-lg font-bold mb-4">Confirmar cambios</h3>

            {totalChanges === 0 ? (
              <p className="text-slate-500 text-sm mb-6">No hay cambios pendientes para guardar.</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {pCounts.total > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="font-semibold text-sm mb-1">Productos</p>
                      <ul className="text-sm text-slate-600 space-y-0.5">
                        {pCounts.creates > 0 && <li>• {pCounts.creates} nuevo(s)</li>}
                        {pCounts.updates > 0 && <li>• {pCounts.updates} modificación(es)</li>}
                        {pCounts.deletes > 0 && <li className="text-red-600">• {pCounts.deletes} eliminación(es)</li>}
                      </ul>
                    </div>
                  )}
                  {tCounts.total > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="font-semibold text-sm mb-1">Trabajos</p>
                      <ul className="text-sm text-slate-600 space-y-0.5">
                        {tCounts.creates > 0 && <li>• {tCounts.creates} nuevo(s)</li>}
                        {tCounts.updates > 0 && <li>• {tCounts.updates} modificación(es)</li>}
                        {tCounts.deletes > 0 && <li className="text-red-600">• {tCounts.deletes} eliminación(es)</li>}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
                    Cancelar
                  </button>
                  <button
                    ref={confirmRef}
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-blue-500 text-white border-0 rounded-lg text-sm cursor-pointer hover:bg-blue-600"
                  >
                    Confirmar y guardar
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {saving && (
          <div className="py-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-slate-600 text-sm">Guardando cambios...</p>
          </div>
        )}

        {result && !saving && (
          <>
            {result.success ? (
              <div className="py-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-lg font-bold text-green-600 mb-1">Cambios guardados</h3>
                <p className="text-slate-500 text-sm">Recargando página...</p>
              </div>
            ) : (
              <div className="py-4">
                <div className="text-3xl mb-2 text-center">❌</div>
                <h3 className="text-lg font-bold text-red-600 mb-3 text-center">Error al guardar</h3>
                <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700 max-h-40 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <p key={i} className="mb-1">
                      {e.resource && `${e.resource} (${e.type}): `}
                      {e.items ? e.items.map((f) => `ID ${f.id} - ${f.error}`).join(', ') : e.message}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 justify-end mt-4">
                  <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer">
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
