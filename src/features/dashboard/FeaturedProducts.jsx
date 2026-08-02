import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Inbox, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from './format';

const AUTOPLAY_MS = 4000;

export default function FeaturedProducts({ items = [], total = 0 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgError, setImgError] = useState(false);
  const count = items.length;
  const hasMultiple = count > 1;
  const timerRef = useRef(null);

  useEffect(() => {
    setIndex(0);
    setImgError(false);
  }, [items]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
    setImgError(false);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
    setImgError(false);
  }, [count]);

  useEffect(() => {
    if (!hasMultiple || paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [hasMultiple, paused, index, next]);

  return (
    <Card
      title="Productos Destacados"
      icon={Star}
      iconClassName="text-amber-500 dark:text-amber-400"
      action={count > 0 ? <Badge variant="warning">{count} de {total}</Badge> : null}
      className="h-full"
    >
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
          <Inbox size={32} className="mb-2" />
          <p className="text-sm">Sin productos destacados</p>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-4">
          <div
            className="flex items-center gap-3"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button
              onClick={prev}
              disabled={!hasMultiple}
              aria-label="Anterior destacado"
              className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                {items[index].image && !imgError ? (
                  <img
                    src={items[index].image}
                    alt={items[index].name || 'Producto destacado'}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={24} className="text-slate-300 dark:text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {items[index].name || 'Sin nombre'}
                </p>
                {items[index].category && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 capitalize mb-1">{items[index].category}</p>
                )}
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Bs {formatCurrency(items[index].price)}
                </p>
              </div>
            </div>

            <button
              onClick={next}
              disabled={!hasMultiple}
              aria-label="Siguiente destacado"
              className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {hasMultiple && (
            <div className="flex items-center justify-center gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => { setIndex(i); setImgError(false); }}
                  aria-label={`Ir al destacado ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    i === index ? 'w-5 bg-amber-500 dark:bg-amber-400' : 'w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
