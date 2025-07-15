export type V2RayProxy = VlessConfig | VmessConfig | TrojanConfig;
export type TransportType = "tcp" | "grpc" | "ws" | "httpupgrade";
export type HeaderType = "http";
export type SecurityType = "tls" | "reality";

export interface TLSConfig {
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

interface V2RayConfig {
  protocol: "vless" | "vmess" | "trojan";
  address: string;
  port: number;

  // Transport settings
  transportType?: TransportType;
  headerType?: HeaderType; // Used for TCP-With-Header
  host?: string; // Used for WS/HTTP-UPGRADE/TCP-With-Header
  path?: string; // Used for WS/HTTP-UPGRADE/TCP-With-Header
  serviceName?: string; // Used for GRPC

  // Security settings
  tls?: TLSConfig;
  reality?: RealityConfig;
}

interface VlessConfig extends V2RayConfig {
  protocol: "vless";
  uuid: string;
  flow?: string;
}

interface VmessConfig extends V2RayConfig {
  protocol: "vmess";
  uuid: string;
  security?: string; // encryption method (auto, aes-128-gcm, chacha20-poly1305, none)
}

interface TrojanConfig extends V2RayConfig {
  protocol: "trojan";
  password: string;
}
