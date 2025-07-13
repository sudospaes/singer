import type { RouteOptions } from "./types/common";

class Route {
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

export default Route;
