class Vless {
  private uuid: string;
  private flow?: string;

  constructor(uuid: string, flow?: string) {
    this.uuid = uuid;
    this.flow = flow;
  }

  toObject() {
    return {
      uuid: this.uuid,
      flow: this.flow,
    };
  }
}

class Vmess {
  private uuid: string;
  private security?: string = "auto";
  private alterId: 0 | 1 = 0;

  constructor(uuid: string, security?: string, alterId?: 0 | 1) {
    this.uuid = uuid;
    if (security) {
      this.security = security;
    }
    if (alterId) {
      this.alterId = alterId;
    }
  }

  toObject() {
    return {
      uuid: this.uuid,
      security: this.security,
      alter_id: this.alterId,
    };
  }
}

class Trojan {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  toObject() {
    return {
      password: this.password,
    };
  }
}

export default {
  Vless,
  Vmess,
  Trojan,
};
