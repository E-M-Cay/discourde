import express, { text } from 'express';
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest';
import { In } from 'typeorm';
import { ServerUser } from '../../entities/ServerUser';
import { VocalChannel } from '../../entities/VocalChannel';
import { Channel } from '../../entities/Channel';
const router = express.Router();

import isAuth from '../../MiddleWares/isAuth';
import { isOwner } from '../../MiddleWares/isOwner';
const hasPerm = require('../../MiddleWares/hasPerm');

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server);
const vocalChannelRepository = AppDataSource.getRepository(VocalChannel);
const channelRepository = AppDataSource.getRepository(Channel);
const ServerUserRepository = AppDataSource.getRepository(ServerUser);

router.get('/list', isAuth, hasPerm, async (req: IRequest, res: Response) => {
    const user = await UserRepository.findOne({
        where: {
            id: req.id,
        },
        relations: ['servers'],
    });

    if (!user) return res.send('User not found');

    const list_server = await ServerUserRepository.find({
        where: {
            user: {
                id: req.id,
            },
        },
        relations: ['server'],
    });

    const tempList: ServerUser[] = await Promise.all(
        list_server.map(async (serv) => {
            serv.server.channels = await channelRepository.find({
                where: {
                    server: { id: serv.server.id },
                },
            });
            return serv;
        })
    );
    //console.log(tempList[0]);
    return res.send(tempList);
});

router.post('/create_server', isAuth, async (req: IRequest, res: Response) => {
    if ('name' in req.body && 'main_img' in req.body) {
        const name: string = req.body.name;
        const main_img: string = req.body.main_img;

        const owner = await UserRepository.findOneBy({ id: req.id });

        if (!owner) return res.status(404).send('User not found');

        try {
            const server: Server = ServerRepository.create({
                name: name,
                main_img: main_img,
                logo: '',
                owner: { id: req.id },
            });
            const vocalChan = vocalChannelRepository.create({
                name: 'Forum',
                server: server,
            });
            server.vocalChannels.push(vocalChan);
            //await vocalChannelRepository.save(vocalChan);
            const textChan: Channel = channelRepository.create({
                name: 'Général',
                server: server,
            });
            //await channelRepository.save(textChan);
            server.channels.push(textChan);

            const serverUser: ServerUser = ServerUserRepository.create({
                server: server,
                user: { id: req.id as number },
                nickname: owner.username,
            });

            server.users.push(serverUser);

            //await ServerUserRepository.save(serverUser);
            await ServerRepository.save(server);
            return res
                .status(200)
                .send({ id: serverUser.id, nickname: owner.username, server });
        } catch (error) {
            console.log(error);
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.put('/update_server', isAuth, async (req: IRequest, res: Response) => {
    if (
        ('main_img' in req.body || 'logo' in req.body) &&
        'server_id' in req.body
    ) {
        const server = await ServerRepository.findOneBy({
            id: Number(req.body.server_id),
        });
        const logo: string = 'logo' in req.body ? req.body.name : null;
        const main_img: string =
            'main_img' in req.body ? req.body.main_img : null;

        if (!server) return res.status(400).send('Error server not found');

        try {
            if (logo) server.logo = logo;
            if (main_img) server.main_img = main_img;

            ServerRepository.save(server);
            return res.status(200).send(server);
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.delete(
    '/delete_server/:id',
    isAuth,
    isOwner,
    async (req: IRequest, res: Response) => {
        const server_id = Number(req.params.id);
        if (server_id == NaN)
            return res.status(400).send('Error server not found');

        try {
            await ServerRepository.delete(server_id);
            return res.status(200).send('Server Successfully deleted');
        } catch (error) {
            return res.status(400).send({ error });
        }
    }
);

router.get('/list_user/:id', isAuth, async (req: IRequest, res: Response) => {
    const server_id = Number(req.params.id);

    const user_list = await ServerUserRepository.find({
        where: {
            server: {
                id: server_id,
            },
            /*roles: {
                role: {
                    name: "persddsq"
                }
            }*/
        },
        relations: {
            user: true,
        },
        select: {
            user: {
                id: true,
                username: true,
            },
        },
    });

    //console.log(user_list);
    return res.status(201).send(user_list);
});

router.post('/add_user', isAuth, async (req: IRequest, res: Response) => {
    try {
        const user = await UserRepository.findOneBy({ id: req.id });
        if (!user) return res.status(404).send('Error');

        console.log(req.id, 'req.id');

        if (!('uuid' in req.body)) return res.status(404).send('Error');

        const server = await ServerRepository.findOneBy({
            link: req.body.uuid,
        });
        if (!server) return res.status(404).send('Error');
        const existing = await ServerUserRepository.findOneBy({
            user: { id: req.id },
            server: {
                id: server.id,
            },
        });
        if (existing) return res.status(200).send('Server already joined');

        const serverUser = ServerUserRepository.create({
            user: user,
            server: server,
            nickname: user.username,
        });

        await ServerUserRepository.save(serverUser);

        return res.status(201).send({ server: serverUser });
    } catch (e) {
        res.status(401).send({ error: e });
    }
});

router.delete(
    '/delete_user/:id_user&:id_server',
    isAuth,
    async (req: IRequest, res: Response) => {
        const serverUser = await ServerUserRepository.findOne({
            where: {
                server: {
                    id: Number(req.params.id_server),
                },
                user: {
                    id: Number(req.params.id_user),
                },
            },
        });

        if (!serverUser) return res.status(400).send('Error server not found');

        try {
            await ServerUserRepository.delete(serverUser.id);
            return res.status(200).send('Server Successfully deleted');
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
);

router.post('/link', isAuth, (req: IRequest, res, next) => {
    ServerRepository.update(req.body.server, {
        link: req.body.uuid,
    });
});

export default router;
