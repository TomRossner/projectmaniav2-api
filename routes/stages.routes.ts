import { Router } from "express";
import validateResource from "../middlewares/validateResource.js";
import { createStageSchema } from "../schemas/stage.schema.js";
import { createStageHandler, deleteStageHandler, updateStageHandler } from "../controllers/stages.controller.js";

const StagesRouter = Router();

StagesRouter.post('/', validateResource(createStageSchema), createStageHandler);
StagesRouter.put('/:stageId', updateStageHandler);
StagesRouter.delete('/:stageId', deleteStageHandler);

export default StagesRouter;