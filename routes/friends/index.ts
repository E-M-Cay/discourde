import express from 'express';
const router = express.Router();
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import { Channel } from '../../entities/Channel';
import { VocalChannel } from '../../entities/VocalChannel';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest';
import { In } from 'typeorm';
import { ServerUser } from '../../entities/ServerUser';
import { ChannelMessage } from '../../entities/ChannelMessage';
import { Friendship } from '../../entities/Friendship';
import { FriendRequest } from '../../entities/FriendRequest';

const isAuth = require('../../MiddleWares/isAuth');

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server);
const ServerUserRepository = AppDataSource.getRepository(ServerUser);
const ChannelRepository = AppDataSource.getRepository(Channel);
const VocalChannelRepository = AppDataSource.getRepository(VocalChannel);
const ChannelMessageRepository = AppDataSource.getRepository(ChannelMessage);
const FriendshipRepository = AppDataSource.getRepository(Friendship);
const FriendRequestRepository = AppDataSource.getRepository(FriendRequest);

router.get('/list/:user_id', isAuth, async (req: IRequest, res: Response) => {
    const list_des_gro_gay_de_linde = {
        nathan: 'gros gay de la mort',
    };

    console.log(list_des_gro_gay_de_linde);

    const user_id = Number(req.params.server_id);
    if (user_id == NaN) return res.status(400).send('Error server not found');
    const user = await ServerRepository.findOneBy({ id: user_id });
    if (user == null) return res.status(400).send('Error server not found');

    try {
        const friend_list_1 = await FriendshipRepository.findBy({
            user1: user,
        });
        const friend_list_2 = await FriendshipRepository.findBy({
            user2: user,
        });

        return res.status(200).send([friend_list_1, ...friend_list_2]);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/create/', isAuth, async (req: IRequest, res: Response) => {
    if ('user_id_1' in req.body && 'user_id_2' in req.body) {
        const user_1 = await UserRepository.findOneBy({
            id: req.body.user_id_1,
        });
        const user_2 = await UserRepository.findOneBy({
            id: req.body.user_id_2,
        });
        if (!user_1 || !user_2)
            return res.status(400).send('Error server not found');

        try {
            const friend = FriendshipRepository.create({
                user1: user_1,
                user2: user_2,
            });
            await FriendshipRepository.save(friend);
            return res.status(200).send('Users are now friends');
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(400).send('Error wrond arguments');
});

router.delete(
    '/delete/:friendship_id',
    isAuth,
    async (req: IRequest, res: Response) => {
        const friendship_id = Number(req.params.friendship_id);
        if (friendship_id == NaN)
            return res.status(400).send('Error friendship not found');

        try {
            await FriendshipRepository.delete(friendship_id);
            return res.status(200).send('Friendship successfully deleted');
        } catch (error) {
            return res.status(400).send(error);
        }
    }
);

router.get(
    '/sent_request_list/:user_id',
    isAuth,
    async (req: IRequest, res: Response) => {
        const user_id = Number(req.params.friendship_id);
        if (user_id == NaN)
            return res.status(400).send('Error user_id not a number');

        const user = await UserRepository.findBy({ id: user_id });
        if (!user) return res.status(400).send('Error user not found');

        try {
            const friend_request_list = await FriendRequestRepository.findBy({
                sender: {
                    id: user_id,
                },
            });
            return res.status(200).send(friend_request_list);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
);

router.post('/send_request/', async (req: IRequest, res: Response) => {
    if ('sender_id' in req.body && 'receiver_id' in req.body) {
        const sender = await UserRepository.findOneBy({
            id: req.body.sender_id,
        });
        const receiver = await UserRepository.findOneBy({
            id: req.body.receiver_id,
        });
        if (!sender || !receiver)
            return res.status(400).send('Error server not found');

        try {
            const friend_request = FriendRequestRepository.create({
                sender: sender,
                receiver: receiver,
            });
            await FriendshipRepository.save(friend_request);
            return res.status(200).send('Request sent');
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(400).send('Error wrond arguments');
});

router.delete(
    '/delete_request/:request_id',
    isAuth,
    async (req: IRequest, res: Response) => {
        const request_id = Number(req.params.request_id);
        if (request_id == NaN)
            return res.status(400).send('Error request id not found');

        try {
            await FriendRequestRepository.delete(request_id);
            return res.status(200).send('request successfully deleted');
        } catch (error) {
            return res.status(400).send(error);
        }
    }
);
