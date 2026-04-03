export function isParameter(text: string): text is `:${string}` {
  return text.slice(0, 1) === ":";
}

export function trimColon(text: string) {
  return isParameter(text) ? text.slice(1) : text;
}

export function removeNullish<T extends Record<string | number | symbol, unknown>>(
  obj: T,
): { [K in keyof T]: NonNullable<T[K]> } {
  const result = {} as { [K in keyof T]: NonNullable<T[K]> };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (element !== null && element !== undefined) {
        result[key] = element;
      }
    }
  }

  return result;
}
