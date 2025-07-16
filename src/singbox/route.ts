import type { RouteOptions } from "./types/common";

class SingboxRoute {
  constructor(private options: RouteOptions) {}

  toObject() {
    return { ...this.options };
  }

  toJSON() {
    return JSON.stringify({
      ...this.options,
    });
  }
}

export default SingboxRoute;
