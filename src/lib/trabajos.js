import { request, invalidate } from './client';

export function getTrabajos() {
  return request('/api/trabajos');
}

export function getTrabajo(id) {
  invalidate('/api/trabajos');
  return request(`/api/trabajos/${id}`);
}

export function createTrabajo(data) {
  invalidate('/api/trabajos');
  return request('/api/trabajos', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTrabajo(id, data) {
  invalidate('/api/trabajos');
  return request(`/api/trabajos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteTrabajo(id) {
  invalidate('/api/trabajos');
  return request(`/api/trabajos/${id}`, { method: 'DELETE' });
}

export function batchSave(payload) {
  invalidate('/api/trabajos');
  return request('/api/trabajos/batch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function batchDelete(payload) {
  invalidate('/api/trabajos');
  return request('/api/trabajos/batch/delete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
