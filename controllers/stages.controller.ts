import { Request, Response } from "express";
import { createStage, deleteStage, updateStage } from "../services/stage.service.js";

export const createStageHandler = async (req: Request, res: Response) => {
    try {
        const stage = await createStage(req.body);

        if (!stage) {
            return res.status(400).send({error: "Failed creating stage"});
        }

        return res.status(200).send(stage);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed creating stage"});
    }
}

export const updateStageHandler = async (req: Request, res: Response) => {
    try {
        const {stageId} = req.params;

        const stage = await updateStage({stageId}, req.body);

        if (!stage) {
            return res.status(400).send({error: "Failed updating stage"});
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
            return res.status(400).send({error: "Failed deleting stage"});
        }
        
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed deleting stage"});
    }
}