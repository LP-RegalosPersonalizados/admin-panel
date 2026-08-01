import { useState } from 'react';
import { Image, Hash } from 'lucide-react';
import { stripMeta } from '../../utils/stripMeta';
import { TRABAJO_CATEGORIES } from '../../utils/constants';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

  return (
    <Modal isOpen onClose={onCancel} title={cleaned ? 'Editar Trabajo' : 'Nuevo Trabajo'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Título *" name="title" value={form.title} onChange={handleChange} required />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100" />
        </div>

        <Input label="Imagen URL" name="image" value={form.image} onChange={handleChange} icon={Image} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoría</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-100">
              {TRABAJO_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <Input label="Cantidad" name="quantity" value={form.quantity} onChange={handleChange} icon={Hash} />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
