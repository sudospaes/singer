export type TransportType = "tcp" | "grpc" | "ws" | "httpupgrade";
export type HeaderType = "http";
export type SecurityType = "tls" | "reality";

export interface TlsConfig {
  sni?: string;
  alpn?: string[];
  fingerprint?: string;
  allowInsecure?: boolean;
}

export interface RealityConfig {
  sni: string;
  fingerprint: string;
  publicKey: string;
  shortId: string;
}

// Helper types for validation
export interface ParsedUrlResult {
  address: string;
  port: number;
  id: string;
  query: string;
}

export interface QueryParams {
  type?: TransportType;
  headerType?: HeaderType;
  host?: string;
  path?: string;
  serviceName?: string;
  security?: SecurityType;
  sni?: string;
  fp?: string;
  alpn?: string;
  allowInsecure?: string;
  pbk?: string;
  sid?: string;
  flow?: string;
  scy?: string;
}

export interface V2RayProxy {
  protocol: "vless" | "vmess" | "trojan";
  address: string;
  port: number;

  id: string;
  flow?: string; // Vless flow
  scy?: string; // Vmess encryption method

  // Transport settings
  transportType?: TransportType;
  headerType?: HeaderType; // Used for TCP-With-Header
  host?: string; // Used for WS/HTTP-UPGRADE/TCP-With-Header
  path?: string; // Used for WS/HTTP-UPGRADE/TCP-With-Header
  serviceName?: string; // Used for GRPC

  // Security settings
  tls?: TlsConfig;
  reality?: RealityConfig;
}
