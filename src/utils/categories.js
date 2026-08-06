import { PRODUCT_CATEGORIES } from './constants';

export const FALLBACK_CATEGORIES = PRODUCT_CATEGORIES.map((slug) => ({ slug, name: slug }));

export function getCategoryList(categorias) {
  if (Array.isArray(categorias) && categorias.length > 0) return categorias;
  return FALLBACK_CATEGORIES;
}

export function getCategorySlugs(categorias) {
  return getCategoryList(categorias).map((c) => c.slug);
}

export function getCategoryLabels(categorias) {
  const labels = {};
  getCategoryList(categorias).forEach((c) => {
    labels[c.slug] = c.name || c.slug;
  });
  return labels;
}

export function getCategoryOptions(categorias) {
  return getCategoryList(categorias).map((c) => ({ value: c.slug, label: c.name || c.slug }));
}
