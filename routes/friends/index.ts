import express from 'express';
import { Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import IRequest from '../../Interfaces/IRequest';
import { Friendship } from '../../entities/Friendship';
import { FriendRequest } from '../../entities/FriendRequest';
import isAuth from '../../MiddleWares/isAuth';
import { io } from '../../index';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
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
        // const friends = await userRepository.find({
        //     where: [
        //         {
        //             friendshipsReceived: {
        //                 user1: { id: req.id },
        //             },
        //         },
        //         {
        //             friendshipsSent: {
        //                 user2: { id: req.id },
        //             },
        //         },

        //     ], relations: {
        //         friendshipsReceived: {
        //             user2: {id: true}
        //         }
        //     },  select: {
        //         friendshipsReceived: {
        //             user2: {

        //             }
        //         }
        //     }
        // });

        // const friends = await FriendshipRepository.find({
        //     where: [
        //         {
        //             user1: {
        //                 id: req.id,
        //             },
        //         },
        //         {
        //             user2: {
        //                 id: req.id,
        //             },
        //         },
        //     ],
        //     relations: {
        //         user1: true,
        //         user2: true,
        //     },
        //     select: {
        //         id: true,
        //         user1: { id: true, picture: true, username: true },
        //         user2: {
        //             id: true,
        //             picture: true,
        //             username: true,
        //         },
        //     },
        // });

        const friends = await FriendshipRepository.createQueryBuilder(
            'friendship'
        )
            .leftJoinAndSelect('friendship.user1', 'sender')
            .leftJoinAndSelect('friendship.user2', 'receiver')
            .select([
                'friendship.id',
                'receiver.id',
                'receiver.username',
                'receiver.picture',
                'sender.id',
                'sender.username',
                'sender.picture',
            ])
            .where('sender.id=:id', { id: req.id })
            .orWhere('receiver.id=:id', { id: req.id })
            .getMany();

        return res.status(200).send(friends);
    } catch (error) {
        console.log(error);
        return res.status(400).send('error');
    }
});

router.get(
    '/requests/received',
    isAuth,
    async (req: IRequest, res: Response) => {
        try {
            const friendRequests = await FriendRequestRepository.find({
                where: {
                    receiver: { id: req.id },
                },
                relations: { sender: true },
                select: {
                    sender: {
                        id: true,
                        username: true,
                        picture: true,
                    },
                },
            });
            // console.log(friendRequests, 'FRRR', req.id);
            return res.status(201).send(friendRequests);
        } catch (e) {
            res.status(401).send('Could not get friends');
        }
    }
);

router.post('/send_request/', isAuth, async (req: IRequest, res: Response) => {
    if ('user' in req.body) {
        try {
            const sender = await userRepository.countBy({
                id: req.id,
            });
            const receiver = await userRepository.countBy({
                id: req.body.user,
            });
            if (!sender || !receiver)
                return res.status(400).send('Error user not found');

            const alreadyFriends = await FriendshipRepository.count({
                where: [
                    {
                        user1: { id: req.id },
                        user2: { id: req.body.user },
                    },
                    {
                        user1: { id: req.body.user },
                        user2: { id: req.id },
                    },
                ],
            });

            // console.log(alreadyFriends, 'friends ?');

            if (alreadyFriends) {
                return res.status(401).send('Already friends');
            }

            const alreadyExists = await FriendRequestRepository.count({
                where: {
                    sender: [{ id: req.id }, { id: req.body.user }],
                },
            });

            // console.log(alreadyExists);

            if (alreadyExists) {
                return res.status(401).send('A request already exists.');
            }
        } catch (e) {
            console.log(e);
            return res.status(401).send('error1');
        }

        try {
            const sender = await userRepository.findOne({
                where: {
                    id: req.id,
                },
                select: {
                    id: true,
                    username: true,
                    picture: true,
                },
            });

            const friend_request = FriendRequestRepository.create({
                sender: { id: req.id },
                receiver: { id: req.body.user },
            });
            await FriendRequestRepository.save(friend_request).then(
                (response) => {
                    if (global.user_id_to_socket_id.has(req.body.user)) {
                        io.to(
                            global.user_id_to_socket_id.get(
                                req.body.user
                            ) as string
                        ).emit('newfriendrequest', {
                            id: response.id,
                            sender,
                        });
                    }
                }
            );

            return res.status(200).send('Request sent');
        } catch (error) {
            console.log(error);
            return res.status(400).send('error2');
        }
    }
    return res.status(400).send('Error wrond arguments');
});

router.post('/create', isAuth, async (req: IRequest, res: Response) => {
    if ('request' in req.body) {
        const requestId = req.body.request;
        // console.log(requestId, 'req id');
        try {
            const request = await FriendRequestRepository.findOne({
                where: {
                    id: requestId,
                },
                relations: {
                    sender: true,
                    receiver: true,
                },
                select: {
                    sender: {
                        id: true,
                    },
                    receiver: {
                        id: true,
                        username: true,
                        picture: true,
                        join_date: true,
                    },
                },
            });

            // console.log(request, 'req');
            if (!request) throw new Error('Request not found');
            const friendship = FriendshipRepository.create({
                user1: { id: req.id },
                user2: {
                    id: request.sender.id,
                },
            });

            await FriendshipRepository.save(friendship).then((response) => {
                if (global.user_id_to_socket_id.has(request.sender.id)) {
                    io.to(
                        global.user_id_to_socket_id.get(
                            request.sender.id
                        ) as string
                    ).emit('friendrequestaccepted', {
                        id: response.id,
                        friend: request.receiver,
                    });
                }
            });
            await FriendRequestRepository.delete({
                id: requestId,
            });

            return res.status(201).send();
        } catch (error) {
            console.log(error);
            return res.status(400).send('error');
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

        const user = await userRepository.count({ where: { id: user_id } });
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
