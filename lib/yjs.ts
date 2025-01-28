import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface YjsState {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
}

const ydocs: { [room: string]: YjsState } = {};

const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234';

export const getYDoc = (room: string) => {
  if (!ydocs[room]) {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(websocketURL, room, ydoc);
    ydocs[room] = { ydoc, provider };
  }
  return ydocs[room].ydoc;
};

export const getProvider = (room: string) => {
  if (!ydocs[room]) {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(websocketURL, room, ydoc);
    ydocs[room] = { ydoc, provider };
  }
  return ydocs[room].provider;
};