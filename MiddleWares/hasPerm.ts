var express = require('express');

var router = express.Router();
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import AppDataSource from '../db/AppDataSource';
import IRequest from '../Interfaces/IRequest';
import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { ServerUserRole } from '../entities/ServerUserRole';
import { ServerUser } from '../entities/ServerUser';
import { Server } from '../entities/Server';
import { createQueryBuilder } from 'typeorm';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';

const userRepository = AppDataSource.getRepository(User);
const serverRepository = AppDataSource.getRepository(Server)
const serverUserRepository = AppDataSource.getRepository(ServerUser)
const serverUserRoleRepository = AppDataSource.getRepository(ServerUserRole)
const roleRepository = AppDataSource.getRepository(Role)
const rolePermissionRepository = AppDataSource.getRepository(RolePermission)
const permissionRepository = AppDataSource.getRepository(Permission)

interface IJWT extends jwt.JwtPayload {
    id?: string;
}

// Middleware : sert à intercepter la requête : Pour auth : on va regarder si on a un token et s'il est valide on autorise la requête suivante, sinon on envoie une erreur



module.exports = async function (
    req: IRequest,
    res: Response,
    next: NextFunction,
) {
    const action = req.action
    const user_id = req.id
    const server_id = req.server_id

    const permission_list = await permissionRepository.find({
        relations: ["roles", "roles.role" , "roles.role.users" , "roles.role.users.user", "roles.role.users.user.user", "roles.role.users.user.server"],
        where:{
            roles:{
                role:{
                    users:{
                        user:{
                            user:{
                                id: user_id
                            },
                            server:{
                                id: server_id
                            }
                        }
                    }
                }
            }
        }
    })

    console.log(permission_list)
    
    for(const permission of permission_list){
        console.log(permission)
        if(permission.id == action){
            next()
            break
        }
    }

    next()
};
