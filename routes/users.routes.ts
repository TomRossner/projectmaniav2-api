import { Router } from "express";
import {
    createUserHandler,
    deleteUserHandler,
    getCurrentUser,
    getUserById,
    getUsersByQuery,
    updateUserHandler,
} from "../controllers/users.controller.js";
import validateResource from "../middlewares/validateResource.js";
import { createUserSchema } from "../schemas/user.schema.js";
import requireUser from "../middlewares/requireUser.js";

const UsersRouter = Router();

UsersRouter.post('/', validateResource(createUserSchema), createUserHandler);
UsersRouter.get('/', requireUser, getUsersByQuery);
UsersRouter.post('/:userId', requireUser, getUserById);
UsersRouter.put('/:userId', requireUser, updateUserHandler);
UsersRouter.delete('/:userId', requireUser, deleteUserHandler);
UsersRouter.get('/me', requireUser, getCurrentUser);

export default UsersRouter;