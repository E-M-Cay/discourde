import express, { Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import { PrivateMessage } from '../../entities/PrivateMessage';
import { User } from '../../entities/User';
import IRequest from '../../Interfaces/IRequest';
import isAuth from '../../MiddleWares/isAuth';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const privateMessageRepository = AppDataSource.getRepository(PrivateMessage);

router.get('/:id', isAuth, async (req: IRequest, res: Response) => {
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
                { user1: { id: req.id }, user2: { id: user_id } },
                { user1: { id: user_id }, user2: { id: req.id } },
            ],
            relations: {
                user1: true,
            },
            select: {
                user1: {
                    id: true,
                },
            },
        });
        res.status(201).send({ messages, username: user.username });
    } catch (e) {
        console.log(e);
        res.status(401).send('error');
    }
});

export default router;
