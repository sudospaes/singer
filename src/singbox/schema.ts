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
    const objectedRoute = this.route.toObject();
    this.inbounds.forEach((i) => {
      objectedInbounds.push(i.toObject());
    });

    this.outbounds.forEach((i) => {
      objectedOutbounds.push(i.toObject());
    });

    return JSON.stringify(
      {
        inbounds: objectedInbounds,
        outbounds: objectedOutbounds,
        route: objectedRoute,
      },
      null,
      2
    );
  }
}

export default SingboxSchema;
