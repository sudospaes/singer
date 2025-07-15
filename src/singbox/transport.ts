class Http {
  private readonly type = "http";
  private host: string[];
  private path: string;
  private method: string;
  private headers: {};

  constructor(host: string[], path: string, method?: string, headers?: {}) {
    this.host = host;
    this.path = path;
    this.method = method ? method : "";
    this.headers = headers ? headers : {};
  }

  toObject() {
    return {
      type: this.type,
      host: this.host,
      path: this.path,
      method: this.method,
      headers: this.headers,
    };
  }
}

class Ws {
  private readonly type = "ws";
  private path: string;
  private headers: {};
  private maxEarlyData: number;
  private earlyDataHeaderName: string;

  constructor(path: string, options: { headers?: {}; maxEarlyData?: number; earlyDataHeaderName?: string }) {
    this.path = path;
    this.headers = options.headers ? options.headers : {};
    this.maxEarlyData = options.maxEarlyData ? options.maxEarlyData : 0;
    this.earlyDataHeaderName = options.earlyDataHeaderName ? options.earlyDataHeaderName : "";
  }

  toObject() {
    return {
      type: this.type,
      path: this.path,
      headers: this.headers,
      max_early_data: this.maxEarlyData,
      early_data_header_name: this.earlyDataHeaderName,
    };
  }
}

class Grpc {
  private readonly type = "grpc";
  private serviceName: string;
  private idleTimeout: string;
  private pingTimeout: string;
  private permitWithoutStream: boolean;

  constructor(
    serviceName: string,
    option: { idleTimeout?: string; pingTimeout?: string; permitWithoutStream?: boolean }
  ) {
    this.serviceName = serviceName;
    this.idleTimeout = option.idleTimeout ? option.idleTimeout : "15s";
    this.pingTimeout = option.pingTimeout ? option.pingTimeout : "15s";
    this.permitWithoutStream = option.permitWithoutStream ? option.permitWithoutStream : false;
  }

  toObject() {
    return {
      type: this.type,
      service_name: this.serviceName,
      idle_timeout: this.idleTimeout,
      ping_timeout: this.pingTimeout,
      permit_without_stream: this.permitWithoutStream,
    };
  }
}

class HttpUpgrade {
  private readonly type = "httpupgrade";
  private host: string;
  private path: string;
  private headers: {};

  constructor(host: string, path: string, headers?: {}) {
    this.host = host;
    this.path = path;
    this.headers = headers ? headers : {};
  }

  toObject() {
    return {
      type: this.type,
      host: this.host,
      path: this.path,
      headers: this.headers,
    };
  }
}

export default {
  Http,
  Ws,
  Grpc,
  HttpUpgrade,
};
