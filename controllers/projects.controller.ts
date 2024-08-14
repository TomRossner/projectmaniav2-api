import { Request, Response } from "express";
import { ProjectDocument, ProjectModel } from "../models/project.model.js";
import { ExcludedFieldKeys, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "../utils/constants.js";
import { createProject, deleteProject, findProject, updateProject } from "../services/project.service.js";
import { updateStages } from "../services/stage.service.js";
import { deleteTask } from "../services/task.service.js";
import _ from "lodash";
import { logUnidentifiedStages } from "../utils/utils.js";

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const {userId} = req.query;
        
        const projects: SelectedFields<ProjectDocument, ExcludedFieldKeys>[] = await ProjectModel.find({
            team: {
                $elemMatch: {
                    userId
                }
            }
        }).select(DOCUMENT_EXCLUDED_FIELDS);
        
        return res.status(200).send(projects);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching projects'});
    }
}

export const getProjectHandler = async (req: Request, res: Response) => {
    try {
        const {projectId} = req.params;

        const project = await findProject(projectId);

        if (!project) {
            return res.status(400).send(null);
        }
        
        return res.status(200).send(_.omit(project, ["_id", "__v"]));
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed finding project"});
    }
}

export const createProjectHandler = async (req: Request, res: Response) => {
    try {
        const project = await createProject(req.body);

        if (!project) {
            throw new Error("Failed creating project");
        }

        return res.status(201).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

export const updateProjectHandler = async (req: Request, res: Response) => {
    try {
        const {projectId} = req.params;

        const {stages} = req.body;

        if (stages.length) {
            await updateStages(stages);
        }

        const project = await updateProject({projectId}, req.body);

        if (!project) {
            throw new Error("Failed updating project");
        }
        
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed updating project"});
    }
}

export const deleteProjectHandler = async (req: Request, res: Response) => {
    try {
        const {projectId} = req.params;

        const project = await deleteProject(projectId);

        if (!project) {
            throw new Error("Failed deleting project");
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed deleting project"});
    }
}

export {
    getAllProjects,
    updateProject,
    deleteTask,
}