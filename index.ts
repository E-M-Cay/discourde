import 'reflect-metadata';
import jwt from 'jsonwebtoken';
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
import { User } from './entities/User';
import { Permission } from './entities/Permission';
import friends from './routes/friends';
import channels from './routes/channels';
import users from './routes/users/index';
import servers from './routes/servers/index';
import privateMessageRoute from './routes/privatemessage/index';
import upsertPermissions from './db/upsertPermissions';
import { PrivateMessage } from './entities/PrivateMessage';

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

global.user_id_to_peer_id = new Map<number, string>();
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
        console.log(
            `⚡️[server]: Server is running at http://localhost:${port}`
        );
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
    peer_id?: string;
    user_id?: number;
}

io.use((socket: ISocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return;

    const decoded: any = jwt.verify(
        // content.token,
        socket.handshake.auth.token,
        process.env.SECRET_TOKEN || ''
    );
    if (decoded) {
        console.log('handshake');

        // On ajoute l'utilisateur à la requête
        socket.user_id = Number(decoded.user.id);
        next();
    }
});

io.on('connection', (socket: ISocket) => {
    user_id_to_socket_id.set(socket.user_id as number, socket.id);
    socket.on('username', (newUsername) => {
        socket.username = newUsername;
        socket.emit('username', newUsername);
    });

    socket.on('message', async (content: Message) => {
        const user = await userRepository.count({
            where: { id: socket.user_id },
            select: { id: true },
        });

        // const channedl = await ChannelRepository.findOne(1, {});

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
    });

    socket.on('privatemessage', async (message: PrivateMessageInterface) => {
        const user = await userRepository.count({
            where: { id: socket.user_id },
            select: { id: true },
        });
        console.log(message);
        console.table(user_id_to_socket_id);

        io.allSockets().then((res) => console.table(res));
        let time: string = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        const private_message = PrivateMessageRepository.create({
            user1: { id: socket.user_id },
            content: message.content,
            send_time: time,
            user2: { id: message.to },
        });

        await PrivateMessageRepository.save(private_message);

        console.log(private_message);
        io.to(socket.id)
            .to(user_id_to_socket_id.get(message.to as number) as string)
            .emit(`privatemessage`, {
                user1: private_message.user1,
                receiver: private_message.user2,
                send_time: private_message.send_time,
                content: private_message.content,
            });
    });

    socket.on('peerId', (data: { peer_id: string }) => {
        socket.peer_id = data.peer_id;
        global.user_id_to_status.set(socket.user_id as number, 1);
        global.user_id_to_peer_id.set(socket.user_id as number, data.peer_id);

        socket.broadcast.emit('userconnected', socket.user_id);
        socket.emit('ready');
    });

    socket.on('message', (message) => {
        console.log(message);
    });

    socket.on('disconnecting', (reason) => {
        if (!socket.user_id) {
            return console.error('no user_id');
        }
        global.user_id_to_peer_id.delete(socket.user_id);
        global.user_id_to_status.delete(socket.user_id);
        console.log('disconnected socket', socket.id, reason);
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
        }

        io.emit('userdisconnected', socket.user_id);
    });

    socket.on('inactif', () => {
        global.user_id_to_status.delete(socket.user_id as number);
        global.user_id_to_status.set(socket.user_id as number, 2);
    });

    socket.on('dnd', () => {
        global.user_id_to_status.delete(socket.user_id as number);
        global.user_id_to_status.set(socket.user_id as number, 3);
    });

    socket.on('joinvocalchannel', (id: number) => {
        const currentVocalChannel = global.user_id_to_vocal_channel.get(
            socket.user_id as number
        );
        if (currentVocalChannel && currentVocalChannel !== id) {
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

        global.user_id_to_vocal_channel.set(socket.user_id as number, id);
        if (global.vocal_channel_to_user_list.has(id)) {
            global.vocal_channel_to_user_list
                .get(id)
                ?.push(socket.user_id as number);
        } else {
            global.vocal_channel_to_user_list.set(id, [
                socket.user_id as number,
            ]);
        }

        socket.broadcast.emit(`joiningvocalchannel:${id}`, {
            user: socket.user_id,
            peer_id: socket.peer_id,
        });
        io.emit('joiningvocal', { user: socket.user_id, chan: id });
    });

    socket.on('vocalchannelchange', (truc: string) => {
        console.log(truc);
    });
});

function get_user_status_list(user_id_list: number[]) {
    user_id_list =
        user_id_list.length == 0
            ? [...global.user_id_to_peer_id.keys()]
            : user_id_list;
    let res = new Map<number, number>();
    user_id_list.forEach((user_id) => {
        //console.log(user_id);
        res.set(user_id, get_user_status(user_id) as number);
    });
    console.log(res);
    return res;
}

function get_user_status(user_id: number) {
    return global.user_id_to_peer_id.has(user_id)
        ? global.user_id_to_status.get(user_id)
        : 0;
}
