import { isCached, getCached, setCached, invalidate } from './cache';

export { invalidate };

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

function getToken() { return localStorage.getItem('token'); }

export async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const isRead = !options.method || options.method === 'GET';

  if (isRead && isCached(endpoint)) {
    return getCached(endpoint);
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
    setCached(endpoint, data);
  }
  return data;
}
