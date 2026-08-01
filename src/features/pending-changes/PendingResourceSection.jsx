import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import PendingItem from './PendingItem';

export default function PendingResourceSection({ title, creates, updates, deletes, resource, dispatch, getName }) {
  const updatesList = Object.entries(updates);

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1.5">
        {creates.map((c) => (
          <PendingItem
            key={c.tempId}
            icon={PlusCircle}
            iconClass="text-blue-500"
            label={getName(c.data)}
            sublabel="Nuevo"
            onDiscard={() => dispatch({ type: 'DISCARD_CREATE', resource, tempId: c.tempId })}
          />
        ))}
        {updatesList.map(([id, u]) => (
          <PendingItem
            key={id}
            icon={Edit3}
            iconClass="text-amber-500"
            label={getName(u.modified)}
            sublabel="Modificado"
            onDiscard={() => dispatch({ type: 'DISCARD_UPDATE', resource, id })}
          />
        ))}
        {deletes.map((id) => (
          <PendingItem
            key={id}
            icon={Trash2}
            iconClass="text-red-500"
            label={`ID: ${id}`}
            sublabel="Eliminación"
            sublabelClass="text-red-500 dark:text-red-400"
            onDiscard={() => dispatch({ type: 'UNMARK_DELETE', resource, id })}
          />
        ))}
      </div>
    </div>
  );
}
