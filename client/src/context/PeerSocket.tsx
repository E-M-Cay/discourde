import React, { createContext, useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';
import { peerPort, peerServerHost } from '../env/host';
import Peer from 'peerjs';
import { setIsConnected, setUsername } from '../redux/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

interface PeerSocket {
  peer: Peer;
  socket: Socket;
  isSocketConnected: boolean;
  isPeerConnected: boolean;
}

const socket =
  process.env.NODE_ENV === 'production'
    ? io(`wss://${host}:${socketPort}/`, {
        auth: {
          token: localStorage.getItem('token'),
        },
      })
    : io(`ws://${host}:${socketPort}/`, {
        auth: {
          token: localStorage.getItem('token'),
        },
      });
const secure = process.env.NODE_ENV === 'production';

const peer = new Peer({
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
  debug: 1,
  secure,
});

const PeerSocketContext = createContext<PeerSocket>({
  socket,
  peer,
  isSocketConnected: false,
  isPeerConnected: false,
});

interface Props {
  children: React.ReactNode;
}

interface ISocket extends Socket {
  username?: string;
}

const PeerSocketProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const { isConnected, token } = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();

  const onPeerOpen = useCallback(
    (peer_id: string) => {
      console.log('peerid:', peer_id);
      console.log('peer open');
      socket.emit('peerId', { peer_id });
      setIsPeerConnected(true);
    },
    [socket]
  );

  useEffect(() => {
    console.log('token change');
    // socket.disconnect();
    socket.auth = { token };
    socket.connect();
  }, [token]);

  useEffect(() => {
    if (!isConnected) {
      socket.disconnect();
      console.log('disconnected');
    }
    if (isConnected) {
      socket.connect();
      console.log('connected');
    }
  }, [socket, isConnected]);

  useEffect(() => {
    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', (reason) => {
      setIsSocketConnected(false);
      if (reason === 'io server disconnect') {
        dispatch(setIsConnected(false));
      }
    });
    socket.on('connect_error', (err) => {
      console.log('message');
      if (err.message === 'invalid credentials') {
        socket.disconnect();
      }
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket]);

  useEffect(() => {
    peer.on('open', onPeerOpen);
    peer.on('disconnected', () => setIsPeerConnected(false));
    return () => {
      peer.off('open');
      peer.off('disconnected');
    };
  }, [peer, onPeerOpen]);

  return (
    <PeerSocketContext.Provider
      value={{
        peer,
        socket,
        isPeerConnected,
        isSocketConnected,
      }}
    >
      {children}
    </PeerSocketContext.Provider>
  );
};

export default PeerSocketProvider;

export { PeerSocketContext };
