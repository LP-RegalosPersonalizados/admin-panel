const STORAGE_KEY = 'activityLog';
const MAX_ENTRIES = 100;

export function logActivity(entry) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    log.unshift({
      ...entry,
      id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
    });
    if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* localStorage lleno o deshabilitado */
  }
}

export function getActivityLog(limit = 50) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return log.slice(0, limit);
  } catch {
    return [];
  }
}

export function clearActivityLog() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silencioso */
  }
}
