import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

let ydoc: Y.Doc;
let provider: WebsocketProvider;

export const getYDoc = (room: string) => {
  if (!ydoc) {
    ydoc = new Y.Doc();
  }

  if (!provider) {
    provider = new WebsocketProvider("ws://localhost:1234", room, ydoc);
  }

  return ydoc;
};
