import { Middleware } from 'redux';
import { startConnecting, connectionEstablished } from './peerSlice';
import { Peer } from 'peerjs';
import { RootState } from './store';
import { peerPort, peerServerHost } from '../env/host';

const peerMiddleware: Middleware<{}, RootState> = (store) => {
  let peer: Peer;
  return (next) => (action) => {
    const isConnectionEstablished =
      peer && store.getState().peerReducer.isConnected;

    if (startConnecting.match(action) && !isConnectionEstablished) {
      let secure = false;
      if (process.env.NODE_ENV === 'production') {
        secure = true;
      }
      try {
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
      } catch (e) {
        throw e;
      }
      store.dispatch(connectionEstablished());
    }
    next(action);
  };
};

export default peerMiddleware;
