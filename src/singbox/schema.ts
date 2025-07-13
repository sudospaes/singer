import type Inbound from "singbox/inbound";
import type Outbound from "singbox/outbound";
import type Route from "singbox/route";

class Schema {
  constructor(private inbounds: Inbound[], private outbounds: Outbound[], private route: Route) {
    this.inbounds = inbounds;
    this.outbounds = outbounds;
    this.route = route;
  }

  toJSON() {
    const objectedInbounds: object[] = [];
    const objectedOutbounds: object[] = [];
    let objectedRoute: object;

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

export default Schema;
