import V2RayParser from "v2ray/models/parser";

import { parseVmessUrl } from "utils/utils";

class Vless extends V2RayParser {
  override init(): this {
    const { address, port, id } = this.parseUrl();

    this.proxy = {
      protocol: "vless",
      address,
      port,
      uuid: id,
      flow: this.queryParams.flow,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

class Trojan extends V2RayParser {
  override init(): this {
    const { address, port, id } = this.parseUrl();

    this.proxy = {
      protocol: "trojan",
      address,
      port,
      password: id,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

class Vmess extends V2RayParser {
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
      uuid: id,
      security: this.queryParams.scy,
    };

    this.parseTransport();
    this.parseTLS();
    return this;
  }
}

export { Vless, Trojan, Vmess };
