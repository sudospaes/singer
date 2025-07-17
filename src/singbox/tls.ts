import type { TlsOptions } from "singbox/types/common";

class Tls {
  constructor(private options: TlsOptions = {}) {}

  toObject() {
    return {
      enabled: true,
      ...this.options,
    };
  }
}

export default Tls;
