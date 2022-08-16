import express from 'express';
const router = express.Router();
import { VocalChannel } from './../../entities/VocalChannel';
import { Server } from '../../entities/Server';
import AppDataSource from "../../db/AppDataSource";
import IREQUEST from "../../Interfaces/IRequest";
import isAuth from "../../MiddleWares/isAuth";

const ServerRepository = AppDataSource.getRepository(Server);
const VocalChannelRepository = AppDataSource.getRepository(VocalChannel);
import { Request, Response } from 'express';
import IRequest from '../../Interfaces/IRequest';



router.post('/create', isAuth, async (req: IREQUEST, res: Response) => {
    console.log("fghjkdsgdsjdgsjkdgsd")
    if ('name' in req.body || 'server_id' in req.body) {
        const is_hidden = 'hidden' in req.body ? req.body.hidden : false;
        const channel_type = 'type' in req.body ? req.body.type : 0;
        const server = await ServerRepository.findOneBy({
            id: req.body.server_id,
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
                    return res.status(200).send(response)
                });
            } catch (error) {  
                console.log(error);
                return res.status(400).send('Error');
            }
        }
    }
});

router.put('/update', isAuth, async (req: IRequest, res: Response) => {
    if (
        ('name' in req.body || 'hidden' in req.body) &&
        'id' in req.body
    ) {
        const channel = await VocalChannelRepository.findOneBy({
            id: Number(req.body.id),
        });
        const name: string = 'name' in req.body ? req.body.name : null;
        const hidden: boolean =
            'hidden' in req.body ? JSON.parse(req.body.hidden) : null;
        if (!channel) return res.status(400).send('Error server not found');
        try {
            if (name) channel.name = name;
            if (hidden) channel.hidden = hidden;

            await VocalChannelRepository.save(channel);
            
            return res.status(200).send(channel);
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

export default router;
