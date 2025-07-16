import type { Protocol, OutboundOptions } from "singbox/types/common";

class SingboxOutbound {
  constructor(private options: OutboundOptions, private client?: Protocol) {
    this.options = options;
    this.client = client;
  }

  get tag() {
    return this.options.tag;
  }

  toObject() {
    return {
      ...this.options,
      ...this.client,
    };
  }

  toJSON() {
    return JSON.stringify({
      ...this.options,
      ...this.client,
    });
  }
}

export default SingboxOutbound;
