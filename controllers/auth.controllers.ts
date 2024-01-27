import { Request, Response } from "express";
import { comparePasswords, hash } from "../utils/bcrypt.js";
import { INewUser } from "../utils/interfaces.js";
import { User } from "../models/user.model.js";
import { validateUserData } from "../utils/regexp.js";

const login = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email});

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

const signUp = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {firstName, lastName, email, password} = req.body;

        const isAlreadyRegistered = await User.findOne({email});

        if (isAlreadyRegistered) return res.status(400).send({error: 'User already registered'});
        
        const newUserData: INewUser = {
            firstName,
            lastName,
            email,
            password
        }

        const isValid: boolean = validateUserData(newUserData);

        if (!isValid) return res.status(400).send({error: 'Invalid data'});

        await createNewUser(newUserData);

        return res.status(200).send('Successfully created user');

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed signing up'});
    }
}

const googleSignIn = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        console.log(req.body);
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
}

const createNewUser = async (userData: INewUser): Promise<any> => {
    return await new User({
        ...userData,
        password: await hash(userData.password)
    }).save();
}

export {
    login,
    signUp,
    googleSignIn
}