import parser from "v2ray/proxy-parser";
import type { V2RayProxy, RealityConfig, TLSConfig } from "v2ray/types/common";

import SingboxOutbound from "singbox/outbound";
import { Vless, Vmess, Trojan } from "singbox/protocol";
import { Ws, Http, Grpc, HttpUpgrade } from "singbox/transport";
import type { Transport, TlsOptions, Protocol } from "singbox/types/common";

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
  private readonly tlsSettings: TlsOptions | undefined;
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

  private createTlsSettings(): TlsOptions | undefined {
    const { proxy } = this;

    if (!proxy.tls && !proxy.reality) {
      return undefined;
    }

    const tlsSettings: TlsOptions = {};

    if (proxy.tls) {
      this.configureTls(tlsSettings, proxy.tls);
    }

    if (proxy.reality) {
      this.configureReality(tlsSettings, proxy.reality);
    }

    return tlsSettings;
  }

  private configureTls(tlsSettings: TlsOptions, tls: TLSConfig): void {
    tlsSettings.server_name = tls.sni;
    tlsSettings.alpn = tls.alpn;
    tlsSettings.insecure = tls.allowInsecure;

    if (tls.fingerprint) {
      tlsSettings.utls = {
        enabled: true,
        fingerprint: tls.fingerprint,
      };
    }
  }

  private configureReality(tlsSettings: TlsOptions, reality: RealityConfig): void {
    tlsSettings.server_name = reality.sni;
    tlsSettings.utls = {
      enabled: true,
      fingerprint: reality.fingerprint,
    };
    tlsSettings.reality = {
      enabled: true,
      public_key: reality.publicKey,
      short_id: reality.shortId,
    };
  }
}

export default ProxyAdapter;
