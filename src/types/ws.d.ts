declare module "next/dist/compiled/ws" {
  interface WsOptions {
    headers?: Record<string, string>;
  }

  export default class WebSocket {
    constructor(url: string, options?: WsOptions);
    send(data: string | Buffer): void;
    close(): void;
    on(event: "open", listener: () => void): this;
    on(event: "message", listener: (data: Buffer, isBinary: boolean) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
  }
}

