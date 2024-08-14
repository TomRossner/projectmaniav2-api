import { Router } from "express";
import validateResource from "../middlewares/validateResource.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { createTaskHandler, deleteTaskHandler, updateTaskHandler } from "../controllers/tasks.controller.js";

const TasksRouter = Router();

TasksRouter.post('/', validateResource(createTaskSchema), createTaskHandler);
TasksRouter.put('/:taskId', updateTaskHandler);
TasksRouter.delete('/:taskId', deleteTaskHandler);

export default TasksRouter;