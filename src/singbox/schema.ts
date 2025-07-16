import type SingboxInbound from "singbox/inbound";
import type SingboxOutbound from "singbox/outbound";
import type SingboxRoute from "singbox/route";

class SingboxSchema {
  constructor(private inbounds: SingboxInbound[], private outbounds: SingboxOutbound[], private route: SingboxRoute) {
    this.inbounds = inbounds;
    this.outbounds = outbounds;
    this.route = route;
  }

  toJSON() {
    const objectedInbounds: object[] = [];
    const objectedOutbounds: object[] = [];
    let objectedRoute: object = {};

    this.inbounds.forEach((i) => {
      objectedInbounds.push(i.toObject());
    });

    this.outbounds.forEach((i) => {
      objectedOutbounds.push(i.toObject());
    });

    objectedRoute = this.route.toObject();

    return JSON.stringify({
      inbounds: objectedInbounds,
      outbounds: objectedOutbounds,
      route: objectedRoute,
    });
  }
}

export default SingboxSchema;
