var express = require('express');

var router = express.Router();
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import AppDataSource from '../db/AppDataSource';
import IRequest from '../Interfaces/IRequest';

const userRepository = AppDataSource.getRepository(User);

import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';

interface IJWT extends jwt.JwtPayload {
    id?: string;
}

// Middleware : sert à intercepter la requête : Pour auth : on va regarder si on a un token et s'il est valide on autorise la requête suivante, sinon on envoie une erreur

module.exports = async function (
    req: IRequest,
    res: Response,
    next: NextFunction
) {
    // On récupère le token
    const token = req.headers?.access_token as string | undefined;

    // Si on a pas de token, on envoie une erreur.

    if (!token) {
        return res.status(401).json({ err: 'Forbidden' });
    }

    try {
        // On décode le token pour récupérer l'utilisateur
        const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN || '');

        // On ajoute l'utilisateur à la requête
        const user_id: string = decoded.user.id;
        const user: any = await userRepository.findOneBy({
            id: Number(user_id),
        });

        if (!user) return res.status(401).json({ err: 'User does not exist' });

        req.id = Number(user_id);

        // On laisse la requête originale continuer
        next();
    } catch (e) {
        return res.status(401).json({ err: 'fail' });
    }
};
