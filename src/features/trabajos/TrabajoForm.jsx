import { useState } from 'react';
import { stripMeta } from '../../utils/stripMeta';
import { TRABAJO_CATEGORIES } from '../../utils/constants';

export default function TrabajoForm({ initial, onSave, onCancel }) {
  const cleaned = stripMeta(initial);

  const [form, setForm] = useState({
    title: cleaned?.title || '',
    description: cleaned?.description || '',
    image: cleaned?.image || '',
    category: cleaned?.category || 'Particular',
    quantity: cleaned?.quantity || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const labelClass = 'block text-sm font-medium mb-1';
  const inputClass = 'w-full p-2 border border-slate-300 rounded-md text-sm';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-5">{cleaned ? 'Editar Trabajo' : 'Nuevo Trabajo'}</h2>

        <div className="mb-4">
          <label className={labelClass}>Título *</label>
          <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Imagen URL</label>
          <input name="image" value={form.image} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className={labelClass}>Categoría</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {TRABAJO_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Cantidad</label>
            <input name="quantity" value={form.quantity} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-md text-sm cursor-pointer">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer">Guardar</button>
        </div>
      </form>
    </div>
  );
}
