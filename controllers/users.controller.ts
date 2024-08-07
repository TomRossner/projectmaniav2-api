import { Request, Response } from "express";
import { comparePasswords, hash } from "../utils/bcrypt.js";
import { UserDocument } from "../models/user.model.js";
import UserModel from "../models/user.model.js";
import { ExcludedFieldKeys, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS, USER_EXCLUDED_FIELDS } from "../utils/constants.js";
import { IUser } from "../utils/interfaces.js";
import { createUser, deleteUser, findUser, updateUser } from "../services/user.service.js";
import { CreateUserData } from "../schema/user.schema.js";
import omit from "lodash/omit.js";
import { findSessions } from "../services/session.service.js";

export async function createUserHandler(req: Request<{}, {}, CreateUserData['body']>, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user, ['password', '__v', '_id']));
    } catch (error: any) {
        console.error(error);
        return res.status(409).send(error.message)
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: SelectedFields<UserDocument, ExcludedFieldKeys>[] = await UserModel
            .find()
            .select<SelectedFields<UserDocument, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);
        
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching users'});
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;

        const user: SelectedFields<UserDocument, ExcludedFieldKeys> | null = await UserModel
            .findOne({ userId })
            .select<SelectedFields<UserDocument, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);

        if (!user) return res.status(400).send({error: 'UserModel not found'});
        
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching user using id'});
    }
}

const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const {email} = req.params;

        const user: SelectedFields<UserDocument, ExcludedFieldKeys> | null = await UserModel
            .findOne({ email })
            .select<SelectedFields<UserDocument, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);

        if (!user) return res.status(400).send({error: 'UserModel not found'});
        
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching user using email'});
    }
}

// const updateUser = async (req: Request, res: Response) => {
//     try {
//         const updatedUserData = req.body;
//         const {userId} = req.params;

//         await UserModel.updateOne({userId}, {
//             $set: {
//                 ...updatedUserData
//             }
//         });

//         const user = await UserModel.findOne({userId});

//         if (user) {
//             const token = user.generateAuthToken();

//             return res.status(200).send({token});
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed updating user'});
//     }
// }

export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;

        const user = await updateUser({userId}, req.body);

        if (!user) {
            return res.status(400).send({error: "Failed updating user"});
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed updating user"});
    }
}

export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;

        const user = await findUser({userId}, {withId: true});

        const deleted = await deleteUser(userId);

        if (!deleted) {
            return res.status(400).send({error: "Failed deleting user"});
        }

        const sessions = await findSessions({user: user._id});

        if (sessions.length) {
            console.log(sessions);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed deleting user"});
    }
}

// const deleteUser = async (req: Request, res: Response) => {
//     try {
//         const {userId} = req.params;

//         const user = await UserModel.findOneAndDelete({userId});

//         if (!user) {
//             return res.status(400).send({error: "Failed deleting user"})
//         }
        
//         return res.status(200).send('Successfully deleted user');
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed deleting user'});
//     }
// }

const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const {password, newPassword} = req.body;
        const {userId} = req.params;

        const user = await UserModel.findOne({userId});

        if (!user) return res.status(400).send({error: 'UserModel not found'});

        const dbPassword = user?.password as string;

        const isAllowed: boolean = await comparePasswords(password, dbPassword);

        if (!isAllowed) return res.status(401).send({error: 'Invalid password'});
        else {
            await user
                .set({
                    password: await hash(newPassword)
                })
                .save();

            res.status(200).send('Password successfully updated');
        }

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed updating password'});
    }
}

const getUsersByQuery = async (req: Request, res: Response) => {
    try {
        if (!req.query) {
            return res.status(200).send([]);
        }

        const {query} = req.query;

        const regex: RegExp = new RegExp(query as string, 'i');

        const users: SelectedFields<IUser, ExcludedFieldKeys>[] = await UserModel
            .find({$or: [
                { firstName: {$regex: regex} },
                { lastName: {$regex: regex} },
            ]})
            .lean()
            .select(DOCUMENT_EXCLUDED_FIELDS);

        if (!!users.length) {
            return res.status(200).send(users);
        }
        
        return res.status(200).send([]);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed getting users'});
    }
}

const getCurrentUser = async (req: Request, res: Response) => {
    return res.send(res.locals.user);
}

export {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateUserPassword,
    getUsersByQuery,
    getCurrentUser,
}