import { Router } from "express";
import {
    createProjectHandler,
    deleteProjectHandler,
    getAllProjects,
    getProjectHandler,
    updateProjectHandler,
} from "../controllers/projects.controller.js";
import validateResource from "../middlewares/validateResource.js";
import { createProjectSchema } from "../schemas/project.schema.js";

const ProjectsRouter = Router();

ProjectsRouter.get('/', getAllProjects);
ProjectsRouter.get('/:projectId', getProjectHandler);
ProjectsRouter.post('/', validateResource(createProjectSchema), createProjectHandler);
ProjectsRouter.put('/:projectId', updateProjectHandler);
ProjectsRouter.delete('/:projectId', deleteProjectHandler);

export default ProjectsRouter;