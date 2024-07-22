import { Router } from "express";
import {
    createProjectHandler,
    deleteProjectHandler,
    // createProject,
    // createStage,
    // createTask,
    // deleteProject,
    deleteTask,
    getAllProjects,
    getProjectHandler,
    // getProject,
    // updateProject,
    updateProjectHandler,
    // updateProjectTitle,
    // updateStageTitle
} from "../controllers/projects.controller.js";
import { findProject, updateProject } from "../services/project.service.js";

const ProjectsRouter = Router();

ProjectsRouter.get('/', getAllProjects);
ProjectsRouter.get('/:projectId', getProjectHandler);
ProjectsRouter.post('/', createProjectHandler);
ProjectsRouter.put('/:projectId', updateProjectHandler);
ProjectsRouter.delete('/:projectId', deleteProjectHandler);
// ProjectsRouter.post('/:projectId/new-stage', createStage);
// ProjectsRouter.delete('/tasks/:taskId', deleteTask);
// ProjectsRouter.post('/new-task', createTask);
// ProjectsRouter.put('/stages/:stageId/update-title', updateStageTitle);
// ProjectsRouter.put('/:projectId/update-title', updateProjectTitle);

export default ProjectsRouter;