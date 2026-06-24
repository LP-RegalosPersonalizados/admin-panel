const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

function getToken() { return localStorage.getItem('token'); }

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getProductos: () => request('/api/productos'),
  getProducto: (id) => request(`/api/productos/${id}`),
  createProducto: (data) =>
    request('/api/productos', { method: 'POST', body: JSON.stringify(data) }),
  updateProducto: (id, data) =>
    request(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProducto: (id) =>
    request(`/api/productos/${id}`, { method: 'DELETE' }),
  getTrabajos: () => request('/api/trabajos'),
  getTrabajo: (id) => request(`/api/trabajos/${id}`),
  createTrabajo: (data) =>
    request('/api/trabajos', { method: 'POST', body: JSON.stringify(data) }),
  updateTrabajo: (id, data) =>
    request(`/api/trabajos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrabajo: (id) =>
    request(`/api/trabajos/${id}`, { method: 'DELETE' }),
};
