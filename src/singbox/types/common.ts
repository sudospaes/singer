import { Http, HttpUpgrade, Grpc, Ws } from "singbox/transport";
import { Vless, Vmess, Trojan } from "singbox/protocol";

export type InboundTypes = "mixed" | "tun";

export type OutboundTypes = "direct" | "vmess" | "trojan" | "vless" | "selector" | "urltest";

export type Transport =
  | ReturnType<Http["toObject"]>
  | ReturnType<HttpUpgrade["toObject"]>
  | ReturnType<Grpc["toObject"]>
  | ReturnType<Ws["toObject"]>
  | undefined;

export type Protocol = Vless | Vmess | Trojan;

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
  platform?: {
    http_proxy: {
      enabled: boolean;
      server: string;
      server_port: number;
    };
  };
  stack?: string;
  strict_route?: boolean;
  listen?: string;
  listen_port?: number;
  users?: { username: string; password: string }[];
  sniff?: boolean;
  sniff_override_destination?: boolean;
  interface_name?: string;
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
  rule_set?: {
    download_detour?: string;
    format: string;
    tag: string;
    type: string;
    update_interval?: string;
    url: string;
  }[];
  rules?: {
    action?: string;
    clash_mode?: string;
    outbound?: string;
    rule_set?: string[];
    ip_is_private?: boolean;
  }[];
}
