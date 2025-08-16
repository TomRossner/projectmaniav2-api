import { FilterQuery, UpdateQuery } from "mongoose";
import { TaskDocument, TaskModel } from "../models/task.model.js";
import _ from "lodash";
import { ITask } from "../utils/interfaces.js";
import { processImage } from "../aws/aws.utils.js";

export const createTask = async (newTaskData: Omit<TaskDocument, "taskId" | "createdAt" | "updatedAt" | "_id" | "__v">) => {
    try {
        return (await new TaskModel(newTaskData).save()).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const getTasks = async (userId: string, stageId: string) => {
    return await TaskModel.find({"currentStage.stageId": stageId}).lean();
}

 // This function would be used to find tasks based on a query
 export const findTasks = async (query: FilterQuery<TaskDocument>) => {
    return await TaskModel.find(query).lean();
};

export const findTask = async (query: FilterQuery<TaskDocument>) => {
    return await TaskModel.findOne(query).lean();
}

export const updateTasks = async (tasks: ITask[]) => {
    const notFound = []
    try {
        for (const task of tasks) {
            const {taskId} = task;

            const found = await findTask({taskId});

            if (!found) {
                notFound.push(task.title);
                continue;
            }

            const isNewImgSrc = !!task.thumbnailSrc?.length && (found.thumbnailSrc !== task.thumbnailSrc);
            const imgSrc = task.thumbnailSrc?.length ? await processImage(task.thumbnailSrc, 'task') : "";
            
            await updateTask({taskId}, {
                ...task,
                thumbnailSrc: isNewImgSrc
                    ? imgSrc
                    : found.thumbnailSrc,
            });
        }
        console.log(notFound)
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const updateTask = async (query: FilterQuery<TaskDocument>, update: UpdateQuery<TaskDocument>) => {
    const updatedUpdate = {
        ..._.omit(update, ["_id", "taskId", "createdAt", "createdBy"]),
        updatedAt: new Date(),
    }

    return await TaskModel.findOneAndUpdate(query, updatedUpdate, {new: true}).lean();
}

export const deleteTask = async (taskId: string) => {
    return await TaskModel.findOneAndDelete({taskId});
}
