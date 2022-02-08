import { TypedEventTarget } from "../../lib/event_target";
import { ClientMessages, ServerMessages } from "./types";

export class IncomingMessage<K extends keyof ServerMessages>
  extends CustomEvent<ServerMessages[K]> {
  constructor(type: K, detail: ServerMessages[K]) {
    super(type, { detail });
  }
}

export class EventClient extends TypedEventTarget<
  { [K in keyof ServerMessages]: IncomingMessage<K> }
> {
  ws?: WebSocket;
  debug = false;

  connect(ws: WebSocket) {
    this.ws = ws;

    ws.onmessage = (e) => {
      if (this.debug) console.log("[>]", e.data);
      const event = JSON.parse(e.data);
      const message = new IncomingMessage(event.type, event);
      this.dispatchEvent(message);
    };
  }

  send<K extends keyof ClientMessages>(
    type: K,
    data: ClientMessages[K],
  ) {
    const json = JSON.stringify({ type, ...data });
    if (!this.ws) return console.warn(`No Websocket Available: [<]`, json);
    if (this.debug) console.log("[<]", json);
    this.ws.send(json);
  }
}
