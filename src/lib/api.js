const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

function getToken() { return localStorage.getItem('token'); }

const cache = { data: {}, time: {} };
const TTL = 60 * 60 * 1000;

function isCached(key) {
  return cache.data[key] && cache.time[key] && Date.now() - cache.time[key] < TTL;
}

function invalidate(key) {
  delete cache.data[key];
  delete cache.time[key];
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const isRead = !options.method || options.method === 'GET';
  const cacheKey = endpoint;

  if (isRead && isCached(cacheKey)) {
    return cache.data[cacheKey];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }

  const data = await res.json();

  if (isRead) {
    cache.data[cacheKey] = data;
    cache.time[cacheKey] = Date.now();
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getProductos: () => request('/api/productos'),
  getProducto: (id) => {
    invalidate('/api/productos');
    return request(`/api/productos/${id}`);
  },
  createProducto: (data) => {
    invalidate('/api/productos');
    return request('/api/productos', { method: 'POST', body: JSON.stringify(data) });
  },
  updateProducto: (id, data) => {
    invalidate('/api/productos');
    return request(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteProducto: (id) => {
    invalidate('/api/productos');
    return request(`/api/productos/${id}`, { method: 'DELETE' });
  },
  getTrabajos: () => request('/api/trabajos'),
  getTrabajo: (id) => {
    invalidate('/api/trabajos');
    return request(`/api/trabajos/${id}`);
  },
  createTrabajo: (data) => {
    invalidate('/api/trabajos');
    return request('/api/trabajos', { method: 'POST', body: JSON.stringify(data) });
  },
  updateTrabajo: (id, data) => {
    invalidate('/api/trabajos');
    return request(`/api/trabajos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteTrabajo: (id) => {
    invalidate('/api/trabajos');
    return request(`/api/trabajos/${id}`, { method: 'DELETE' });
  },
};
