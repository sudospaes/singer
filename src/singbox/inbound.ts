import type { InboundOptions } from "singbox/types/common";

class SingboxInbound {
  constructor(private options: InboundOptions) {
    this.options = options;
  }

  get tag() {
    return this.options.tag;
  }

  toObject() {
    return { ...this.options };
  }

  toJSON() {
    return JSON.stringify(this.options);
  }
}

export default SingboxInbound;
