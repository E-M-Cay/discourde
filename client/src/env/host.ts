let host: string = 'localhost';
let socketPort: string = '5001';
let peerServerHost: string = 'localhost';
let peerPort: number = 9000;

if (process.env.NODE_ENV === 'production') {
  host = 'discourde.herokuapp.com';
  socketPort = '443';
  peerServerHost = 'discourde-peerjs.herokuapp.com';
  peerPort = 443;
}

export { host, socketPort, peerServerHost, peerPort };
