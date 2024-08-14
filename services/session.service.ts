// import { Request, Response } from "express";
// import { validatePassword } from "./user.service.js";
// import { UserCredentials } from "../utils/types.js";

// export const createUserSessionHandler = async (req: Request, res: Response) => {
//     try {
//         const {
//             body: {
//                 email,
//                 password
//             }
//         } = req;

//         console.log("Session id: ", req.session.id);
        
//         const credentials: UserCredentials = {
//             email,
//             password
//         }

//         const user = await validatePassword(credentials);
    
//         if (!user) {
//             return res.status(401).send("Invalid email or password");
//         }

//         req.session.user = user;

//         return res.status(200).send(user);
//     } catch (error) {
//         console.error(error);
//         res.status(401).send({error: "Wrong credentials"});
//     }
// }

// export const deleteSessionHandler = async (req: Request, res: Response) => {
//     try {
//         req.session.destroy((err) => {
//             return res.sendStatus(200);
//         });

//         return res.sendStatus(400);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(400);
//     }
// }