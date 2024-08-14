import { FilterQuery } from "mongoose";
import GoogleUserModel, { GoogleUserDocument } from "../models/google_user.model.js";
import { UpdateFilter } from "mongodb";
import _ from "lodash";

export type NewGoogleUserData = Pick<GoogleUserDocument, "firstName" | "lastName" | "email">;

export const createGoogleUser = async (userData: NewGoogleUserData) => {
    try {
        return (await GoogleUserModel.create(userData)).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateGoogleUser = async (query: FilterQuery<GoogleUserDocument>, update: UpdateFilter<GoogleUserDocument>) => {
    return await GoogleUserModel.findOneAndUpdate(query, update, {new: true}).lean();
}

export const deleteGoogleUser = async (userId: string) => {
    return await GoogleUserModel.findOneAndDelete({userId});
}

export const findGoogleUser = async (query: FilterQuery<GoogleUserDocument>, options?: {withId?: boolean}) => {
    const user = await GoogleUserModel.findOne(query).lean();

    return user
        ? _.omit(user, [
            !options?.withId && "_id",
            "__v",
            "password"
        ]) : null;
}