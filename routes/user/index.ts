import express from 'express';
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import jwt from 'jsonwebtoken';

const router = express.Router();
import isAuth from '../../MiddleWares/isAuth';

const userRepository = AppDataSource.getRepository(User);

router.post('/login', async (req: Request, res: Response) => {
    if ('email' in req.body && 'password' in req.body) {
        const email: string = req.body.email;
        const password: string = req.body.password;

        const user = await userRepository.findOneBy({
            email: email,
        });

        if (!user) {
            res.status(401).send('Error user not found');
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
                { expiresIn: 3600000 },
                function (err, token) {
                    if (err) throw err;
                    return res.status(200).json({
                        msg: 'Got token',
                        user_id: user.id,
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
    if (
        'username' in req.body &&
        'email' in req.body &&
        'password' in req.body
    ) {
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

router.get('/token_check', isAuth, (_req: Request, res: Response) => {
    res.status(201).send({ ok: 'Valid token' });
});

router.get('/home', isAuth, (_req: Request, res: Response) => {
    res.send('Hello fdp');
});

export default router;
