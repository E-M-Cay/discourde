import express from 'express';
const router = express.Router();
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Role } from '../../entities/Role';
import { Server } from '../../entities/Server';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest';
import { In } from 'typeorm';
import { ServerUser } from '../../entities/ServerUser';

const isAuth = require('../../MiddleWares/isAuth');

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server);
const ServerUserRepository = AppDataSource.getRepository(ServerUser);
const RoleRepository = AppDataSource.getRepository(Role);

router.get('/list/:server_id', isAuth, async (req: IRequest, res: Response) => {
    const server_id = Number(req.params.server_id);
    if (server_id == NaN) return res.status(400).send('Error server not found');
    const server = await ServerRepository.findOneBy({ id: server_id });
    if (server == null) return res.status(400).send('Error server not found');

    try {
        const role_list = await RoleRepository.findBy({
            server: { id: server_id },
        });
        return res.status(200).send(role_list);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/create/', isAuth, async (req: IRequest, res: Response) => {
    if ('name' in req.body && 'server_id' in req.body) {
        const server = await ServerRepository.findOneBy({
            id: Number(req.body.server_id),
        });
        const name: string = req.body.name;

        if (!server) return res.status(400).send('Error server not found');

        try {
            const role = RoleRepository.create({
                name: name,
            });
            await RoleRepository.save(role);
            return res.status(200).send(role);
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.put('/update/', isAuth, async (req: IRequest, res: Response) => {
    if ('name' in req.body && 'role_id' in req.body) {
        const server = await ServerRepository.findOneBy({
            id: Number(req.body.server_id),
        });
        const name: string = req.body.name;

        if (!server) return res.status(400).send('Error server not found');

        try {
            const role = RoleRepository.create({
                name: name,
            });
            await RoleRepository.save(role);
            return res.status(200).send(role);
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.delete(
    '/delete/:role_id',
    isAuth,
    async (req: IRequest, res: Response) => {
        const role_id = Number(req.params.server_id);
        if (role_id == NaN)
            return res.status(400).send('Error server not found');
        try {
            await RoleRepository.delete(role_id);
            return res.status(200).send('Role successfully deleted');
        } catch (error) {
            return res.status(400).send(error);
        }
    }
);
