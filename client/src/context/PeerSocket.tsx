import React, { createContext, useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';
import { peerPort, peerServerHost } from '../env/host';
import Peer from 'peerjs';
import { setUsername } from '../redux/userSlice';

interface PeerSocket {
  peer?: Peer;
  socket?: Socket;
  connectPeer: () => void;
  connectSocket: (token: string) => void;
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
  const [socketState, setSocketState] = useState(false);
  const [peerState, setPeerState] = useState(false);

  const connectSocket = (token: string) => {
    if (process.env.NODE_ENV === 'production') {
      setSocket(
        io(`wss://${host}:${socketPort}/`, {
          auth: {
            token,
          },
        })
      );
    } else {
      setSocket(
        io(`ws://${host}:${socketPort}/`, {
          auth: {
            token,
          },
        })
      );
    }
  };

  const connectPeer = useCallback(() => {
    console.log('connect peer');
    let secure = false;
    if (process.env.NODE_ENV === 'production') {
      secure = true;
    }

    const newPeer = new Peer({
      config: {
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
          {
            urls: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo',
          },
        ],
        sdpSemantics: 'unified-plan',
      },
      port: peerPort,
      host: peerServerHost,
      path: '/',
      debug: 3,
      secure,
    });
    setPeer(newPeer);
  }, [setPeer]);

  const onPeerOpen = useCallback(
    (peer_id: string) => {
      console.log('peerid:', peer_id);
      setPeerState(true);
      socket?.emit('peerId', { peer_id });
    },
    [socket]
  );

  const onPeerDisconnect = useCallback(() => {
    setPeerState(false);
  }, [peer]);

  const onConnection = useCallback(() => {
    connectPeer();
    setSocketState(true);
  }, [connectPeer]);

  const onDisconnection = useCallback(() => {
    setSocketState(false);
    setSocket(undefined);
  }, []);

  useEffect(() => {
    socket?.on('connect', onConnection);
    socket?.on('disconnect', onDisconnection);
    return () => {
      socket?.off('connect', onConnection);
      socket?.off('disconnect', onDisconnection);
    };
  }, [socket, onConnection, onDisconnection]);

  useEffect(() => {
    peer?.on('open', onPeerOpen);
    peer?.on('disconnected', onPeerDisconnect);
    return () => {
      peer?.off('open', onPeerOpen);
      peer?.off('disconnected', onPeerDisconnect);
    };
  }, [peer, onPeerOpen]);

  return (
    <PeerSocketContext.Provider
      value={{ peer, socket, connectPeer, connectSocket }}
    >
      {children}
    </PeerSocketContext.Provider>
  );
};

export default PeerSocketProvider;

export { PeerSocketContext };
function dispatch(arg0: { payload: string; type: string }) {
  throw new Error('Function not implemented.');
}
