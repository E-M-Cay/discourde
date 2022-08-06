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

global.user_id_to_peer_id = new Map<number, string>();
global.user_id_to_status = new Map<number, number>();
global.user_id_to_vocal_channel = new Map<number, number>();

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

    const decoded: any = jwt.verify(
        // content.token,
        socket.handshake.auth.token,
        process.env.SECRET_TOKEN || ''
    );

    // On ajoute l'utilisateur à la requête
    socket.user_id = Number(decoded.user.id);
    next();
});

io.on('connection', (socket: ISocket) => {
    console.log('socket connected', socket.id);
    const token = socket.handshake.auth.token;

    //console.log('connection');
    socket.username = 'user#' + Math.floor(Math.random() * 999999);
    socket.join('test');

    socket.on('username', (newUsername) => {
        socket.username = newUsername;
        socket.emit('username', newUsername);
    });

    socket.on('message', async (content: Message) => {
        const user = await userRepository.findOneBy({
            id: socket.user_id,
        });

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
                    send_time: time,
                    author: user.id,
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

    socket.on('peerId', (data: { peer_id: string }) => {
        socket.peer_id = data.peer_id;
        global.user_id_to_peer_id.set(socket.user_id as number, data.peer_id);
        global.user_id_to_status.set(socket.user_id as number, 1);

        socket
            .to('test')
            .emit('hello', { socketId: socket.id, peer_id: data.peer_id });
        const toto = get_user_status_list([]);
        console.log('users:', toto);
        socket.emit('users', Array.from(toto));
    });

    socket.on('message', (message) => {
        console.log(message);
    });

    socket.on('disconnecting', (reason) => {
        global.user_id_to_peer_id.delete(socket.user_id as number);
        global.user_id_to_status.delete(socket.user_id as number);
        console.log('disconnected socket', socket.id, reason);

        socket.to('test').emit('disconnected', socket.id);
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
        console.log('join vocal:', id, socket.id);
        socket.broadcast.emit(`joiningvocalchannel:${id}`, {
            user: socket.user_id,
            peer_id: socket.peer_id,
        });
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

const PermRepository = AppDataSource.getRepository(Permission);

async function init_perm_bdd() {
    if ((await PermRepository.count({})) != 0) return;

    PermRepository.save(
        PermRepository.create({ id: 1, name: 'can_create_channel' })
    );
    PermRepository.save(
        PermRepository.create({ id: 2, name: 'can_update_channel' })
    );
    PermRepository.save(
        PermRepository.create({ id: 3, name: 'can_delete_channel' })
    );
    PermRepository.save(
        PermRepository.create({ id: 4, name: 'can_see_hidden_channel' })
    );

    PermRepository.save(
        PermRepository.create({ id: 5, name: 'can_invite_user' })
    );
    PermRepository.save(
        PermRepository.create({ id: 7, name: 'can_mute_user' })
    );
    PermRepository.save(
        PermRepository.create({ id: 8, name: 'can_kick_user' })
    );
    PermRepository.save(
        PermRepository.create({ id: 9, name: 'can_mute_user' })
    );
    PermRepository.save(
        PermRepository.create({ id: 10, name: 'can_ban_user' })
    );
    PermRepository.save(
        PermRepository.create({ id: 11, name: 'can_update_nickname' })
    );

    PermRepository.save(
        PermRepository.create({ id: 12, name: 'can_create_role' })
    );
    PermRepository.save(
        PermRepository.create({ id: 13, name: 'can_update_role' })
    );
    PermRepository.save(
        PermRepository.create({ id: 14, name: 'can_delete_role' })
    );

    PermRepository.save(
        PermRepository.create({ id: 15, name: 'can_create_message' })
    );
    PermRepository.save(
        PermRepository.create({ id: 16, name: 'can_update_message' })
    );
    PermRepository.save(
        PermRepository.create({ id: 17, name: 'can_delete_message' })
    );

    PermRepository.save(
        PermRepository.create({ id: 18, name: 'can_update_server_name' })
    );
    PermRepository.save(
        PermRepository.create({ id: 19, name: 'can_update_server_logo' })
    );

    PermRepository.save(PermRepository.create({ id: 20, name: 'is_admin' }));
}
