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
                name: name,
                server: server
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
    if ('name' in req.body && 'role_id' in req.body && 'permission_list' in req.body) {
        const role_id = Number(req.body.role_id)
        const permission_id_list = req.body.permission_list
        const name = req.body.name



        if(role_id == NaN)
            return res.status(400).send('error args')


        const role = await RoleRepository.findOneBy({id: role_id})

        if(!role)
            return res.status(400).send('error args')

        try {
            for(const perm_id of [1,2,3,4,5,6,7]){
                const role_permission: any = await RolePermissionRepository.findOneBy({
                    role: {id: role_id},
                    permission: {id: perm_id}
                })


                if(role_permission && !permission_id_list.includes(perm_id)){
                    await RolePermissionRepository.delete(role_permission.id)
                    continue
                }

                if(!role_permission && !permission_id_list.includes(perm_id))
                    continue
                
                const permission_obj = await PermissionRepository.findOneBy({id: perm_id})

                if(!role || !permission_obj){
                    return res.status(400).send({'message': 'error role or permobj'});
                }
                
                const role_perm = RolePermissionRepository.create({
                    role: role,
                    permission: permission_obj
                })

                await RolePermissionRepository.save(role_perm)
            }

            if(name != role.name){
                role.name = name
                await RoleRepository.save(role)
            }
            return res.status(200).send(role);
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(400).send('Wrong arguments');
});

router.delete('/delete/:role_id', isAuth, async (req: IRequest, res: Response) => {
    const role_id = Number(req.params.role_id);
    if (role_id == NaN) return res.status(400).send('Error server not found');
    try {
        await RoleRepository.delete(role_id);
        return res.status(200)
    } catch (error) {
        return res.status(400).send(error);
    }
});


router.post('/add_role/', isAuth,async (req: IRequest, res: Response) => {
    if ('role_id_list' in req.body && 'server_user_id' in req.body && 'role_id_initial_list') {
        const role_id_list = req.body.role_id_list
        const server_user_id = req.body.server_user_id
        const role_id_initial_list = req.body.role_id_initial_list
        try{
            for(const role_id of role_id_initial_list){

                const server_user_role = await serverUserRoleRepository.findOneBy({
                    role: {id: role_id},
                    user: {id: server_user_id}
                })
                if(server_user_role && !role_id_list.includes(role_id)){
                    serverUserRoleRepository.delete(server_user_role.id)
                    continue
                }

                if(!server_user_role && !role_id_list.includes(role_id))
                    continue

                const role = await RoleRepository.findOneBy({id: role_id})
                const server_user = await ServerUserRepository.findOneBy({id: server_user_id})
                if(!role || !server_user)
                    return res.status(400).send("role or server_user not found");
                
                const role_user = serverUserRoleRepository.create({
                    role: role,
                    user: server_user
                })
                await serverUserRoleRepository.save(role_user)
            }
            return res.status(200).send('')
        } catch(error){
            return res.status(400).send(error);
        }

    }
});

router.get('/role_list/:server_user_id', isAuth, async (req: IRequest, res: Response) => {
    let tab = []
    const server_user_id = Number(req.params.server_user_id);
    try{
        const server_user_role_list: ServerUserRole[] = await serverUserRoleRepository.find({
            relations: ['role'],
            where: {user: {id: server_user_id}}
    })

        let role_id_list = []
        for(const obj of server_user_role_list){
            role_id_list.push(obj.role.id)
        }
        return res.status(200).send({role_id_list})
    } catch(error){
        return res.status(400).send(error);
    }
   

});

router.get('/list_all', async (req: IRequest, res: Response) => {
    try{
      const user_list = await UserRepository.find()
      const tab_username = []
      for(const user of user_list){
        console.log(user)
        tab_username.push(user.username)
      }
  
      return res.status(200).send(tab_username);

    }catch(error){
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.get('/permission/:role_id', async (req: IRequest, res: Response) => {
    const role_id = Number(req.params.role_id);

    if(role_id == NaN)
        return res.status(400).send('no role found')

    try{
        let tab_id = []
        const permission_list =  await RolePermissionRepository.find({
            relations: ['permission'],
            where: {
                role: {id: role_id}
            }
        })

        for(const sperm of permission_list){
            tab_id.push(sperm.permission.id)
        }


        return res.status(200).send(tab_id);
    }catch(error){
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.get('/list/:server_name', async (req: IRequest, res: Response) => {
    const server_name = req.params.server_name;
    let tab_name = []
    try{

        const server: any = await ServerRepository.findOneBy({
            name: server_name
        })

        if(!server)
        res.status(400).send('No server found');


        const list_role = await RoleRepository.findBy({server: server})

        for(const role of list_role){
            tab_name.push(role.name)
        }


        return res.status(200).send(tab_name);
    }catch(error){
      console.log(error);
      res.status(400).send(error);
    }
  });


export default router;