import { createContext, Context } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';

interface ISocket extends Socket {
  username?: string;
}
let socket: ISocket;
if (process.env.NODE_ENV === 'production') {
  socket = io(`wss://${host}:${socketPort}/`);
} else {
  socket = io(`ws://${host}:${socketPort}/`);
}

const SocketContext: Context<ISocket> = createContext(socket);

export { socket, SocketContext };
