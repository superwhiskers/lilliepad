/**
 * where every key is a class name and value is a boolean representing if a class should be represented
 */
export const cls = (obj: (boolean | string)[]): string =>
  obj.reduce<string>((res, key) => (key ? `${res} ${key}` : res), '')