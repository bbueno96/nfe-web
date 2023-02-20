export function firstOrSelf(path: string | string[]) {
  return path instanceof Array ? path[0] : path
}
