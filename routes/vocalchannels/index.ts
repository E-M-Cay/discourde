import express from 'express';
const router = express.Router();
import { VocalChannel } from './../../entities/VocalChannel';
import { Server } from '../../entities/Server';
import AppDataSource from '../../db/AppDataSource';
import IREQUEST from '../../Interfaces/IRequest';
import isAuth from '../../MiddleWares/isAuth';

const ServerRepository = AppDataSource.getRepository(Server);
const VocalChannelRepository = AppDataSource.getRepository(VocalChannel);
import { Request, Response } from 'express';
import IRequest from '../../Interfaces/IRequest';
import { isOwner } from '../../MiddleWares/isOwner';
import { io } from '../../index';

router.post(
  '/create',
  isAuth,
  isOwner,
  async (req: IREQUEST, res: Response) => {
    if ('name' in req.body || 'server' in req.body) {
      const is_hidden = 'hidden' in req.body ? req.body.hidden : false;
      const channel_type = 'type' in req.body ? req.body.type : 0;
      const server = await ServerRepository.findOneBy({
        id: req.body.server,
      });
      const channel_name = req.body.name;

      if (!server) return res.status(400).send('Error server not found');

      if (channel_type == 0) {
        try {
          const vocalchannel: VocalChannel = VocalChannelRepository.create({
            server: server,
            name: channel_name,
            hidden: is_hidden,
          });

          await VocalChannelRepository.save(vocalchannel).then((response) => {
            response.users = [];
            io.emit(`vocalchannelcreated:server${req.body.server}`, response);
            return res.sendStatus(204);
          });
        } catch (error) {
          console.log(error);
          return res.status(400).send('Error');
        }
      }
    }
  }
);

export default router;
