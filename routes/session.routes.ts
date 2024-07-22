import { Router } from "express";
import validate from "../middlewares/validateResource.js";
import { createSessionSchema } from "../schema/session.schema.js";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "../controllers/session.controller.js";
import requireUser from "../middlewares/requireUser.js";

const SessionRouter = Router();

SessionRouter.post("/", validate(createSessionSchema), createUserSessionHandler);
SessionRouter.get("/", requireUser, getUserSessionsHandler);
SessionRouter.delete("/", requireUser, deleteSessionHandler);

export default SessionRouter;