import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserDocument } from "../models/user.model.js";
import { Session } from "express-session";

interface PassportSession extends Session{
    passport?: {
        user?: UserDocument;
    };
}

interface SessionRequest extends Request {
    session: PassportSession;
    user?: Express.User;
}

const requireUser: RequestHandler = (req: SessionRequest, res: Response, next: NextFunction) => {
    
    if (!req.session.passport?.user) {
        return res.sendStatus(401);
    }
    
    req.user = req.session.passport?.user;

    return next();
} 

export default requireUser;