import express from 'express';
const router = express.Router();
import { Request, Response } from 'express';
import AppDataSource from '../../db/AppDataSource';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Role } from '../../entities/Role';
import { Server } from '../../entities/Server';
import jwt from 'jsonwebtoken';
import IRequest from '../../Interfaces/IRequest';
import { In } from 'typeorm';
import { ServerUser } from '../../entities/ServerUser';

import isAuth from '../../MiddleWares/isAuth';
import { Permission } from '../../entities/Permission';
import { ServerUserRole } from '../../entities/ServerUserRole';
import { RolePermission } from '../../entities/RolePermission';

const UserRepository = AppDataSource.getRepository(User);
const ServerRepository = AppDataSource.getRepository(Server);
const ServerUserRepository = AppDataSource.getRepository(ServerUser);
const RoleRepository = AppDataSource.getRepository(Role);
const PermissionRepository = AppDataSource.getRepository(Permission)
const serverUserRoleRepository = AppDataSource.getRepository(ServerUserRole)
const RolePermissionRepository = AppDataSource.getRepository(RolePermission)

router.get('/list_all', isAuth, async (req: IRequest, res: Response) => {
    try{
      const perm_list = await PermissionRepository.findBy({})
      return res.status(200).send(perm_list);
  
    }catch(error){
      console.log(error);
      res.status(401).send('Error');
    }
  })

export default router;