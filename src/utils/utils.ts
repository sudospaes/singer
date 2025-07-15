import type { QueryParams, TransportType, SecurityType } from "v2ray/types/common";

export function parseVmessUrl(url: string): string {
  const base64 = url.slice(8).trim();
  if (!base64) {
    throw new Error("Invalid VMess URL: empty base64 content");
  }

  let decoded: string;
  try {
    decoded = Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    throw new Error("Invalid base64 encoding");
  }

  let config: any;
  try {
    config = JSON.parse(decoded);
  } catch {
    throw new Error("Invalid JSON in vmess base64");
  }

  const { id, add, port, net, path, host, tls, sni, type, fp, alpn, scy, allowInsecure } = config;

  // Validate required fields
  if (!id || !add || !port) {
    throw new Error("Invalid VMess config: missing required fields (uuid, address, port)");
  }

  const query = new URLSearchParams();
  const queryMap: Partial<QueryParams> = {
    type: net as TransportType,
    serviceName: net === "grpc" ? path : undefined,
    path: net !== "grpc" ? path : undefined,
    host,
    security: tls as SecurityType,
    sni,
    fp,
    alpn,
    allowInsecure,
    scy,
    headerType: type === "http" ? "http" : undefined,
  };

  // Only add non-undefined values to query
  Object.entries(queryMap).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  return `vmess://${id}@${add}:${port}?${query.toString()}`;
}

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
