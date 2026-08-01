import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePendingChanges } from '../../context/PendingChangesContext';
import { batchSave as batchSaveProductos, batchDelete as batchDeleteProductos } from '../../lib/productos';
import { batchSave as batchSaveTrabajos, batchDelete as batchDeleteTrabajos } from '../../lib/trabajos';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function BatchSaveModal({ isOpen, onClose }) {
  const { state, getResourceCounts, dispatch } = usePendingChanges();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const pCounts = getResourceCounts('productos');
  const tCounts = getResourceCounts('trabajos');
  const totalChanges = pCounts.total + tCounts.total;

  const DEPLOY_HOOK = import.meta.env.PUBLIC_VERCEL_DEPLOY_HOOK || '';

  useEffect(() => {
    if (isOpen) {
      setSaving(false);
      setResult(null);
    }
  }, [isOpen]);

  async function triggerVercelBuild() {
    try { await fetch(DEPLOY_HOOK, { method: 'POST' }); } catch {}
  }

  async function handleConfirm() {
    setSaving(true);
    setResult(null);
    const errors = [];

    try {
      if (state.productos.creates.length > 0 || Object.keys(state.productos.updates).length > 0) {
        const res = await batchSaveProductos({
          creates: state.productos.creates.map((c) => c.data),
          updates: Object.entries(state.productos.updates).map(([id, u]) => ({ id, ...u.modified })),
        });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'productos', type: 'save', items: res.failed });
        }
      }

      if (state.trabajos.creates.length > 0 || Object.keys(state.trabajos.updates).length > 0) {
        const res = await batchSaveTrabajos({
          creates: state.trabajos.creates.map((c) => c.data),
          updates: Object.entries(state.trabajos.updates).map(([id, u]) => ({ id, ...u.modified })),
        });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'trabajos', type: 'save', items: res.failed });
        }
      }

      if (state.pendingDeletes.productos.length > 0) {
        const res = await batchDeleteProductos({ ids: state.pendingDeletes.productos });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'productos', type: 'delete', items: res.failed });
        }
      }

      if (state.pendingDeletes.trabajos.length > 0) {
        const res = await batchDeleteTrabajos({ ids: state.pendingDeletes.trabajos });
        if (res.failed && res.failed.length > 0) {
          errors.push({ resource: 'trabajos', type: 'delete', items: res.failed });
        }
      }

      if (errors.length === 0) {
        dispatch({ type: 'CLEAR_ALL' });
        if (DEPLOY_HOOK) triggerVercelBuild();
        setResult({ success: true });
        setTimeout(() => { navigate('/dashboard', { replace: true }); }, 1200);
      } else {
        setResult({ success: false, errors });
        setSaving(false);
      }
    } catch (err) {
      setResult({ success: false, errors: [{ message: err.message }] });
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar cambios" size="md">
      {!saving && !result && (
        <>
          {totalChanges === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No hay cambios pendientes para guardar.</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {pCounts.total > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1 text-slate-700 dark:text-slate-200">Productos</p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-0.5">
                      {pCounts.creates > 0 && <li>• {pCounts.creates} nuevo(s)</li>}
                      {pCounts.updates > 0 && <li>• {pCounts.updates} modificación(es)</li>}
                      {pCounts.deletes > 0 && <li className="text-red-600 dark:text-red-400">• {pCounts.deletes} eliminación(es)</li>}
                    </ul>
                  </div>
                )}
                {tCounts.total > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1 text-slate-700 dark:text-slate-200">Trabajos</p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-0.5">
                      {tCounts.creates > 0 && <li>• {tCounts.creates} nuevo(s)</li>}
                      {tCounts.updates > 0 && <li>• {tCounts.updates} modificación(es)</li>}
                      {tCounts.deletes > 0 && <li className="text-red-600 dark:text-red-400">• {tCounts.deletes} eliminación(es)</li>}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleConfirm}>Confirmar y guardar</Button>
              </div>
            </>
          )}
        </>
      )}

      {saving && (
        <div className="py-8 text-center">
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Guardando cambios...</p>
        </div>
      )}

      {result && !saving && (
        <>
          {result.success ? (
            <div className="py-6 text-center">
              <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">Cambios guardados</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Recargando página...</p>
            </div>
          ) : (
            <div className="py-4">
              <AlertCircle size={40} className="text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3 text-center">Error al guardar</h3>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <p key={i} className="mb-1">
                    {e.resource && `${e.resource} (${e.type}): `}
                    {e.items ? e.items.map((f) => `ID ${f.id} - ${f.error}`).join(', ') : e.message}
                  </p>
                ))}
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="ghost" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
