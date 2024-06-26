import { Router } from "express";
import {
    deleteUser,
    getAllUsers,
    getUserByEmail,
    getUserById,
    getUsersByQuery,
    updateUser,
    updateUserPassword
} from "../controllers/users.controllers.js";
import { VERIFY_AUTH } from "../middlewares/auth.middleware.js";

const UsersRouter = Router();

UsersRouter.get('/', getAllUsers);
UsersRouter.get('/id/:userId', getUserById);
UsersRouter.get('/email/:email', getUserByEmail);
UsersRouter.put('/:userId', VERIFY_AUTH, updateUser);
UsersRouter.delete('/:userId', VERIFY_AUTH, deleteUser);
UsersRouter.put('/:userId/new-password', VERIFY_AUTH, updateUserPassword);
UsersRouter.post('/', VERIFY_AUTH, getUsersByQuery);

export default UsersRouter;