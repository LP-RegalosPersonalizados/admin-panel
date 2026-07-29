import { request, invalidate } from './client';

export function getProductos() {
  return request('/api/productos');
}

export function getProducto(id) {
  invalidate('/api/productos');
  return request(`/api/productos/${id}`);
}

export function createProducto(data) {
  invalidate('/api/productos');
  return request('/api/productos', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProducto(id, data) {
  invalidate('/api/productos');
  return request(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProducto(id) {
  invalidate('/api/productos');
  return request(`/api/productos/${id}`, { method: 'DELETE' });
}

export function batchSave(payload) {
  invalidate('/api/productos');
  return request('/api/productos/batch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function batchDelete(payload) {
  invalidate('/api/productos');
  return request('/api/productos/batch/delete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
