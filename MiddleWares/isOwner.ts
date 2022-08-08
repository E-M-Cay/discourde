import { Express, Response, NextFunction } from 'express';
import IRequest from '../Interfaces/IRequest';
import AppDataSource from '../db/AppDataSource';
import { Server } from '../entities/Server';

const serverRepository = AppDataSource.getRepository(Server);

export const isOwner = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const exists = await serverRepository.countBy({
            id: Number(req.params.id),
            owner: {
                id: req.id,
            },
        });
        if (exists) {
            next();
        }
    } catch (e) {
        return res.status(401).send({ e });
    }

    return res.status(200).send({ error: 'Not owner of server' });
};
