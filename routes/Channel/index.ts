import express from 'express';
const router = express.Router();
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import { Channel } from '../../entities/Channel';
import { VocalChannel } from '../../entities/VocalChannel';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest'
import { In } from "typeorm";
import { ServerUser } from '../../entities/ServerUser';
import { ChannelMessage } from '../../entities/ChannelMessage';

const isAuth = require('../../MiddleWares/isAuth')

const UserRepository = AppDataSource.getRepository(User)
const ServerRepository = AppDataSource.getRepository(Server)
const ServerUserRepository = AppDataSource.getRepository(ServerUser)
const ChannelRepository = AppDataSource.getRepository(Channel)
const VocalChannelRepository = AppDataSource.getRepository(VocalChannel)
const ChannelMessageRepository = AppDataSource.getRepository(ChannelMessage)

router.get('/list/:server_id',  isAuth, async (req:IRequest, res:Response) => {
    const server_id = Number(req.params.server_id)
    if(server_id == NaN)
        return res.status(400).send('Error server not found')
    const server = await ServerRepository.findOneBy({id: server_id})
    if(server == null)
        return res.status(400).send('Error server not found')

    try{
        const text_channel_list = await ChannelRepository.findBy({server: server})
        const vocal_channel_list = await VocalChannelRepository.findBy({server: server})

        return res.status(200).send([vocal_channel_list, ...text_channel_list])
    }catch(error){
        return res.status(400).send(error)
    }
})

router.post('/create', isAuth, async (req:IRequest, res:Response) => {
    if(('name' in req.body || 'server_id' in req.body)){
        const is_hidden = ('hidden' in req.body) ? req.body.hidden : false
        const channel_type = ('type' in req.body) ? req.body.type : 0
        const server = await ServerRepository.findOneBy({id: req.body.server_id})
        const channel_name = req.body.name

        if(!server)
            return res.status(400).send('Error server not found')

        if(channel_type == 0){
            try{
                const channel:Channel = ChannelRepository.create({
                    server : server,
                    name: channel_name,
                    hidden: is_hidden
                })

                await ChannelRepository.save(channel)
                return res.status(200).send(channel)
            }
            catch(error){
                console.log(error)
                return res.status(400).send('Error')
            }
        }
    }
})

router.delete('/delete/:server_id&:channel_id', isAuth, async (req:IRequest, res:Response) => {
    const server_id = Number(req.params.server_id)
    const channel_id = Number(req.params.channel_id)
    if(server_id == NaN || channel_id == NaN)
        return res.status(400).send('Error server not found')

    const server = await ServerRepository.findOneBy({id: server_id})
    const channel = await ChannelRepository.findOneBy({id: channel_id})

    if(!server || !channel)
        return res.status(400).send('Error server not found')

        try{
            await ChannelRepository.delete(channel.id)
            return res.status(200).send('Channel successfully deleted')
        }catch(error){
            return res.status(400).send(error)
        }
})

router.put('/update', isAuth, async (req:IRequest, res:Response) => {
    if(('name' in req.body || 'hidden' in req.body) && 'channel_id' in req.body){
        const channel = await ChannelRepository.findOneBy({id: Number(req.body.channel_id)})
        const name:string = ('name' in req.body) ? req.body.name : null
        const hidden:boolean = ('hidden' in req.body) ? JSON.parse(req.body.hidden) : null

        if(!channel)
            return res.status(400).send('Error server not found')

        try{
            if(name)
                channel.name = name
            if(hidden)
                channel.hidden = hidden
            
            await ChannelRepository.save(channel)
            return res.status(200).send(channel)
        }catch(error){
            return res.status(400).send('Error')
        }
    }
    return res.status(400).send('Wrong arguments')
})


router.get('/message/:channel_id', isAuth, async (req:IRequest, res:Response) => {

    const channel_id = Number(req.params.channel_id)
    if(channel_id == NaN)
        return res.status(400).send('Error server not found')
    const channel = await ChannelRepository.findOneBy({id: channel_id})
    if(channel == null)
        return res.status(400).send('Error server not found')

    try{
        const message_list = await ChannelMessageRepository.findBy({channel: channel})


        return res.status(200).send(message_list)
    }catch(error){
        return res.status(400).send(error)
    }
})


router.post('/create_message/', isAuth, async (req:IRequest, res:Response) => {
    if(('content' in req.body && 'channel_id' in req.body)){
        
        const channel = await ChannelRepository.findOneBy({id: req.body.channel_id})
        const content = req.body.content
        const date = Date.now()

        if(!channel)
            return res.status(400).send('Error server not found')

        
        try{
            const channel_message:ChannelMessage = ChannelMessageRepository.create({
                channel : channel,
                content: content,
                send_time: date
            })

            await ChannelMessageRepository.save(channel_message)
            return res.status(200).send(channel_message)
        }
        catch(error){
            console.log(error)
            return res.status(400).send('Error')
        }
    }
})

router.put('/update_message/', isAuth, async (req:IRequest, res:Response) => {
    if(('content' in req.body && 'message_id' in req.body && 'chanel_id' in req.body)){
        
        const message = await ChannelMessageRepository.findOneBy({id: req.body.message_id})
        const content = req.body.content
        const date = Date.now()

        if(!message)
            return res.status(400).send('Error server not found')

        
        try{
            message.content = content
            message.send_time = date

            await ChannelMessageRepository.save(message)
            return res.status(200).send(message)
        }
        catch(error){
            console.log(error)
            return res.status(400).send('Error')
        }
    }
})



module.exports = router;

router.delete('/delete_message/:message_id', isAuth, async (req:IRequest, res:Response) => {
    const message_id = Number(req.params.message_id)
    if(message_id == NaN)
        return res.status(400).send('Error server not found')
    const message = await ChannelRepository.findOneBy({id: message_id})
    if(message == null)
        return res.status(400).send('Error server not found')

    try{
        await ChannelMessageRepository.delete(message_id)

        return res.status(200).send(message)
    }catch(error){
        return res.status(400).send(error)
    }
})