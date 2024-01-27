import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

config();

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const VERIFY_AUTH = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.header('x-auth-token');
    
    if (!token) return res.status(401).send({error: 'Access denied. Invalid token'});

    try {
        const payload: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        req.user = payload;

        next();
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed verifying token');
    }
}

export {
    VERIFY_AUTH
};