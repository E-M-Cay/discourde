import 'reflect-metadata';
import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { PeerServer } from 'peer';
import { Socket, Server as SocketServer } from 'socket.io';
import path from 'path';
import { ChannelMessage } from './entities/ChannelMessage';
import AppDataSource from './db/AppDataSource';
import { Channel } from './entities/Channel';
import { VocalChannel } from './entities/VocalChannel';
import { User } from './entities/User';
import friends from './routes/friends';
import channels from './routes/channels';
import vocalchannels from './routes/vocalchannels';
import users from './routes/users/index';
import servers from './routes/servers/index';
import serverinvitation from './routes/serverinvitation/index';
import privateMessageRoute from './routes/privatemessage/index';
import upsertPermissions from './db/upsertPermissions';
import { PrivateMessage } from './entities/PrivateMessage';
import upsertHomeServer from './db/upsertHomeServer';

dotenv.config();

const app: Express = express(),
  port: string = process.env.PORT || '5001';

console.log(process.env.PORT, 'port');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ChannelMessageRepository = AppDataSource.getRepository(ChannelMessage);
const ChannelRepository = AppDataSource.getRepository(Channel);
const userRepository = AppDataSource.getRepository(User);
const PrivateMessageRepository = AppDataSource.getRepository(PrivateMessage);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    upsertPermissions();
    upsertHomeServer();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

interface Message {
  channel: number;
  content: string;
  send_time: Date;
  author: number;
  token: string;
}

interface PrivateMessageInterface {
  to: number;
  content: string;
}

global.user_id_to_status = new Map<number, number>();
global.vocal_channel_to_user_list = new Map<number, number[]>();
global.user_id_to_vocal_channel = new Map<number, number>();
global.user_id_to_socket_id = new Map<number, string>();
const user_status = new Map<number, string>();

user_status.set(0, 'Disconected');
user_status.set(1, 'Connected');
user_status.set(2, 'Away');
user_status.set(3, 'Do not disturb');

const httpServer = createServer(app);

app.use('/privatemessage', privateMessageRoute);
app.use('/server', servers);
app.use('/user', users);
app.use('/channel', channels);
app.use('/friends', friends);
app.use('/vocalchannel', vocalchannels);
app.use('/serverinvitation', serverinvitation);

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

export const io: SocketServer = new SocketServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

interface ISocket extends Socket {
  username?: string;
  peer_id?: string;
  user_id?: number;
}

io.use(async (socket: ISocket, next) => {
  console.log('handshake');
  try {
    const decoded = jwt.verify(
      socket.handshake.auth.token,
      process.env.SECRET_TOKEN || ''
    ) as JwtPayload;
    socket.user_id = Number(decoded.user.id);

    next();
  } catch (e) {
    next(new Error('invalid credentials'));
  }
});

io.on('connection', (socket: ISocket) => {
  const existing = user_id_to_socket_id.get(socket.user_id as number);
  if (existing) {
    io.sockets.sockets.get(existing)?.disconnect();
  }
  io.emit('userconnected', socket.user_id);
  global.user_id_to_status.set(socket.user_id as number, 1);
  user_id_to_socket_id.set(socket.user_id as number, socket.id);
  socket.on('username', (newUsername) => {
    socket.username = newUsername;
    socket.emit('username', newUsername);
  });

  socket.on('message', async (content: Message) => {
    try {
      const user = await userRepository.count({
        where: { id: socket.user_id },
        select: { id: true },
      });

      const channel = await ChannelRepository.count({
        where: { id: content.channel },
        select: { id: true },
      });

      if (channel && user) {
        try {
          let time: string = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
          const channel_message = ChannelMessageRepository.create({
            channel: { id: content.channel },
            content: content.content,
            send_time: time,
            author: { id: socket.user_id },
          });
          ChannelMessageRepository.save(channel_message);
          io.emit(`message:${content.channel}`, {
            id: content.channel,
            content: content.content,
            send_time: time,
            author: socket.user_id,
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }

    // const channedl = await ChannelRepository.findOne(1, {});
  });

  socket.on('privatemessage', async (message: PrivateMessageInterface) => {
    if (!message.to) return;

    let time: string = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const private_message = PrivateMessageRepository.create({
      user1: { id: socket.user_id },
      content: message.content,
      send_time: time,
      user2: { id: message.to },
    });

    await PrivateMessageRepository.save(private_message);

    // console.log(private_message);
    io.to(socket.id)
      .to(user_id_to_socket_id.get(message.to) as string)
      .emit(`privatemessage`, {
        user1: private_message.user1,
        receiver: private_message.user2,
        send_time: private_message.send_time,
        content: private_message.content,
      });
  });

  socket.on('peerId', (data: { peer_id: string }) => {
    console.log('peerid');
    socket.peer_id = data.peer_id;
  });

  socket.on('message', (message) => {
    console.log(message);
  });

  socket.on('disconnecting', (reason) => {
    if (!socket.user_id) {
      return console.error('no user_id');
    }

    // console.log('disconnected socket', socket.id, reason);
    const currentVocalChannel = global.user_id_to_vocal_channel.get(
      socket.user_id as number
    );
    if (currentVocalChannel) {
      io.emit('leftvocal', {
        user: socket.user_id,
        chan: currentVocalChannel,
      });
      const userList =
        global.vocal_channel_to_user_list.get(currentVocalChannel);
      global.vocal_channel_to_user_list.set(
        currentVocalChannel,
        userList?.filter((u) => u !== socket.user_id) as number[]
      );
      global.user_id_to_vocal_channel.delete(socket.user_id);
    }
    if (global.user_id_to_socket_id.get(socket.user_id) === socket.id) {
      global.user_id_to_status.delete(socket.user_id);
      global.user_id_to_socket_id.delete(socket.user_id);
      io.emit('userdisconnected', socket.user_id);
    }
  });

  socket.on('inactif', () => {
    global.user_id_to_status.set(socket.user_id as number, 2);
    io.emit('useraway', socket.id);
  });

  socket.on('dnd', () => {
    global.user_id_to_status.set(socket.user_id as number, 3);
    io.emit('userdnd', socket.id);
  });

  socket.on('leftvocalchannel', (id: number) => {
    const currentVocalChannel = global.user_id_to_vocal_channel.get(
      socket.user_id as number
    );

    if (currentVocalChannel === id) {
      socket.broadcast.emit(`leftvocalchannel:${id}`, socket.user_id);
      io.emit('leftvocal', {
        user: socket.user_id,
        chan: currentVocalChannel,
      });
      const userList =
        global.vocal_channel_to_user_list.get(currentVocalChannel);
      global.vocal_channel_to_user_list.set(
        currentVocalChannel,
        userList?.filter((u) => u !== socket.user_id) as number[]
      );
    }
  });

  socket.on('joinvocalchannel', (id: number) => {
    global.user_id_to_vocal_channel.set(socket.user_id as number, id);
    if (global.vocal_channel_to_user_list.has(id)) {
      global.vocal_channel_to_user_list.get(id)?.push(socket.user_id as number);
    } else {
      global.vocal_channel_to_user_list.set(id, [socket.user_id as number]);
    }

    socket.broadcast.emit(`joiningvocalchannel:${id}`, {
      user_id: socket.user_id,
      peer_id: socket.peer_id,
    });
    io.emit('joiningvocal', { user: socket.user_id, chan: id });
  });
});
