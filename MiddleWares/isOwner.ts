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
    const serverId = req.params.server_id || req.body.server;

    if (!serverId) throw new Error('no server id');

    const exists = await serverRepository.countBy({
      id: serverId,
      owner: {
        id: req.id,
      },
    });
    if (!exists) {
      return res.status(401).send({ error: 'Not owner of server' });
    }
    next();
  } catch (e) {
    return res.status(401).send('error');
  }
};
