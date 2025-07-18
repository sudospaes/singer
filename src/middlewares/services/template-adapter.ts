import SingboxInbound from "singbox/inbound";
import SingboxOutbound from "singbox/outbound";
import SingboxRoute from "singbox/route";
import SingboxSchema from "singbox/schema";

import type { InboundOptions, OutboundOptions, RouteOptions } from "singbox/types/common";
import type ProxyAdapter from "middlewares/services/proxy-adapter";

class TemplateAdapter {
  private readonly tunInbound: SingboxInbound;
  private readonly mixedInbound: SingboxInbound;

  private readonly selectorOutbound: SingboxOutbound;
  private readonly urltestOutbound: SingboxOutbound;
  private readonly directOutbound: SingboxOutbound;
  private readonly proxyOutbound: SingboxOutbound;

  private readonly route: SingboxRoute;

  constructor(proxy: ProxyAdapter, direct: string) {
    this.proxyOutbound = proxy.export();

    this.tunInbound = this.createTunInbound();
    this.mixedInbound = this.createMixedInbound();

    this.selectorOutbound = this.createSelectorOutbound();
    this.urltestOutbound = this.createUrltestOutbound();
    this.directOutbound = this.createDirectOutbound();

    this.route = this.createRoute(direct);
  }

  public export() {
    const singboxSchema = new SingboxSchema(
      [this.tunInbound, this.mixedInbound],
      [this.selectorOutbound, this.urltestOutbound, this.directOutbound, this.proxyOutbound],
      this.route
    );

    return singboxSchema.toJSON();
  }

  private createTunInbound() {
    const inbound: InboundOptions = {
      type: "tun",
      address: ["172.19.0.1/30", "fdfe:dcba:9876::1/126"],
      auto_route: true,
      endpoint_independent_nat: false,
      mtu: 9000,
      platform: {
        http_proxy: {
          enabled: true,
          server: "127.0.0.1",
          server_port: 2080,
        },
      },
      stack: "system",
      strict_route: false,
    };
    return new SingboxInbound(inbound);
  }

  private createMixedInbound() {
    const inbound: InboundOptions = {
      listen: "127.0.0.1",
      listen_port: 2080,
      type: "mixed",
      users: [],
    };
    return new SingboxInbound(inbound);
  }

  private createSelectorOutbound() {
    const outbound: OutboundOptions = {
      type: "selector",
      tag: "proxy",
      outbounds: ["auto", "direct", this.proxyOutbound.tag!],
    };
    return new SingboxOutbound(outbound);
  }

  private createUrltestOutbound() {
    const outbound: OutboundOptions = {
      type: "urltest",
      tag: "auto",
      outbounds: [this.proxyOutbound.tag!],
      url: "https://www.gstatic.com/generate_204",
      tolerance: 50,
    };
    return new SingboxOutbound(outbound);
  }

  private createDirectOutbound() {
    const outbound: OutboundOptions = {
      type: "direct",
      tag: "direct",
    };
    return new SingboxOutbound(outbound);
  }

  private createRoute(str: string) {
    const route: RouteOptions = {
      auto_detect_interface: true,
      final: "proxy",
      rules: [
        {
          action: "sniff",
        },
        {
          ip_is_private: true,
          outbound: "direct",
        },
      ],
      rule_set: [],
    };

    switch (str) {
      case "ir-direct":
        route.rule_set?.push(
          {
            download_detour: "proxy",
            tag: "geoip-ir",
            type: "remote",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs",
          },
          {
            download_detour: "proxy",
            tag: "geosite-ir",
            type: "remote",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
          }
        );
        route.rules?.push({
          action: "route",
          rule_set: ["geosite-ir", "geoip-ir"],
          outbound: "direct",
        });
        break;

      case "cn-direct":
        route.rule_set?.push(
          {
            download_detour: "proxy",
            tag: "geosite-cn",
            type: "remote",
            format: "binary",
            url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/cn.srs",
          },
          {
            download_detour: "proxy",
            tag: "geoip-cn",
            type: "remote",
            format: "binary",
            url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/cn.srs",
          }
        );
        route.rules?.push({
          action: "route",
          rule_set: ["geosite-cn", "geoip-cn"],
          outbound: "direct",
        });
        break;
    }

    return new SingboxRoute(route);
  }
}

export default TemplateAdapter;
