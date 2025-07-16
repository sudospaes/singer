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

export function generateTag() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let tag = "";
  for (let i = 0; i < 6; i++) {
    tag += chars[Math.floor(Math.random() * chars.length)];
  }
  return tag;
}

export function rootPath(): string {
  return process.cwd();
}
