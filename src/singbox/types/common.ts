import transport from "singbox/transport";
import protocol from "singbox/protocol";

type InboundTypes = "direct" | "mixed" | "socks" | "http" | "vmess" | "trojan" | "vless" | "tun" | "redirect";
type OutboundTypes =
  | "direct"
  | "block"
  | "socks"
  | "http"
  | "vmess"
  | "trojan"
  | "vless"
  | "dns"
  | "selector"
  | "urltest";

export type Transport = ReturnType<(typeof transport)[keyof typeof transport]["prototype"]["toObject"]>;
export type Protocol = ReturnType<(typeof protocol)[keyof typeof protocol]["prototype"]["toObject"]>;

export interface TlsOptions {
  server_name?: string;
  alpn?: string[];
  insecure?: boolean;
  utls?: {
    enabled: boolean;
    fingerprint: string;
  };
  reality?: {
    enabled: boolean;
    public_key: string;
    short_id: string;
  };
}

export interface InboundOptions {
  type: InboundTypes;
  tag?: string;
  address?: string[];
  auto_route?: boolean;
  endpoint_independent_nat?: boolean;
  mtu?: number;
  platform?: { http_proxy: { enabled: boolean; server: string; server_port: number } };
  stack?: string;
  strict_route?: boolean;
  listen?: string;
  listen_port?: number;
  users?: { username: string; password: string }[];
}

export interface OutboundOptions {
  type: OutboundTypes;
  tag?: string;
  server?: string;
  interval?: string;
  url?: string;
  outbounds?: string[];
  server_port?: number;
  tolerance?: number;
  transport?: Transport;
  tls?: TlsOptions;
}

export interface RouteOptions {
  auto_detect_interface?: boolean;
  final?: string;
  rule_set?: { download_detour: string; format: string; tag: string; type: string; url: string }[];
  rules?: { action: string; clash_mode?: string; outbound?: string; rule_set?: string[] }[];
}
