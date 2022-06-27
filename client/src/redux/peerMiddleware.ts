import { Middleware } from 'redux';
import { startConnecting, connectionEstablished, setPeerId } from './peerSlice';
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
      /*peer.on('open', (id) => {
        socket.emit('peerId', id);
      });*/

      /*peer.on('call', (call) => {
        const audioNode = new Audio();
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Call incoming`)) {
          console.log('streamref.current:', streamRef.current);
          call.answer(streamRef.current);

          call.on('stream', (stream) => {
            audioNode.srcObject = stream;
            console.log('receiving stream');
            audioNode.play();
          });

          call.on('close', () => {
            audioNode.remove();
          });
        }*/

      store.dispatch(connectionEstablished());
      store.dispatch(setPeerId(peer.id));
    }
    next(action);
  };
};

export default peerMiddleware;
