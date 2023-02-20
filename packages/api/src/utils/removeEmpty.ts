const isObject = (v: unknown) => v instanceof Object && !(v instanceof Array) && !(v instanceof Date)

export function removeEmpty<T>(obj: T) {
  return Object.entries(obj)
    .map(([k, v]) => (isObject(v) ? [k, removeEmpty(v)] : [k, v]))
    .filter(([, v]) => v !== null && typeof v !== 'undefined')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}
