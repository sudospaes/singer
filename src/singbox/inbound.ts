import type { InboundOptions } from "singbox/types/common";

class Inbound {
  constructor(private options: InboundOptions) {
    this.options = options;
  }

  toObject() {
    return { ...this.options };
  }

  toJSON() {
    return JSON.stringify(this.options);
  }
}

export default Inbound;
