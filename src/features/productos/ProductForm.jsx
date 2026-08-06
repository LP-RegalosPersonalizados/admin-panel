import { useState, useMemo } from 'react';
import { Image, DollarSign, Star, Hash } from 'lucide-react';
import { stripMeta } from '../../utils/stripMeta';
import { slugify } from '../../utils/slugify';
import { getCategoryOptions } from '../../utils/categories';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NEW_CATEGORY_VALUE = '__new__';

export default function ProductForm({ initial, onSave, onCancel }) {
  const cleaned = stripMeta(initial);
  const { categorias } = useData();
  const [newCategoryMode, setNewCategoryMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const categoryOptions = useMemo(() => {
    const options = getCategoryOptions(categorias);
    const current = form.category;
    if (current && !options.some((o) => o.value === current)) {
      options.unshift({ value: current, label: current });
    }
    return options;
  }, [categorias, form.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === NEW_CATEGORY_VALUE) {
      setNewCategoryMode(true);
      setNewCategoryName('');
    } else {
      setNewCategoryMode(false);
      setForm((prev) => ({ ...prev, category: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let category = form.category;
    if (newCategoryMode) {
      const name = newCategoryName.trim();
      if (!name) return;
      category = slugify(name);
    }
    const data = {
      ...form,
      category,
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
            {newCategoryMode ? (
              <>
                <input
                  name="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nombre de la nueva categoría"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setNewCategoryMode(false); setNewCategoryName(''); }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Usar categoría existente
                </button>
              </>
            ) : (
              <select name="category" value={form.category} onChange={handleCategoryChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100">
                {categoryOptions.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                <option value={NEW_CATEGORY_VALUE}>+ Nueva categoría</option>
              </select>
            )}
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
