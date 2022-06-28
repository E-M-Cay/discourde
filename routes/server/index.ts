var express = require('express');
var router = express.Router();
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Server } from '../../entities/Server';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest'
import { In } from "typeorm";

const isAuth = require('../../MiddleWares/isAuth')

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server)

router.get('/list', isAuth,  async (req:IRequest, res:Response) => {

    const user = await UserRepository.findOne({
        where:{
            id: req.id
        },
        relations: ['servers']
    })
    if(!user)
        return res.send('User not found')
    
    const server_id_list = user.servers
    const server_object_list = await ServerRepository.findBy({
        id: In(server_id_list)
    })
    //res.send(JSON.)
    return res.send(server_object_list)
})

router.post('/create_server', isAuth, async (req:IRequest, res:Response) => {
    if('name' in req.body && 'main_img' in req.body){
        const name:string = req.body.name
        const main_img:string = req.body.main_img
        try{
            const server:Server = ServerRepository.create({
                'name': name,
                'main_img': main_img
            })
    
            ServerRepository.save(server)
            return res.status(200).send(server)
        }catch(error){
            return res.status(400).send('Error')
        }
    }
    return res.status(400).send('Wrong arguments')
    
})

router.post('/update_server', isAuth, async (req:IRequest, res:Response) => {
    if(('main_img' in req.body || 'logo' in req.body) && 'server_id' in req.body){
        const server = await ServerRepository.findOneBy({id: Number(req.body.server_id)})
        const logo:string = ('logo' in req.body) ? req.body.name : null
        const main_img:string = ('main_img' in req.body) ? req.body.main_img : null

        if(!server)
            return res.status(400).send('Error server not found')

        try{
            if(logo)
                server.logo = logo
            if(main_img)
                server.main_img = main_img
            
            ServerRepository.save(server)
            return res.status(200).send(server)
        }catch(error){
            return res.status(400).send('Error')
        }
    }
    return res.status(400).send('Wrong arguments')
})


module.exports = router;