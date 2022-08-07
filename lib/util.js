export function nullOrUndefined(a) {
  return a === null || typeof a === 'undefined';
}

export function storedOrDefault(a, d) {
  return nullOrUndefined(a) ? d : a;
}

export function filterObject(obj, callback) {
  const newObj = Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => callback(val, key)),
  );
  return newObj;
}
