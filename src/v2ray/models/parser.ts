import type { V2RayProxy, QueryParams, TLSConfig, RealityConfig, ParsedUrlResult } from "v2ray/types/common";

import { removeUndefinedEntries } from "utils/utils";

abstract class V2RayParser {
  protected declare proxy: V2RayProxy;
  protected url: string;
  protected queryParams: QueryParams;

  constructor(url: string) {
    this.url = url;
    this.queryParams = {};
  }

  abstract init(): this;

  public export() {
    const result = removeUndefinedEntries(this.proxy);
    return result as V2RayProxy;
  }

  protected parseUrl(): ParsedUrlResult {
    const match = this.url.match(/^.+:\/\/(?<id>[^@]+)@(?<address>[^:]+):(?<port>\d+)\?(?<query>[^#]+)/);
    if (!match?.groups) {
      throw new Error("Invalid URL format: regex match failed");
    }

    const { address, port, id, query } = match.groups;

    // Validate required fields
    if (!address || !port || !id || !query) {
      throw new Error("Invalid URL format: missing required components");
    }

    // Parse query parameters once
    const params = new URLSearchParams(query);
    for (const [key, value] of params) {
      (this.queryParams as any)[key] = value;
    }

    return { address, port: Number(port), id, query };
  }

  protected parseTransport(): void {
    const proxy = this.proxy;
    const { type, headerType, host, path, serviceName } = this.queryParams;

    switch (type) {
      case "tcp":
        proxy.transportType = "tcp";
        if (headerType === "http") {
          proxy.headerType = "http";
          proxy.host = host;
          proxy.path = path;
        }
        break;
      case "ws":
        proxy.transportType = "ws";
        proxy.host = host;
        proxy.path = path;
        break;
      case "httpupgrade":
        proxy.transportType = "httpupgrade";
        proxy.host = host;
        proxy.path = path;
        break;
      case "grpc":
        proxy.transportType = "grpc";
        proxy.serviceName = serviceName;
        break;
    }
  }

  protected parseTLS(): void {
    const proxy = this.proxy;
    const { security, sni, fp, alpn, allowInsecure, pbk, sid } = this.queryParams;

    switch (security) {
      case "tls":
        const tlsConfig: TLSConfig = {
          sni,
          fingerprint: fp,
          alpn: alpn?.split(","),
          allowInsecure: allowInsecure === "true",
        };
        proxy.tls = tlsConfig;
        break;
      case "reality":
        if (!sni || !fp || !pbk) {
          throw new Error("Invalid reality config: missing required fields (sni, fp, pbk)");
        }
        const realityConfig: RealityConfig = {
          sni,
          fingerprint: fp,
          publicKey: pbk,
          shortId: sid ? sid : "",
        };
        proxy.reality = realityConfig;
        break;
    }
  }
}

export default V2RayParser;
