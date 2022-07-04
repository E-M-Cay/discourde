import React, { createContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';
import { peerPort, peerServerHost } from '../env/host';
import Peer from 'peerjs';

interface PeerSocket {
  peer?: Peer;
  socket?: Socket;
  connectPeer: () => void;
  connectSocket: () => void;
}

const PeerSocketContext = createContext<PeerSocket>({
  connectPeer: () => {
    throw new Error('connectPeer not correctly overriden');
  },
  connectSocket: () => {
    throw new Error('connectSocket not correctly overriden');
  },
});

interface Props {
  children: React.ReactNode;
}

const PeerSocketProvider: React.FunctionComponent<Props> = ({ children }) => {
  interface ISocket extends Socket {
    username?: string;
  }

  const [socket, setSocket] = useState<ISocket>();
  const [peer, setPeer] = useState<Peer>();

  const connectSocket = () => {
    socket?.close();
    if (process.env.NODE_ENV === 'production') {
      setSocket(io(`wss://${host}:${socketPort}/`));
    } else {
      setSocket(io(`ws://${host}:${socketPort}/`));
    }
  };

  const connectPeer = () => {
    let secure = false;
    if (process.env.NODE_ENV === 'production') {
      secure = true;
    }
    peer?.destroy();
    console.log('peer connecting');

    const newPeer = new Peer({
      config: {
        iceServers: [
          { url: 'stun:stun.l.google.com:19302' },
          {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo',
          },
        ],
        sdpSemantics: 'unified-plan',
      },
      port: peerPort,
      host: peerServerHost,
      path: '/',
      debug: 1,
      secure: secure,
    });
    setPeer(newPeer);
  };

  useEffect(() => {}, [socket]);
  return (
    <PeerSocketContext.Provider
      value={{ peer, socket, connectPeer, connectSocket }}>
      {children}
    </PeerSocketContext.Provider>
  );
};

export default PeerSocketProvider;

export { PeerSocketContext };
