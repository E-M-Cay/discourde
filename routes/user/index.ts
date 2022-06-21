var express = require('express');
var router = express.Router();
import {Request, Response} from "express"
import AppDataSource from "../../db/AppDataSource"
const bcrypt = require('bcrypt');
import {User} from "../../entities/User"

const userRepository = AppDataSource.getRepository(User)


router.get('/login', async (req: Request, res: Response) => {
    if("username" in req.body && "password" in req.body){
        const email:string = req.body.email
        const password:string = req.body.password
        
        const user = await userRepository.findOneBy({
            email: email
        })

        if(!user){
            res.send('Error user not found')
            return 
        }

        if(bcrypt.compare(password, user.password)){
            res.send('Succes')
        }

    }
    res.send(req.body)
});

router.post('/register',async (req: Request, res: Response) =>{

    if("username" in req.body && "email" in req.body && "password" in req.body){
        const email:string = req.body.email
        const existing_user = await userRepository.findOneBy({email: email})
        if(existing_user){
            return res.status(400).send('User already exist')
        }

        const password:string = req.body.password
        const username:string = req.body.username

        const date = Date.now()

        userRepository.create({
            username: username,
            email: email,
            password: password,
            join_date: date
        })
    }
  
});

router.get('/home', (req:Request, res:Response) => {
    res.send('Hello fdp')
});
 
module.exports = router