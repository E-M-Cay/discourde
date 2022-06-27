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

module.exports = router;