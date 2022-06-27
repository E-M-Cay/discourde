import express from 'express';
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD

const router = express.Router();
=======
import { Secret } from 'jsonwebtoken';
const isAuth = require('../../MiddleWares/isAuth')
>>>>>>> beb194e6f8ca0847c6a18a18bd03b646fc05c8ff

const userRepository = AppDataSource.getRepository(User);

router.post('/login', async (req: Request, res: Response) => {
  if ('email' in req.body && 'password' in req.body) {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await userRepository.findOneBy({
      email: email,
    });

    if (!user) {
      res.send('Error user not found');
      return;
    }

    if (await bcrypt.compare(password, user.password)) {
      let payload = {
        user: {
          id: user.id,
        },
      };

      return jwt.sign(
        payload,
        process.env.SECRET_TOKEN || '',
        { expiresIn: 36000 },
        function (err, token) {
          if (err) throw err;

          return res.status(200).json({
            msg: 'Got token',
            token,
          });
        }
      );
    }
    return res.send('Wrong username/password');
  }
  res.send('FAIL');
});

router.post('/register', async (req: Request, res: Response) => {
  if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
    const email: string = req.body.email;
    const existing_user = await userRepository.findOneBy({ email: email });
    if (existing_user) {
      return res.status(400).send('User already exist');
    }

    const password: string = bcrypt.hashSync(req.body.password, 10);
    const username: string = req.body.username;

    const date = Date.now();

    const user = userRepository.create({
      username: username,
      email: email,
      password: password,
      join_date: date,
    });

    userRepository.save(user);

    return res.status(201).send('User created succesfully');
  }
  res.send('FAIL');
});




router.get('/home', isAuth, (req: Request, res: Response) => {
  res.send('Hello fdp');
});

module.exports = router;
