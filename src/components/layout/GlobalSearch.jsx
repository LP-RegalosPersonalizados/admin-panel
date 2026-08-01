import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Briefcase, Inbox } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { usePendingChanges } from '../../context/PendingChangesContext';

const RESOURCE_CONFIG = {
  producto: { route: '/productos', field: 'name', Icon: Package, label: 'Productos' },
  trabajo: { route: '/trabajos', field: 'title', Icon: Briefcase, label: 'Trabajos' },
};

function matches(item, q, type) {
  const fields = [item[RESOURCE_CONFIG[type].field], item.category];
  return fields.some((val) => val != null && String(val).toLowerCase().includes(q));
}

export default function GlobalSearch({ isOpen, onClose }) {
  const { productos, trabajos } = useData();
  const { getEffectiveList } = usePendingChanges();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const activeItemRef = useRef(null);

  const { productoItems, trabajoItems, flat } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { productoItems: [], trabajoItems: [], flat: [] };

    const productoItems = getEffectiveList('productos', productos)
      .filter((item) => matches(item, q, 'producto'))
      .map((item) => ({ ...item, __type: 'producto' }));

    const trabajoItems = getEffectiveList('trabajos', trabajos)
      .filter((item) => matches(item, q, 'trabajo'))
      .map((item) => ({ ...item, __type: 'trabajo' }));

    return { productoItems, trabajoItems, flat: [...productoItems, ...trabajoItems] };
  }, [query, productos, trabajos, getEffectiveList]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const openItem = useCallback((item) => {
    const config = RESOURCE_CONFIG[item.__type];
    const term = item[config.field];
    navigate(`${config.route}?buscar=${encodeURIComponent(term != null ? String(term) : '')}`);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (!flat.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flat.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        openItem(flat[activeIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flat, activeIndex, openItem, onClose]);

  if (!isOpen) return null;

  const sections = [
    { title: 'Productos', items: productoItems, Icon: Package },
    { title: 'Trabajos', items: trabajoItems, Icon: Briefcase },
  ];

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative max-w-xl mx-4 sm:mx-auto mt-16 sm:mt-20 bg-white dark:bg-slate-800 rounded-xl shadow-2xl animate-fade-in overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Buscar productos o trabajos..."
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">ESC</kbd>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
              <Search size={32} className="mb-2" />
              <p className="text-sm">Escribe para buscar productos o trabajos</p>
              <p className="text-xs mt-1">Por nombre, título o categoría</p>
            </div>
          ) : flat.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
              <Inbox size={32} className="mb-2" />
              <p className="text-sm">Sin resultados para “{query.trim()}”</p>
            </div>
          ) : (
            sections.map((section) => {
              if (!section.items.length) return null;
              return (
                <div key={section.title} className="mb-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{section.title}</span>
                    <span className="text-[10px] font-medium">{section.items.length}</span>
                  </div>
                  {section.items.map((item) => {
                    runningIndex += 1;
                    const index = runningIndex;
                    const isActive = index === activeIndex;
                    const Icon = section.Icon;
                    const isPendingNew = item.__pendingNew;
                    const isPending = item.__pending;

                    return (
                      <button
                        key={`${item.__type}-${item.id}`}
                        ref={isActive ? activeItemRef : undefined}
                        onClick={() => openItem(item)}
                        onMouseMove={() => { if (!isActive) setActiveIndex(index); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 dark:bg-slate-700'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {item[RESOURCE_CONFIG[item.__type].field]}
                          </p>
                          {item.category && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{item.category}</p>
                          )}
                        </div>
                        {isPendingNew && (
                          <span className="shrink-0 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">Nuevo</span>
                        )}
                        {isPending && (
                          <span className="shrink-0 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">Pendiente</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        {query.trim() && flat.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
            <span><kbd className="border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5">↑↓</kbd> Navegar</span>
            <span><kbd className="border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5">Enter</kbd> Abrir</span>
            <span><kbd className="border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5">Esc</kbd> Cerrar</span>
          </div>
        )}
      </div>
    </div>
  );
}
