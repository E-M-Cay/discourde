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

dotenv.config();

const app: Express = express(),
    port: string = process.env.PORT || '5001';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ChannelMessageRepository = AppDataSource.getRepository(ChannelMessage);
const ChannelRepository = AppDataSource.getRepository(Channel);
const userRepository = AppDataSource.getRepository(User);
interface userStatus {
    id: string;
    status: string;
    socketId: string;
}

interface Message {
    channel: number;
    content: string;
    send_time: Date;
    author: number;
    token: string;
}

let usersStatus: userStatus[] = [];

export let user_id_to_peer_id = new Map<number, string>();
export let peer_to_status = new Map<string, number>();

const user_status = new Map<number, string>();

user_status.set(0, 'Disconected');
user_status.set(1, 'Connected');
user_status.set(2, 'Away');
user_status.set(3, 'Do not disturb');

const httpServer = createServer(app);

app.get('/toto', (_req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/server', require('./routes/server'));
app.use('/user', require('./routes/user'));
app.use('/channel', require('./routes/channel'));

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
    next();
});

io.on('connection', (socket: ISocket) => {
    const token = socket.handshake.auth.token;

    //méthode decodeToken+return user_id

    console.log('connection');
    socket.username = 'user#' + Math.floor(Math.random() * 999999);
    socket.join('test');

    socket.on('username', (newUsername) => {
        socket.username = newUsername;
        socket.emit('username', newUsername);
    });

    socket.on('message', async (content: Message) => {
        console.log('fdgdfdf');

        const decoded: any = jwt.verify(
            // content.token,
            socket.handshake.auth.token,
            process.env.SECRET_TOKEN || ''
        );

        // On ajoute l'utilisateur à la requête
        const user_id: string = decoded.user.id;
        const user = await userRepository.findOneBy({
            id: Number(user_id),
        });

        // if (!user) return;

        // const userId = Number(user_id);

        const channel = await ChannelRepository.findOneBy({
            id: content.channel,
        });

        if (channel && user) {
            try {
                let time: string = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ');
                const channel_message: any = ChannelMessageRepository.create({
                    channel: channel,
                    content: content.content,
                    send_time: time,
                    author: user,
                });
                ChannelMessageRepository.save(channel_message);
                io.emit(`message:${channel.id}`, {
                    id: content.channel,
                    content: content.content,
                    send_time: time
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

    socket.on('peerId', (data: { peer_id: string; user_id: number }) => {
        socket.peer_id = data.peer_id;
        user_id_to_peer_id.set(data.user_id, data.peer_id);
        peer_to_status.set(data.peer_id, 1);

        socket
            .to('test')
            .emit('hello', { socketId: socket.id, peer_id: data.peer_id });
        const toto = get_user_status_list([]);
        console.log(toto);
        socket.emit('users', Array.from(toto));
    });

    socket.on('message', (message) => {
        console.log(message);
    });

    socket.on('disconnecting', (_reason) => {
        user_id_to_peer_id.delete(socket.user_id as number);
        peer_to_status.delete(socket.peer_id as string);

        socket.to('test').emit('disconnected', socket.id);
    });
});

function get_user_status_list(user_id_list: number[]) {
    user_id_list =
        user_id_list.length == 0
            ? [...user_id_to_peer_id.keys()]
            : user_id_list;
    let res = new Map<number, number>();
    user_id_list.forEach((user_id) => {
        console.log(user_id);
        res.set(user_id, get_user_status(user_id) as number);
    });
    console.log(res);
    return res;
}

function get_user_status(user_id: number) {
    return user_id_to_peer_id.has(user_id)
        ? peer_to_status.get(user_id_to_peer_id.get(user_id) as string)
        : 0;
}
