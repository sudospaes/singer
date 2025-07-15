// Remove Undefined entries from an object
export function removeUndefinedEntries(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  Object.entries(obj).forEach(([key, value]) => {
    const cleaned = removeUndefinedEntries(value);
    if (cleaned !== undefined) {
      result[key] = cleaned;
    }
  });

  return result;
}

export function rootPath(): string {
  return process.cwd();
}
