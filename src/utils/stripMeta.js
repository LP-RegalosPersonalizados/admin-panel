export function stripMeta(obj) {
  if (!obj) return null;
  const { __pending, __original, __pendingNew, __pendingDelete, ...rest } = obj;
  return rest;
}
