import BaseProxyParser from "v2ray/base-proxy-parser";

import { parseVmessUrl } from "v2ray/utils";

class Vless extends BaseProxyParser {
  override init(): this {
    const { address, port, id } = this.parseUrl();

    this.proxy = {
      protocol: "vless",
      address,
      port,
      id: id,
      flow: this.queryParams.flow,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

class Trojan extends BaseProxyParser {
  override init(): this {
    const { address, port, id } = this.parseUrl();

    this.proxy = {
      protocol: "trojan",
      address,
      port,
      id,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

class Vmess extends BaseProxyParser {
  constructor(url: string) {
    const parsedUrl = parseVmessUrl(url);
    super(parsedUrl);
  }

  override init(): this {
    const { address, port, id } = this.parseUrl();

    this.proxy = {
      protocol: "vmess",
      address,
      port,
      id,
      scy: this.queryParams.scy,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

export default { Vless, Trojan, Vmess };
