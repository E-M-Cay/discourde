import express from 'express';
import { Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import IRequest from '../../Interfaces/IRequest';
import { Friendship } from '../../entities/Friendship';
import { FriendRequest } from '../../entities/FriendRequest';
import isAuth from '../../MiddleWares/isAuth';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server);
const FriendshipRepository = AppDataSource.getRepository(Friendship);
const FriendRequestRepository = AppDataSource.getRepository(FriendRequest);

router.get('/list', isAuth, async (req: IRequest, res: Response) => {
    const list_des_gro_gay_de_linde = {
        nathan: 'gros gay de la mort',
    };

    console.log(list_des_gro_gay_de_linde);

    const user_id = Number(req.id);
    const user = await ServerRepository.countBy({ id: user_id });
    if (!user) return res.status(400).send('User not found');

    try {
        const friend_list = await FriendshipRepository.find({
            where: [{ user1: { id: user_id } }, { user2: { id: user_id } }],
            select: {
                id: true,
                user1: {
                    id: true,
                },
                user2: {
                    id: true,
                },
            },
        });

        const friendships = friend_list.map((f) => {
            return f.user1.id === user_id
                ? { id: f.id, friend: f.user2.id }
                : { id: f.id, friend: f.user1.id };
        });

        return res.status(200).send(friendships);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/create', isAuth, async (req: IRequest, res: Response) => {
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
    return res.status(400).send('Missing information');
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
    '/sent_request_list/',
    isAuth,
    async (req: IRequest, res: Response) => {
        const user_id = Number(req.id);
        if (user_id == NaN)
            return res.status(400).send('Error user_id not a number');

        const user = await UserRepository.count({ where: { id: user_id } });
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
        const sender = await UserRepository.countBy({
            id: req.id,
        });
        const receiver = await UserRepository.countBy({
            id: req.body.receiver_id,
        });
        if (!sender || !receiver)
            return res.status(400).send('Error user not found');

        const alreadyExists = await FriendRequestRepository.count({
            where: {
                sender: [{ id: req.id }, { id: req.body.receiver_id }],
            },
        });

        if (alreadyExists) {
            return res.status(401).send('A request already exists.');
        }

        try {
            const friend_request = FriendRequestRepository.create({
                sender: { id: req.id },
                receiver: { id: req.body.receiver_id },
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

export default router;
