import type { Protocol, OutboundOptions } from "singbox/types/common";

class Outbound {
  constructor(private options: OutboundOptions, private client?: Protocol) {
    this.options = options;
    this.client = client;
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

export default Outbound;
