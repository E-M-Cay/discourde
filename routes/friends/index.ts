import express from 'express';
import { Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import { User } from '../../entities/User';
import IRequest from '../../Interfaces/IRequest';
import { Friendship } from '../../entities/Friendship';
import { FriendRequest } from '../../entities/FriendRequest';
import isAuth from '../../MiddleWares/isAuth';
import { io } from '../../index';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const FriendshipRepository = AppDataSource.getRepository(Friendship);
const FriendRequestRepository = AppDataSource.getRepository(FriendRequest);

router.get('/list', isAuth, async (req: IRequest, res: Response) => {
  try {
    const user_id = Number(req.id);
    const user = await userRepository.countBy({ id: user_id });
    if (!user) {
      throw new Error('User not found');
    }

    const friends = await FriendshipRepository.createQueryBuilder('friendship')
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

router.post('/send_request/', isAuth, async (req: IRequest, res: Response) => {
  if ('user' in req.body) {
    try {
      const sender = await userRepository.countBy({
        id: req.id,
      });
      const receiver = await userRepository.countBy({
        id: req.body.user,
      });
      if (!sender || !receiver) throw new Error('Error user not found');

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

      // //console.log(alreadyFriends, 'friends ?');

      if (alreadyFriends) {
        return res.status(401).send('Already friends');
      }

      const alreadyExists = await FriendRequestRepository.count({
        where: [
          {
            sender: { id: req.body.user },
            receiver: { id: req.id },
          },
          {
            receiver: { id: req.body.user },
            sender: { id: req.id },
          },
        ],
      });

      // //console.log(alreadyExists);

      if (alreadyExists) {
        throw new Error('A request already exists.');
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
      await FriendRequestRepository.save(friend_request).then((response) => {
        if (global.user_id_to_socket_id.has(req.body.user)) {
          io.to(global.user_id_to_socket_id.get(req.body.user) as string).emit(
            'newfriendrequest',
            {
              id: response.id,
              sender,
            }
          );
        }
        return res.status(201).send({ newRequest: response.id });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send('error2');
    }
  }
});

router.post('/create', isAuth, async (req: IRequest, res: Response) => {
  if ('request' in req.body) {
    const requestId = req.body.request;
    // //console.log(requestId, 'req id');
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

      // //console.log(request, 'req');
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
            global.user_id_to_socket_id.get(request.sender.id) as string
          ).emit('friendrequestaccepted', {
            id: response.id,
            friend: request.receiver,
          });
        }
      });
      await FriendRequestRepository.delete({
        id: requestId,
      });

      return res.status(201).send('Successfully sent request');
    } catch (error) {
      console.log(error);
      return res.status(400).send('error');
    }
  }
  return res.status(400).send('Missing information');
});

router.delete(
  '/delete/:id/:user_id',
  isAuth,
  async (req: IRequest, res: Response) => {
    const friendship_id = Number(req.params.id);
    const friend_id = Number(req.params.user_id);
    console.log('friendship', friendship_id);

    try {
      await FriendshipRepository.delete({
        id: friendship_id,
      });
      const friendSocket = global.user_id_to_socket_id.get(friend_id);
      if (friendSocket) io.to(friendSocket).emit('friendshipremoved', req.id);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(400).send('error');
    }
  }
);

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
      // //console.log(friendRequests, 'FRRR', req.id);
      return res.status(201).send(friendRequests);
    } catch (e) {
      res.status(401).send('Could not get friends');
    }
  }
);

router.get('/requests/sent', isAuth, async (req: IRequest, res: Response) => {
  const user_id = Number(req.id);
  if (user_id == NaN) return res.status(400).send('Error user_id not a number');

  const user = await userRepository.count({ where: { id: user_id } });
  if (!user) return res.status(400).send('Error user not found');

  try {
    const friendRequestsSent = await FriendRequestRepository.find({
      where: {
        sender: {
          id: user_id,
        },
      },
      relations: {
        receiver: true,
      },
      select: {
        receiver: {
          id: true,
          username: true,
          picture: true,
          join_date: true,
        },
      },
    });

    return res.status(200).send(friendRequestsSent);
  } catch (error) {
    console.log(error);
    return res.status(400).send('error');
  }
});

router.delete(
  '/request/received/:id',
  isAuth,
  async (req: IRequest, res: Response) => {
    const requestId = Number(req.params.id);
    if (requestId == NaN)
      return res.status(400).send('Error request id not found');
    try {
      const request = await FriendRequestRepository.findOne({
        where: {
          id: requestId,
          receiver: {
            id: req.id,
          },
        },
        relations: {
          sender: true,
        },
        select: {
          sender: { id: true },
        },
      });
      if (!request) throw new Error('Can not delete this request');

      const senderId = request.sender.id;

      if (global.user_id_to_socket_id.has(senderId)) {
        io.to(global.user_id_to_socket_id.get(senderId) as string).emit(
          'friendrequestrefused',
          req.id
        );
      }
      await FriendRequestRepository.delete(requestId);
      return res.sendStatus(204);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

router.delete(
  '/request/sent/:id',
  isAuth,
  async (req: IRequest, res: Response) => {
    const requestId = Number(req.params.id);
    if (requestId == NaN)
      return res.status(400).send('Error request id not found');
    try {
      const request = await FriendRequestRepository.findOne({
        where: {
          id: requestId,
          sender: {
            id: req.id,
          },
        },
        relations: {
          receiver: true,
        },
        select: { sender: { id: true }, receiver: { id: true } },
      });
      if (!request) return res.status(401).send('Cannot delete this request');

      const receiverId = request.receiver.id;

      if (global.user_id_to_socket_id.has(receiverId)) {
        io.to(global.user_id_to_socket_id.get(receiverId) as string).emit(
          'friendrequestcanceled',
          req.id
        );
      }
      await FriendRequestRepository.delete(requestId);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(400).send('error');
    }
  }
);

export default router;
