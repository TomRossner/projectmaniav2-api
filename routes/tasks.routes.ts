import { Router } from "express";
import validate from "../middlewares/validateResource.js";
import { createTaskSchema } from "../schema/task.schema.js";
import { createTaskHandler, deleteTaskHandler, updateTaskHandler } from "../controllers/tasks.controller.js";

const TasksRouter = Router();

TasksRouter.post('/', validate(createTaskSchema), createTaskHandler);
TasksRouter.put('/:taskId', updateTaskHandler);
TasksRouter.delete('/:taskId', deleteTaskHandler);

export default TasksRouter;