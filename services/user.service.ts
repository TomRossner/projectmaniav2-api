import _ from "lodash";
import UserModel, { UserDocument } from "../models/user.model.js";
import { FilterQuery } from "mongoose";
import { UpdateFilter } from "mongodb";

export async function createUser(userData: Pick<UserDocument, "firstName" | "lastName" | "password" | "email">): Promise<UserDocument> {
    try {
        return (await new UserModel(userData).save()).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function validatePassword({email, password}: {email: string, password: string}) {
    const user = await UserModel.findOne({email});

    if (!user) {
        return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return false;
    }

    return _.omit(user.toJSON(), ["__v", "password"]) as UserDocument;
}

export const findUser = async (query: FilterQuery<UserDocument>, options?: {withId?: boolean}) => {
    const user = await UserModel.findOne(query).lean();

    return user
        ? _.omit(user, [
            !options?.withId && "_id",
            "__v",
            "password"
        ]) : null;
}

export const updateUser = async (query: FilterQuery<UserDocument>, update: UpdateFilter<UserDocument>) => {
    return await UserModel.findOneAndUpdate(query, update, {new: true}).lean();
}

export const deleteUser = async (userId: string) => {
    return await UserModel.findOneAndDelete({userId});
}