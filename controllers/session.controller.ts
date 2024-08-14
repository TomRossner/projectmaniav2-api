import { Request, Response } from "express";
import { findUser, validatePassword } from "../services/user.service.js";
import { UserCredentials } from "../utils/types.js";

// export const createUserSessionHandler = async (req: Request, res: Response) => {
//     const user = await validatePassword(req.body);
    
//     if (!user) {
//         console.log("Invalid, didn't find user");
//         return res.status(401).send("Invalid email or password");
//     }

//     const session = await createSession(user._id, req.get("user-agent") || "");

//     const accessToken = signJwt(
//         { ...user, session: session._id },
//         { expiresIn: ACCESS_TOKEN_TTL }
//     );

//     const refreshToken = signJwt(
//         { ...user, session: session._id },
//         { expiresIn: REFRESH_TOKEN_TTL }
//     );

//     res.cookie("accessToken", accessToken, {
//         maxAge: 900000, // 15 mins in ms
//         httpOnly: true, // only accessible through http and not through js
//         secure: false, // for https
//         domain: 'localhost', // for dev environment
//         path: '/',
//         sameSite: 'strict'
//     })

//     res.cookie("refreshToken", refreshToken, {
//         maxAge: 3.154e10, // 1y in ms
//         httpOnly: true, // only accessible through http and not through js
//         secure: false, // for https
//         domain: 'localhost', // for dev environment
//         path: '/',
//         sameSite: 'strict',
//     })

//     return res.send({
//         accessToken,
//         refreshToken
//     });
// }

// export const getUserSessionsHandler = async (req: Request, res: Response) => {
//     const userId = res.locals.user._id;

//     const sessions = await findSessions({user: userId, valid: true});

//     return res.send(sessions);
// }

// export const deleteSessionHandler = async (req: Request, res: Response) => {
//     const sessionId = res.locals.user.session;

//     await updateSession({_id: sessionId}, {valid: false});
    
//     return res.send({
//         accessToken: null,
//         refreshToken: null,
//     });
// }

export const createUserSessionHandler = async (req: Request, res: Response) => {
    try {
        const {
            body: {
                email,
            }
        } = req;

        console.log("Session id: ", req.session.id);

        const user = await findUser({email});
    
        if (!user) {
            throw new Error("Invalid email or password");
        }

        req.user = user;

        return res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(401).send({error: "Invalid email or password"});
    }
}

export const getUserSessionHandler = async (req: Request, res: Response) => {
    try {
        return res.send(req.user);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
    try {
        req.session.destroy((err) => {
            req.user = undefined;
            return res.sendStatus(200);
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}