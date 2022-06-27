import { createContext, Context } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';
import { peerPort, peerServerHost } from '../env/host';
import Peer from 'peerjs';

interface PeerSocket {
  peer: Peer;
  socket: Socket;
}

interface ISocket extends Socket {
  username?: string;
}
let socket: ISocket;
let secure = false;
let peer: Peer;

if (process.env.NODE_ENV === 'production') {
  secure = true;
  socket = io(`wss://${host}:${socketPort}/`);
} else {
  socket = io(`ws://${host}:${socketPort}/`);
}

peer = new Peer({
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    sdpSemantics: 'unified-plan',
  },
  port: peerPort,
  host: peerServerHost,
  path: '/',
  debug: 1,
  secure: secure,
});

const PeerSocketContext: Context<PeerSocket> = createContext<PeerSocket>({
  socket,
  peer,
});

export { socket, PeerSocketContext, peer };
