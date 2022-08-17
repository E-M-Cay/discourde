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

router.post(
  '/createInvitation',
  isAuth,
  async (req: IREQUEST, res: Response) => {
    const user = await UserRepository.findOneBy({
      id: req.id,
    });
    const invitedUser = await UserRepository.findOneBy({
      id: req.body.invitedUserId,
    });
    if (!user || !invitedUser) return res.status(401).send('User not found');
    const server = await ServerRepository.findOneBy({
      id: req.body.serverId,
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
    await ServerUserRepository.save(serverUser);
    ServerInvitationRepository.delete(serverInvitation.id);
    return res.status(201).send({ server });
  }
);

export default router;
