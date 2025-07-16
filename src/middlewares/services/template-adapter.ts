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
      outbounds: ["auto", "direct", this.proxyOutbound.tag!],
      tag: "proxy",
      type: "selector",
    };
    return new SingboxOutbound(outbound);
  }

  private createUrltestOutbound() {
    const outbound: OutboundOptions = {
      interval: "10m",
      outbounds: [this.proxyOutbound.tag!],
      tag: "auto",
      tolerance: 50,
      type: "urltest",
      url: "http://www.gstatic.com/generate_204",
    };
    return new SingboxOutbound(outbound);
  }

  private createDirectOutbound() {
    const outbound: OutboundOptions = {
      tag: "direct",
      type: "direct",
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
          action: "route",
          clash_mode: "Direct",
          outbound: "direct",
        },
      ],
      rule_set: [],
    };

    switch (str) {
      case "ir-direct":
        route.rule_set?.push(
          {
            tag: "iran-geosite-ads",
            type: "remote",
            format: "binary",
            update_interval: "7d",
            url: "https://github.com/bootmortis/sing-geosite/releases/latest/download/geosite-ads.srs",
          },
          {
            tag: "iran-geosite-all",
            type: "remote",
            format: "binary",
            update_interval: "7d",
            url: "https://github.com/bootmortis/sing-geosite/releases/latest/download/geosite-all.srs",
          }
        );
        route.rules?.push(
          {
            action: "sniff",
          },
          {
            action: "route",
            clash_mode: "Direct",
            outbound: "direct",
          },
          {
            action: "route",
            clash_mode: "Global",
            outbound: "proxy",
          },
          {
            rule_set: ["iran-geosite-ads"],
            action: "route",
            outbound: "block",
          },
          {
            rule_set: ["iran-geosite-all"],
            action: "route",
            outbound: "direct",
          }
        );
        break;

      case "ch-direct":
        route.rule_set?.push(
          {
            download_detour: "direct",
            format: "binary",
            tag: "geosite-cn",
            type: "remote",
            url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/cn.srs",
          },
          {
            download_detour: "direct",
            format: "binary",
            tag: "geoip-cn",
            type: "remote",
            url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/cn.srs",
          }
        );
        route.rules?.push(
          {
            action: "sniff",
          },
          {
            action: "route",
            clash_mode: "Direct",
            outbound: "direct",
          },
          {
            action: "route",
            clash_mode: "Global",
            outbound: "proxy",
          },
          {
            action: "route",
            outbound: "direct",
            rule_set: ["geosite-cn", "geoip-cn"],
          }
        );
        break;
    }

    return new SingboxRoute(route);
  }
}

export default TemplateAdapter;
