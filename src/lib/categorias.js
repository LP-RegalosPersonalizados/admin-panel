import { request, invalidate } from './client';

export function getCategorias() {
  return request('/api/categorias');
}

export function invalidateCategorias() {
  invalidate('/api/categorias');
}
