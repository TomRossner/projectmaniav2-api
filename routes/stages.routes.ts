import { Router } from "express";
import validate from "../middlewares/validateResource.js";
import { createStageSchema } from "../schema/stage.schema.js";
import { createStageHandler, deleteStageHandler, updateStageHandler } from "../controllers/stages.controller.js";

const StagesRouter = Router();

StagesRouter.post('/', validate(createStageSchema), createStageHandler);
StagesRouter.put('/:stageId', updateStageHandler);
StagesRouter.delete('/:stageId', deleteStageHandler);

export default StagesRouter;