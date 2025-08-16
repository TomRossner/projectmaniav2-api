import { Request, Response } from "express";
import { createTask, deleteTask, findTask, updateTask } from "../services/task.service.js";
import { createFileName, processImage, uploadImageToS3 } from "../aws/aws.utils.js";

export const getTaskHandler = async (req: Request, res: Response) => {
    try {
        const task = await findTask({taskId: req.params.taskId as string});

        if (!task) {
            throw new Error("Task not found");
        }
        
        return res.status(200).send(task);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Task not found"});
    }
}

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

        const found = await findTask({taskId});

        if (!found) {
            throw new Error("Failed updating task");
        }

        const isNewImgSrc = found.thumbnailSrc !== req.body.thumbnailSrc;
        const imgSrc = req.body.thumbnailSrc.length && isNewImgSrc ? await processImage(req.body.thumbnailSrc, 'task') : "";

        const task = await updateTask({taskId}, {
            ...req.body,
            thumbnailSrc: isNewImgSrc
                ? imgSrc
                : found.thumbnailSrc,
        });

        console.log(task)

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