import { Router } from "express";
import validateResource from "../middlewares/validateResource.js";
import { createSessionSchema } from "../schemas/session.schema.js";
import requireUser from "../middlewares/requireUser.js";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from "../controllers/session.controller.js";
import passport from "passport";
import "../strategies/local.strategy.js";

const SessionRouter = Router();

SessionRouter.post("/", validateResource(createSessionSchema), passport.authenticate('local'), createUserSessionHandler);
SessionRouter.get("/", requireUser, getUserSessionHandler);
SessionRouter.delete("/", requireUser, deleteSessionHandler);

export default SessionRouter;