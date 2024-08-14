import { Request, Response } from "express";
import { createTask, deleteTask, updateTask } from "../services/task.service.js";

export const createTaskHandler = async (req: Request, res: Response) => {
    try {
        const task = await createTask(req.body);

        if (!task) {
            throw new Error("Failed creating task");
        }
        
        return res.status(201).send(task);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed creating task"});
    }
}

export const updateTaskHandler = async (req: Request, res: Response) => {
    try {
        const {taskId} = req.params;
        
        const task = await updateTask({taskId}, req.body);

        if (!task) {
            throw new Error("Failed updating task");
        }

        return res.status(200).send(task);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed updating task"});
    }
}

export const deleteTaskHandler = async (req: Request, res: Response) => {
    try {
        const {taskId} = req.params;

        const task = await deleteTask(taskId);

        if (!task) {
            throw new Error("Failed deleting task");
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed deleting task"});
    }
}