import { Request, Response } from "express";
import { createStage, deleteStage, findStage, updateStage } from "../services/stage.service.js";
import { getTasks } from "../services/task.service.js";
import { ProjectModel } from "../models/project.model.js";
import { TaskModel } from "../models/task.model.js";
import { ITask } from "../utils/interfaces.js";
import { updateProject } from "./projects.controller.js";

export const createStageHandler = async (req: Request, res: Response) => {
    try {
        const stage = await createStage(req.body);

        if (!stage) {
            throw new Error("Failed creating stage");
        }

        return res.status(201).send(stage);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed creating stage"});
    }
}

export const updateStageHandler = async (req: Request, res: Response) => {
    try {
        const {stageId} = req.params;

        const stage = await updateStage({stageId}, req.body);

        const stageTasks = await getTasks(stage?.createdBy as string, stageId);

        const tasks = await TaskModel.find({createdBy: {$exists: false}, "currentStage.stageId": stageId});

        const project = await ProjectModel.findOne({projectId: stage?.parentProjectId}).lean();

        const updatedStages = project?.stages.map(s => s.stageId === stageId
            ? {
                ...s,
                tasks: [
                    ...stage?.tasks as ITask[],
                    ...tasks
                ]
            } : s
        );
        
        console.log("Total tasks without createdBy: ", tasks.map(t => t.taskId))

        // await updateStage({stageId}, {tasks: [...stage?.tasks as ITask[], ...tasks]});
        // await updateProject({projectId: stage?.parentProjectId}, {stages: updatedStages});

        if (!stage) {
            throw new Error("Failed updating stage");
        }
        
        return res.status(200).send(stage);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed updating stage"});
    }
}

export const deleteStageHandler = async (req: Request, res: Response) => {
    try {
        const {stageId} = req.params;

        const stage = await deleteStage(stageId);

        if (!stage) {
            throw new Error("Failed deleting stage");
        }
        
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed deleting stage"});
    }
}