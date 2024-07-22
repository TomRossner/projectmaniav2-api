import { Router } from "express";
import {
    createUserHandler,
    deleteUser,
    deleteUserHandler,
    getAllUsers,
    getCurrentUser,
    getUserByEmail,
    getUserById,
    getUsersByQuery,
    updateUser,
    updateUserHandler,
    updateUserPassword
} from "../controllers/users.controller.js";
import { VERIFY_AUTH } from "../middlewares/auth.middleware.js";
import validateResource from "../middlewares/validateResource.js";
import { createUserSchema } from "../schema/user.schema.js";
import requireUser from "../middlewares/requireUser.js";

const UsersRouter = Router();

UsersRouter.post('/', validateResource(createUserSchema), createUserHandler);
UsersRouter.get('/', requireUser, getUsersByQuery);
// UsersRouter.get('/id/:userId', getUserById);
// UsersRouter.get('/email/:email', getUserByEmail);
UsersRouter.put('/:userId', requireUser, updateUserHandler);
UsersRouter.delete('/:userId', requireUser, deleteUserHandler);
// UsersRouter.delete('/:userId', VERIFY_AUTH, deleteUser);
// UsersRouter.put('/:userId/new-password', VERIFY_AUTH, updateUserPassword);
// UsersRouter.post('/', VERIFY_AUTH, getUsersByQuery);
UsersRouter.get('/me', requireUser, getCurrentUser);

export default UsersRouter;