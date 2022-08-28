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

router.get('/list/:server_id', isAuth, async (req: IRequest, res: Response) => {
    const server_id = Number(req.params.server_id);
    try {
        const role_list = await RoleRepository.findBy({
            server: { id: server_id },
        });
        return res.status(200).send(role_list);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/create/', isAuth, async (req: IRequest, res: Response) => {
    const server_id = req.body.server_id
    if ('name' in req.body && 'server_id' in req.body) {
        const server = await ServerRepository.findOneBy({
            id: Number(req.body.server_id),
        });
        const name: string = req.body.name;

        if (!server) return res.status(400).send('Error server not found');

        try{
            const role = RoleRepository.create({
                name: name
            })
            await RoleRepository.save(role)

            if('permissions' in req.body){
                for(const permission_id of req.body.permissions){
                    const permission = await PermissionRepository.findOneBy({id: permission_id})
                    if(!permission)
                        continue
                    
                    const role_permisison = RolePermissionRepository.create({
                        role: role,
                        permission: permission
                    })
                    await RolePermissionRepository.save(role_permisison)
                }
            }
            
            if('users' in req.body){
                for(const user_id of req.body.users){
                    const server_user = await ServerUserRepository.findOneBy({user: user_id, server: server_id})
                    if(!server_user)
                        continue
                    
                    const server_role_user = serverUserRoleRepository.create({
                        user: server_user,
                        role: role
                    })
                    await serverUserRoleRepository.save(server_role_user)
                }
            }
            return res.status(200).send(role)
        }catch(error){
            return res.status(400).send('Error')
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.put('/update/', isAuth, async (req: IRequest, res: Response) => {
    if ('name' in req.body && 'role_id' in req.body) {
        const server = await ServerRepository.findOneBy({
            id: Number(req.body.server_id),
        });
        const name: string = req.body.name;

        if (!server) return res.status(400).send('Error server not found');

        try {
            const role = RoleRepository.create({
                name: name,
            });
            await RoleRepository.save(role);
            return res.status(200).send(role);
        } catch (error) {
            return res.status(400).send('Error');
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.delete('/delete/:role_id', isAuth, (req: IRequest, res: Response) => {
    const role_id = Number(req.params.server_id);
    if (role_id == NaN) return res.status(400).send('Error server not found');
    try {
        RoleRepository.delete(role_id).then((result) =>
            res
                .status(200)
                .send({ message: 'Role successfully deleted', result })
        );
    } catch (error) {
        return res.status(400).send(error);
    }
});


router.post('/add_role', isAuth,async (req: IRequest, res: Response) => {
    if ('role_id_list' in req.body && 'server_user_id' in req.body) {
        const role_id_list = req.body.role_id
        const server_user_id = req.body.server_user_id
        try{
            for(const role_id of role_id_list){
                const server_user_role = await serverUserRoleRepository.findBy({
                    role: {id: role_id},
                    user: {id: server_user_id}
                })
                if(server_user_role){
                    serverUserRoleRepository.delete(server_user_role[0].id)
                    continue
                }

                const role_user = serverUserRoleRepository.create({
                    role: {id: role_id},
                    user: {id: server_user_id}
                })

                await serverUserRoleRepository.save(role_user)
            }
            return res.status(200).send('')
        } catch(error){
            return res.status(400).send(error);
        }

    }
});

export default router;