import { Request, Response } from "express";
import { validatePassword } from "../services/user.service.js";
import { createSession, findSessions, updateSession } from "../services/session.service.js";
import { signJwt } from "../utils/jwt.utils.js";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../utils/constants.js";

export const createUserSessionHandler = async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);

    
    if (!user) {
        console.log("invalid")
        return res.status(401).send("Invalid email or password");
    }

    const session = await createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: REFRESH_TOKEN_TTL }
    );

    res.cookie("accessToken", accessToken, {
        maxAge: 900000, // 15 mins in ms
        httpOnly: true, // only accessible through http and not through js
        secure: false, // for https
        domain: 'localhost', // for dev environment
        path: '/',
        sameSite: 'strict'
    })

    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1y in ms
        httpOnly: true, // only accessible through http and not through js
        secure: false, // for https
        domain: 'localhost', // for dev environment
        path: '/',
        sameSite: 'strict',
    })

    return res.send({
        accessToken,
        refreshToken
    });
}

export const getUserSessionsHandler = async (req: Request, res: Response) => {
    const userId = res.locals.user._id;

    const sessions = await findSessions({user: userId, valid: true});

    return res.send(sessions);
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
    const sessionId = res.locals.user.session;

    await updateSession({_id: sessionId}, {valid: false});
    
    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}