import { Router } from "express";
import validateResource from "../middlewares/validateResource.js";
import { createActivitySchema } from "../schemas/activity.schema.js";
import { createActivityHandler, deleteActivityHandler, getActivitiesHandler, updateActivityHandler } from "../controllers/activity.controller.js";

const ActivityRouter = Router();

ActivityRouter.get('/', getActivitiesHandler);
ActivityRouter.post('/', validateResource(createActivitySchema), createActivityHandler);
ActivityRouter.put('/:activityId', updateActivityHandler);
ActivityRouter.delete('/:activityId', deleteActivityHandler);

export default ActivityRouter;