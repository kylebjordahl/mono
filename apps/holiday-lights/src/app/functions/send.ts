import * as WebSocket from 'ws';
import { LedFrame } from '../types';

export function send(ws: WebSocket, frame: LedFrame) {
  const message = new Uint8Array([0, 0, 0, 0, ...frame.flat()]);
  ws.send(message);
  ws.send(message);
}
