import { Request, Response } from "express";
import { comparePasswords, hash } from "../utils/bcrypt.js";
import { NewUserData } from "../utils/interfaces.js";
import { UserDocument } from "../models/user.model.js";
import UserModel from "../models/user.model.js";
import { validateUserData } from "../utils/regexp.js";

const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        
        const user = await UserModel.findOne({email});

        if (!user) return res.status(400).send({error: 'Invalid email or password'});

        const dbPassword = user.password as string;

        const isValid: boolean = await comparePasswords(password, dbPassword);

        if (isValid) {
            // Generate auth token
            const token = user.generateAuthToken();

            return res.status(200).send({token});
        }

        res.status(400).send({error: 'Invalid email or password'});


    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Invalid email or password'});
    }
}

const signUp = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const isAlreadyRegistered = await UserModel.findOne({email});

        if (isAlreadyRegistered) return res.status(400).send({error: 'UserModel already registered'});
        
        const newUserData: NewUserData = {
            firstName,
            lastName,
            email,
            password
        };

        const isValid: boolean = validateUserData(newUserData);

        if (!isValid) return res.status(400).send({error: 'Invalid data'});

        // await createNewUser(newUserData);

        return res.status(200).send('Successfully created user');

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed signing up'});
    }
}

const googleSignIn = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
}

export {
    login,
    signUp,
    googleSignIn
}