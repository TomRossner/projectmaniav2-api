import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model.js";
import { signJwt, verifyJwt } from "../utils/jwt.utils.js";
import _ from "lodash";
import { findUser } from "./user.service.js";
import { ACCESS_TOKEN_TTL } from "../utils/constants.js";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({
        user: userId,
        userAgent
    });

    return session.toJSON();
}

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
    return await SessionModel.find(query).lean();
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
    return await SessionModel.findOneAndUpdate(query, update);
}

export const reIssueAccessToken = async ({refreshToken}: {refreshToken: string}) => {
    const {decoded} = verifyJwt(refreshToken, "Refresh token");

    if (!decoded || !decoded) {
        return false;
    }

    const session = await SessionModel.findById(_.get(decoded, "session"));
    console.log("Session: ", session);

    if (!session || !session.valid) {
        return false;
    }

    const user = await findUser({_id: new mongoose.Types.ObjectId(session.user)});
    console.log("User: ", user);

    if (!user) {
        return false;
    }

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    return accessToken;
}