import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { verifyJwt } from "../utils/jwt.utils.js";
import { reIssueAccessToken } from "../services/session.service.js";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = _.get(req, "cookies.accessToken") || _.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = _.get(req, "cookies.refreshToken");

    if (!accessToken && !refreshToken) {
        return next();
    }

    const {decoded, expired} = verifyJwt(accessToken, "Access token");

    // console.log("Access token", verifyJwt(accessToken))
    // console.log(verifyJwt(refreshToken))

    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    if ((expired && refreshToken) || (!accessToken && refreshToken)) {
        const newAccessToken = await reIssueAccessToken({refreshToken});

        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);

            res.cookie("accessToken", newAccessToken, {
                maxAge: 900000, // 15 mins in ms
                httpOnly: true, // only accessible through http and not through js
                secure: false, // for https
                domain: 'localhost', // for dev environment
                path: '/',
                sameSite: 'strict',
            });
            
            const result = verifyJwt(newAccessToken, "New access token");
            
            res.locals.user = result.decoded;
            
            return next();
        }

        return next();
    }

    return next();
}

export default deserializeUser;