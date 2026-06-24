import { useState } from 'react';

const categories = ['tazas', 'fotos', 'cuadros', 'festivos', 'alcancia', 'llaveros', 'otros'];

export default function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    slug: initial?.slug || '',
    category: initial?.category || 'tazas',
    price: initial?.price ?? '',
    image: initial?.image || '',
    gallery: initial?.gallery?.join('\n') || '',
    description: initial?.description || '',
    general_available: initial?.audience?.general?.available ?? true,
    general_customizable: initial?.audience?.general?.customizable ?? true,
    business_available: initial?.audience?.business?.available ?? false,
    business_customizable: initial?.audience?.business?.customizable ?? false,
    tags: initial?.tags?.join(', ') || '',
    featured: initial?.featured ?? false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: form.price !== '' ? Number(form.price) : undefined,
      gallery: form.gallery ? form.gallery.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      audience: {
        general: { available: form.general_available, customizable: form.general_customizable },
        business: { available: form.business_available, customizable: form.business_customizable },
      },
    };
    onSave(data);
  };

  const labelClass = 'block text-sm font-medium mb-1';
  const inputClass = 'w-full p-2 border border-slate-300 rounded-md text-sm';
  const checkClass = 'w-4 h-4';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-5">{initial ? 'Editar Producto' : 'Nuevo Producto'}</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="auto desde nombre" />
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio (Bs)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Imagen URL</label>
          <input name="image" value={form.image} onChange={handleChange} className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Galería (1 URL por línea)</label>
          <textarea name="gallery" value={form.gallery} onChange={handleChange} rows={3} className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Tags (separados por coma)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="ej: regalo, taza, personalizado" />
        </div>

        <fieldset className="border border-slate-200 rounded-lg p-4 mb-4">
          <legend className="text-sm font-semibold px-1">Audiencia General</legend>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="general_available" checked={form.general_available} onChange={handleChange} className={checkClass} /> Disponible</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="general_customizable" checked={form.general_customizable} onChange={handleChange} className={checkClass} /> Personalizable</label>
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 rounded-lg p-4 mb-4">
          <legend className="text-sm font-semibold px-1">Audiencia Business</legend>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="business_available" checked={form.business_available} onChange={handleChange} className={checkClass} /> Disponible</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="business_customizable" checked={form.business_customizable} onChange={handleChange} className={checkClass} /> Personalizable</label>
          </div>
        </fieldset>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className={checkClass} /> Destacado</label>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-md text-sm cursor-pointer">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white border-0 rounded-md text-sm cursor-pointer">Guardar</button>
        </div>
      </form>
    </div>
  );
}
