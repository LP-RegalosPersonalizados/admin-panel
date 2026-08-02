export const PRICE_BUCKETS = [
  { label: 'Menos de 100', min: 0, max: 100 },
  { label: '100 – 499', min: 100, max: 500 },
  { label: '500 – 999', min: 500, max: 1000 },
  { label: '1000 o más', min: 1000, max: Infinity },
];

function getName(item) {
  return item?.name || item?.title || item?.label || 'Sin nombre';
}

export function getCategoryCount(data) {
  return new Set(data.map((p) => p.category).filter(Boolean)).size;
}

export function getCategoryDist(data, categories) {
  if (!data.length || !categories?.length) return [];
  return categories
    .map((cat) => ({ name: cat, count: data.filter((p) => p.category === cat).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function getFeaturedStats(data) {
  return {
    featured: data.filter((p) => p.featured).length,
    notFeatured: data.length - data.filter((p) => p.featured).length,
  };
}

export function getPriceStats(data) {
  const prices = data
    .map((p) => Number(p.price))
    .filter((n) => !Number.isNaN(n) && n > 0);
  if (!prices.length) return null;
  return {
    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    max: Math.max(...prices),
    min: Math.min(...prices),
  };
}

export function getAudienceStats(data) {
  return {
    general: data.filter((p) => p.audience?.general?.available).length,
    business: data.filter((p) => p.audience?.business?.available).length,
  };
}

export function getTotalQuantity(data) {
  return data.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
}

export function getPriceHistogram(data, buckets = PRICE_BUCKETS) {
  const prices = data.map((p) => Number(p.price)).filter((n) => !Number.isNaN(n) && n >= 0);
  if (!prices.length) return [];
  return buckets.map((bucket) => ({
    label: bucket.label,
    count: prices.filter((p) => p >= bucket.min && p < bucket.max).length,
  }));
}

export function getTopExpensive(data, n = 5) {
  return data
    .map((p) => ({ ...p, _price: Number(p.price) }))
    .filter((p) => !Number.isNaN(p._price) && p._price > 0)
    .sort((a, b) => b._price - a._price)
    .slice(0, n);
}

export function getRecentAdded(data, n = 5) {
  return data
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, n);
}

export function buildActivityFeed(state, history, { pendingLimit = 10, historyLimit = 20, max = 30 } = {}) {
  const pending = [];
  state.productos.creates.forEach((c) =>
    pending.push({ id: c.tempId, type: 'create', resource: 'producto', label: getName(c.data), date: new Date().toISOString() })
  );
  Object.entries(state.productos.updates).forEach(([id, u]) =>
    pending.push({ id, type: 'update', resource: 'producto', label: getName(u.modified), date: new Date().toISOString() })
  );
  state.pendingDeletes.productos.forEach((id) =>
    pending.push({ id, type: 'delete', resource: 'producto', label: `ID: ${id}`, date: new Date().toISOString() })
  );
  state.trabajos.creates.forEach((c) =>
    pending.push({ id: c.tempId, type: 'create', resource: 'trabajo', label: getName(c.data), date: new Date().toISOString() })
  );
  Object.entries(state.trabajos.updates).forEach(([id, u]) =>
    pending.push({ id, type: 'update', resource: 'trabajo', label: getName(u.modified), date: new Date().toISOString() })
  );
  state.pendingDeletes.trabajos.forEach((id) =>
    pending.push({ id, type: 'delete', resource: 'trabajo', label: `ID: ${id}`, date: new Date().toISOString() })
  );
  return [...pending.slice(0, pendingLimit), ...(history || []).slice(0, historyLimit)].slice(0, max);
}
