import AppDataSource from '../../db/AppDataSource';
import express from 'express';
const router = express.Router();

import { ServerInvitation } from '../../entities/ServerInvitation';
import { Server } from '../../entities/Server';
import { User } from '../../entities/User';
import { ServerUser } from '../../entities/ServerUser';
import isAuth from '../../MiddleWares/isAuth';

const ServerRepository = AppDataSource.getRepository(Server);
const UserRepository = AppDataSource.getRepository(User);
const ServerInvitationRepository =
  AppDataSource.getRepository(ServerInvitation);
const ServerUserRepository = AppDataSource.getRepository(ServerUser);
import IREQUEST from '../../Interfaces/IRequest';
import { Request, Response } from 'express';
import { io } from '../../index';
import { isOwner } from '../../MiddleWares/isOwner';

router.post(
  '/createInvitation',
  isAuth,
  async (req: IREQUEST, res: Response) => {
    const user = await UserRepository.findOne({
      where: {
        id: req.id,
      },
      select: {
        id: true,
        username: true,
        picture: true,
        join_date: true,
      },
    });
    const invitedUser = await UserRepository.findOne({
      where: { id: req.body.invitedUserId },
      select: { id: true },
    });
    if (!user || !invitedUser) return res.status(401).send('User not found');
    const server = await ServerRepository.findOneBy({
      id: req.body.server,
    });
    if (!server) return res.status(401).send('Server not found');
    const invitation = await ServerInvitationRepository.findOne({
      where: {
        server: {
          id: server.id,
        },
        receiver: {
          id: invitedUser.id,
        },
      },
    });
    if (invitation) return res.status(401).send('Invitation already sent');
    const serverInvitation: ServerInvitation =
      ServerInvitationRepository.create({
        receiver: invitedUser,
        sender: user,
        server: server,
      });
    const newInvit = await ServerInvitationRepository.save(serverInvitation);
    if (user_id_to_socket_id.has(invitedUser.id)) {
      io.to(user_id_to_socket_id.get(invitedUser.id) as string).emit(
        'newserverinvitation',
        newInvit
      );
    }
    return res.status(200).send('Invitation sent');
  }
);

router.get('/getinvitations', isAuth, async (req: IREQUEST, res: Response) => {
  const user = await UserRepository.findOneBy({
    id: req.id,
  });
  if (!user) return res.status(401).send('User not found');
  const serverInvitations = await ServerInvitationRepository.find({
    where: [
      {
        receiver: {
          id: user.id,
        },
      },
    ],
    relations: {
      sender: true,
      receiver: true,
      server: true,
    },
    select: {
      sender: {
        id: true,
        username: true,
        picture: true,
        join_date: true,
      },
      receiver: {
        id: true,
      },
      server: {
        id: true,
        name: true,
      },
    },
  });
  return res.status(200).send(serverInvitations);
});

router.post(
  '/acceptinvitation',
  isAuth,
  async (req: IREQUEST, res: Response) => {
    try {
      const user = await UserRepository.findOneBy({
        id: req.id,
      });
      const serverInvitation = await ServerInvitationRepository.findOneBy({
        id: req.body.serverInvitationId,
      });
      const server = await ServerRepository.findOneBy({
        id: req.body.serverId,
      });
      if (!server) return res.status(401).send('Error');
      if (!user || !serverInvitation)
        return res.status(404).send('User not found');
      const existing = await ServerUserRepository.findOneBy({
        user: { id: req.id },
        server: {
          id: server.id,
        },
      });
      if (existing) {
        ServerInvitationRepository.delete(serverInvitation.id);
        return res.status(200).send('Server already joined');
      }
      const serverUser = ServerUserRepository.create({
        user: user,
        server: server,
        nickname: user.username,
      });
      const newId = (await ServerUserRepository.save(serverUser)).id;
      const newServerUser = await ServerUserRepository.findOne({
        where: { id: newId },
        relations: {
          user: true,
          server: true,
        },
        select: {
          user: {
            id: true,
            username: true,
            picture: true,
            join_date: true,
          },
        },
      });
      ServerInvitationRepository.delete(serverInvitation.id);
      io.emit('userjoinedserver', newServerUser);
      // //console.log('servu:', newServerUser, 'user:', serverUser.user);
      return res.status(201).send(newServerUser);
    } catch (e) {
      console.log(e);
      return res.status(401).send('error');
    }
  }
);

router.post(
  '/declineinvitation',
  isAuth,
  async (req: IREQUEST, res: Response) => {
    const user = await UserRepository.findOneBy({
      id: req.id,
    });
    const serverInvitation = await ServerInvitationRepository.findOneBy({
      id: req.body.serverInvitationId,
    });
    if (!user || !serverInvitation)
      return res.status(404).send('User not found');
    ServerInvitationRepository.delete(serverInvitation.id);
    return res.status(200).send('Invitation declined');
  }
);

export default router;
