import { useState } from 'react';
import { Image, DollarSign, Star, Hash, FileText } from 'lucide-react';
import { stripMeta } from '../../utils/stripMeta';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ProductForm({ initial, onSave, onCancel }) {
  const cleaned = stripMeta(initial);

  const [form, setForm] = useState({
    name: cleaned?.name || '',
    slug: cleaned?.slug || '',
    category: cleaned?.category || 'tazas',
    price: cleaned?.price ?? '',
    image: cleaned?.image || '',
    gallery: cleaned?.gallery?.join('\n') || '',
    description: cleaned?.description || '',
    general_available: cleaned?.audience?.general?.available ?? true,
    general_customizable: cleaned?.audience?.general?.customizable ?? true,
    business_available: cleaned?.audience?.business?.available ?? false,
    business_customizable: cleaned?.audience?.business?.customizable ?? false,
    tags: cleaned?.tags?.join(', ') || '',
    featured: cleaned?.featured ?? false,
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

  const checkClass = 'w-4 h-4';

  return (
    <Modal isOpen onClose={onCancel} title={cleaned ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre *" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Slug" name="slug" value={form.slug} onChange={handleChange} placeholder="auto desde nombre" />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoría</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100">
              {PRODUCT_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <Input label="Precio (Bs)" name="price" type="number" value={form.price} onChange={handleChange} icon={DollarSign} />
        </div>

        <Input label="Imagen URL" name="image" value={form.image} onChange={handleChange} icon={Image} />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Galería (1 URL por línea)</label>
          <textarea name="gallery" value={form.gallery} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100" />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100" />
        </div>

        <Input label="Tags (separados por coma)" name="tags" value={form.tags} onChange={handleChange} icon={Hash} placeholder="ej: regalo, taza, personalizado" />

        <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <legend className="text-sm font-semibold px-1 text-slate-700 dark:text-slate-300">Audiencia General</legend>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" name="general_available" checked={form.general_available} onChange={handleChange} className={checkClass} /> Disponible</label>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" name="general_customizable" checked={form.general_customizable} onChange={handleChange} className={checkClass} /> Personalizable</label>
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <legend className="text-sm font-semibold px-1 text-slate-700 dark:text-slate-300">Audiencia Business</legend>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" name="business_available" checked={form.business_available} onChange={handleChange} className={checkClass} /> Disponible</label>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" name="business_customizable" checked={form.business_customizable} onChange={handleChange} className={checkClass} /> Personalizable</label>
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className={checkClass} /> <Star size={14} className="text-amber-500" /> Destacado</label>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
