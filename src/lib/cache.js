const store = { data: {}, time: {} };
const TTL = 60 * 60 * 1000;

export function isCached(key) {
  return store.data[key] && store.time[key] && Date.now() - store.time[key] < TTL;
}

export function invalidate(key) {
  delete store.data[key];
  delete store.time[key];
}

export function getCached(key) {
  return store.data[key];
}

export function setCached(key, data) {
  store.data[key] = data;
  store.time[key] = Date.now();
}
