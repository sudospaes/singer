import parser from "v2ray/proxy-parser";
import type { V2RayProxy, RealityConfig, TLSConfig } from "v2ray/types/common";

import SingboxOutbound from "singbox/outbound";
import { Vless, Vmess, Trojan } from "singbox/protocol";
import { Ws, Http, Grpc, HttpUpgrade } from "singbox/transport";
import Tls from "singbox/tls";
import type { Transport, TlsConfig, TlsOptions, Protocol } from "singbox/types/common";

type ProxyTypes = "vless" | "vmess" | "trojan";

interface ProxyConfig {
  type: ProxyTypes;
  tag: string;
  clientFactory: (proxy: V2RayProxy) => Protocol;
}

class ProxyAdapter {
  private readonly proxy: V2RayProxy;
  private readonly client: Protocol;
  private readonly transportSettings: Transport;
  private readonly tlsSettings: TlsConfig;
  private readonly outbound: SingboxOutbound;

  constructor(type: ProxyTypes, url: string) {
    const config = ProxyAdapter.PROXY_CONFIGS[type];
    this.proxy = ProxyAdapter.PROXY_FACTORIES[type](url);

    this.client = config.clientFactory(this.proxy);
    this.transportSettings = this.createTransportSettings();
    this.tlsSettings = this.createTlsSettings();

    this.outbound = new SingboxOutbound(
      {
        type: config.type,
        tag: config.tag,
        server: this.proxy.address,
        server_port: this.proxy.port,
        transport: this.transportSettings,
        tls: this.tlsSettings,
      },
      this.client
    );
  }

  public export() {
    return this.outbound;
  }

  private static readonly PROXY_FACTORIES: Record<ProxyTypes, (url: string) => V2RayProxy> = {
    vless: (url) => new parser.Vless(url).init().export(),
    vmess: (url) => new parser.Vmess(url).init().export(),
    trojan: (url) => new parser.Trojan(url).init().export(),
  };

  private static readonly PROXY_CONFIGS: Record<ProxyTypes, ProxyConfig> = {
    vless: {
      type: "vless",
      tag: "vless-out",
      clientFactory: (proxy) => new Vless(proxy.id, proxy.flow),
    },
    vmess: {
      type: "vmess",
      tag: "vmess-out",
      clientFactory: (proxy) => new Vmess(proxy.id, proxy.scy),
    },
    trojan: {
      type: "trojan",
      tag: "trojan-out",
      clientFactory: (proxy) => new Trojan(proxy.id),
    },
  };

  private createTransportSettings(): Transport {
    const { proxy } = this;

    switch (proxy.transportType) {
      case "tcp":
        return proxy.headerType === "http" ? new Http([proxy.host || ""], proxy.path || "").toObject() : undefined;

      case "ws":
        return new Ws(proxy.path || "", {
          headers: { host: proxy.host },
        }).toObject();

      case "grpc":
        return new Grpc(proxy.serviceName || "", {}).toObject();

      case "httpupgrade":
        return new HttpUpgrade(proxy.host || "", proxy.path || "").toObject();

      default:
        return undefined;
    }
  }

  private createTlsSettings(): TlsConfig {
    const { proxy } = this;

    let tlsSettings = undefined;

    if (proxy.tls) {
      tlsSettings = this.configureTls(proxy.tls);
    }

    if (proxy.reality) {
      tlsSettings = this.configureReality(proxy.reality);
    }

    return tlsSettings ? tlsSettings.toObject() : undefined;
  }

  private configureTls(tls: TLSConfig): Tls {
    const tlsOptions: TlsOptions = {};

    tlsOptions.server_name = tls.sni;
    tlsOptions.alpn = tls.alpn;
    tlsOptions.insecure = tls.allowInsecure;

    if (tls.fingerprint) {
      tlsOptions.utls = {
        enabled: true,
        fingerprint: tls.fingerprint,
      };
    }
    return new Tls(tlsOptions);
  }

  private configureReality(reality: RealityConfig): Tls {
    const tlsOptions: TlsOptions = {};

    tlsOptions.server_name = reality.sni;
    tlsOptions.utls = {
      enabled: true,
      fingerprint: reality.fingerprint,
    };
    tlsOptions.reality = {
      enabled: true,
      public_key: reality.publicKey,
      short_id: reality.shortId,
    };

    return new Tls(tlsOptions);
  }
}

export default ProxyAdapter;
