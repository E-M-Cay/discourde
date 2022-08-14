import { VocalChannel } from './../../entities/VocalChannel';
import { Server } from '../../entities/Server';
import AppDataSource from "../../db/AppDataSource";
import IREQUEST from "../../Interfaces/IRequest";
import isAuth from "../../MiddleWares/isAuth";
import router from "../friends/index";
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

                await VocalChannelRepository.save(vocalchannel);
                return res.status(200).send(vocalchannel);
            } catch (error) {
                console.log(error);
                return res.status(400).send('Error');
            }
        }
    }
});

export default router;
