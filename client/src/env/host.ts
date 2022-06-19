let host: string = 'localhost';
let socketPort: string = '5001';
let peerServerHost: string = 'localhost';

if (process.env.NODE_ENV === 'production') {
  host = 'discourde.herokuapp.com';
  socketPort = '443';
  peerServerHost = 'discourde-peerjs.herokuapp.com';
}

export { host, socketPort, peerServerHost };
