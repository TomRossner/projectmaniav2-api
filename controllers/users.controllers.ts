import { Request, Response } from "express"
import { comparePasswords, hash } from "../utils/bcrypt.js";
import { IUserDoc, User } from "../models/user.model.js";
import { ExcludedFieldKeys, ExcludedFields, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS, USER_EXCLUDED_FIELDS } from "../utils/constants.js";
import { IUser } from "../utils/interfaces.js";

const getAllUsers = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const users: SelectedFields<IUserDoc, ExcludedFieldKeys>[] = await User
            .find()
            .select<SelectedFields<IUserDoc, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);
        
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching users'});
    }
}

const getUserById = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {userId} = req.params;

        const user: SelectedFields<IUserDoc, ExcludedFieldKeys> | null = await User
            .findOne({ userId })
            .select<SelectedFields<IUserDoc, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);

        if (!user) return res.status(400).send({error: 'User not found'});
        
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching user using id'});
    }
}

const getUserByEmail = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {email} = req.params;

        const user: SelectedFields<IUserDoc, ExcludedFieldKeys> | null = await User
            .findOne({ email })
            .select<SelectedFields<IUserDoc, ExcludedFieldKeys>>(USER_EXCLUDED_FIELDS);

        if (!user) return res.status(400).send({error: 'User not found'});
        
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching user using email'});
    }
}

const updateUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const updatedUserData = req.body;
        const {userId} = req.params;

        await User.updateOne({userId}, {
            $set: {
                ...updatedUserData
            }
        });

        const user = await User.findOne({userId});

        if (user) {
            const token = user.generateAuthToken();

            return res.status(200).send({token});
        }

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed updating user'});
    }
}

const deleteUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {userId} = req.body;

        await User.findOneAndDelete({userId});

        res.status(200).send('Successfully deleted user');

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed deleting user'});
    }
}

const updateUserPassword = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {password, newPassword} = req.body;
        const {userId} = req.params;

        const user = await User.findOne({userId});

        if (!user) return res.status(400).send({error: 'User not found'});

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

const getUsersByQuery = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {query} = req.body;

        const regex: RegExp = new RegExp(query, 'i');

        const users: SelectedFields<IUser, ExcludedFieldKeys>[] = await User
            .find({$or: [
                { firstName: {$regex: regex} },
                { lastName: {$regex: regex} },
            ]})
            .select(DOCUMENT_EXCLUDED_FIELDS);

        if (!!users.length) {
            return res.status(200).send(users);
        } else return res.status(200).send([]);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed getting users'});
    }
}

export {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateUserPassword,
    getUsersByQuery
}