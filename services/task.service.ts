import { FilterQuery, UpdateQuery } from "mongoose";
import { TaskDocument, TaskModel } from "../models/task.model.js";
import _ from "lodash";
import { ITask } from "../utils/interfaces.js";

export const createTask = async (newTaskData: Omit<TaskDocument, "taskId" | "createdAt" | "updatedAt" | "_id" | "__v">) => {
    try {
        return (await new TaskModel(newTaskData).save()).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateTasks = async (tasks: ITask[]) => {
    try {
        for (const task of tasks) {
            const {taskId} = task;

            return await updateTask({taskId}, task);
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const updateTask = async (query: FilterQuery<TaskDocument>, update: UpdateQuery<TaskDocument>) => {
    return await TaskModel.findOneAndUpdate(query, _.omit(update, "_id"), {new: true});
}

export const deleteTask = async (taskId: string) => {
    return await TaskModel.findOneAndDelete({taskId});
}
