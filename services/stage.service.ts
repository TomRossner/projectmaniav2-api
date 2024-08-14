import { FilterQuery, UpdateQuery } from "mongoose";
import { StageDocument, StageModel } from "../models/stage.model.js";
import _ from "lodash";
import { IStage } from "../utils/interfaces.js";
import { deleteTask, updateTasks } from "./task.service.js";

export const createStage = async (newStageData: Pick<StageDocument, "title" | "tasks" | "createdBy" | "projectId" | "lastUpdatedBy">) => {
    try {
        return (await new StageModel(newStageData).save()).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateStages = async (stages: IStage[]) => {
    try {
        for (const stage of stages) {
            const {stageId, tasks} = stage;

            if (tasks.length) await updateTasks(tasks);

            return await updateStage({stageId}, stage);
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const updateStage = async (query: FilterQuery<StageDocument>, update: UpdateQuery<StageDocument>) => {
    return await StageModel.findOneAndUpdate(query, _.omit(update, "_id"), {new: true}).lean();
}

export const findStage = async (stageId: string) => {
    return await StageModel.findOne({stageId}).lean();
}

export const deleteStage = async (stageId: string) => {
    const stage = await findStage(stageId);

    if (stage?.tasks.length) {
        for (const task of stage.tasks) {
            await deleteTask(task.taskId);
        }
    }

    return await StageModel.findOneAndDelete({stageId});
}