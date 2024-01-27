import { Router } from "express";
import {
    createProject,
    createStage,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from "../controllers/projects.controllers.js";

const ProjectsRouter = Router();

ProjectsRouter.get('/', getAllProjects);
ProjectsRouter.post('/new-project', createProject);
ProjectsRouter.put('/update-project', updateProject);
ProjectsRouter.delete('/:projectId', deleteProject);
ProjectsRouter.get('/id/:projectId', getProjectById);
ProjectsRouter.post('/:projectId/new-stage', createStage);

export default ProjectsRouter;