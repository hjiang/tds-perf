export function nullOrUndefined(a) {
  return a === null || typeof a === 'undefined';
}

export function storedOrDefault(a, d) {
  return nullOrUndefined(a) ? d : a;
}
