import express, { Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import { PrivateMessage } from '../../entities/PrivateMessage';
import { User } from '../../entities/User';
import IRequest from '../../Interfaces/IRequest';
import isAuth from '../../MiddleWares/isAuth';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const privateMessageRepository = AppDataSource.getRepository(PrivateMessage);

router.get('/messages/:id', isAuth, async (req: IRequest, res: Response) => {
    const user_id = Number(req.params.id);
    const user = await userRepository.findOne({
        where: {
            id: user_id,
        },
        select: {
            username: true,
        },
    });
    if (!user) return res.status(401).send('user not found');
    try {
        const messages = await privateMessageRepository.find({
            where: [
                {
                    user1: { id: req.id },
                    user2: { id: user_id },
                },
                {
                    user1: { id: user_id },
                    user2: { id: req.id },
                },
            ],
            relations: {
                user1: true,
            },
            select: {
                user1: {
                    id: true,
                },
            },
            order: {
                send_time: 'ASC',
            },
        });
        res.status(201).send({ messages, username: user.username });
    } catch (e) {
        console.log(e);
        res.status(401).send('error');
    }
});

router.get('/userlist', isAuth, async (req: IRequest, res: Response) => {
    try {
        const users = await userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.picture'])
            .leftJoin('user.privateMessagesSent', 'sent')
            .leftJoin('user.privateMessagesReceived', 'received')
            .where('received.user1=:id', { id: req.id })
            .orWhere('sent.user2=:id', { id: req.id })
            .getMany();
        // find({
        //     where: [

        //         {
        //             privateMessagesSent: {
        //                 user2: {
        //                     id: req.id,
        //                 },
        //             },
        //         },
        //         {
        //             privateMessagesReceived: {
        //                 user1: {
        //                     id: req.id,
        //                 },
        //             },
        //         },
        //     ],
        //     select: {
        //         username: true,
        //         id: true,
        //         picture: true,
        //     },
        // });

        res.status(201).send(users);
    } catch (e) {
        console.log(e);
    }
});

export default router;
