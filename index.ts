import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { PeerServer } from 'peer';
import { Socket, Server as SocketServer } from 'socket.io';
import path from 'path';

dotenv.config();

const app: Express = express(),
  port: string = process.env.PORT || '5001';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface userStatus {
  id: string;
  status: string;
  socketId: string;
}

let usersStatus: userStatus[] = [];

const httpServer = createServer(app);

app.get('/toto', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/server', require('./routes/server'));
app.use('/user', require('./routes/user'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client/build')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

httpServer.listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('App running at https://discourde.herokuapp.com');
  } else {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  }
});

if (process.env.NODE_ENV === 'development') {
  const peerServer = PeerServer({
    port: 9000,
    path: '/',
  });

  peerServer.on('connection', (client) => {
    console.log('peer client', client.getId());
  });

  peerServer.on('disconnect', (_client) => {
    console.log('peer client leave');
  });
}

const io: SocketServer = new SocketServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

interface ISocket extends Socket {
  username?: string;
}

io.on('connection', (socket: ISocket) => {
  console.log('connection');
  socket.username = 'user#' + Math.floor(Math.random() * 999999);
  socket.join('test');

  socket.on('username', (newUsername) => {
    socket.username = newUsername;
    socket.emit('username', newUsername);
  });

  socket.on('connected', (id: string) => {
    socket.emit('username', socket.username);
  });

  socket.on('peerId', (id) => {
    usersStatus.push({ id: id, status: 'online', socketId: socket.id });
    socket.to('test').emit('hello', { socketId: socket.id, id });
    socket.emit('users', usersStatus);
  });

  socket.on('disconnecting', (_reason) => {
    socket.to('test').emit('disconnected', socket.id);
    usersStatus = usersStatus.filter((u) => u.socketId !== socket.id);
  });
});
