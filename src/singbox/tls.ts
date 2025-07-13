import type { TlsOptions } from "singbox/types/common";

class Tls {
  constructor(private options: TlsOptions = {}) {}

  toObject() {
    return {
      enable: true,
      ...this.options,
    };
  }
}

export default Tls;
