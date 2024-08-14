import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";

config();

export const regenerateSession = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated() && req.session.user) {
        req.session.regenerate(err => {
            console.log("Regenerating session...")
            if (err) {
                console.error(err);
                return next(err);
            }

            return next();
        });
    }

    next();
}