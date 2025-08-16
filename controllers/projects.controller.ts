import { Request, Response } from "express";
import { ProjectDocument, ProjectModel } from "../models/project.model.js";
import { ExcludedFieldKeys, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "../utils/constants.js";
import { createProject, deleteProject, findProject, updateProject } from "../services/project.service.js";
import { deleteTask, findTask, findTasks } from "../services/task.service.js";
import _ from "lodash";
import { getPaginatedItems } from "../utils/utils.js";
import { updateStages } from "../services/stage.service.js";
import { IProject, IStage, ITask } from "../utils/interfaces.js";
import { TaskDocument } from "../models/task.model.js";
import { FilterQuery } from "mongoose";

const getPaginatedProjects = async (req: Request, res: Response) => {
    try {
        const {userId} = req.query;
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        
        const projects: SelectedFields<ProjectDocument, ExcludedFieldKeys>[] = await ProjectModel.find({
            team: {
                $elemMatch: {
                    userId
                }
            }
        }).select(DOCUMENT_EXCLUDED_FIELDS);

        return res.status(200).send(getPaginatedItems(projects, page, limit));
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching projects'});
    }
}

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const {
            userId,
        } = req.query;
        
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


// export const updateProjectHandler = async (req: Request, res: Response) => {
//     try {
//         const { projectId } = req.params;
//         console.log(req.body);

//         if (req.body.stages) {
//             // Get all the stageIds from the request
//             const stageIds = req.body.stages.map((stage: IStage) => stage.stageId);

//             // Fetch all tasks from the database that have a matching stageId in their currentStage
//             const tasksFromDB = await findTasks({ "currentStage.stageId": { $in: stageIds } });

//             // Organize tasks by stageId
//             const tasksByStageId = tasksFromDB.reduce((acc: { [x: string]: any[]; }, task: { currentStage: { stageId: string | number; }; }) => {
//                 if (!acc[task.currentStage.stageId]) {
//                     acc[task.currentStage.stageId] = [];
//                 }
//                 acc[task.currentStage.stageId].push(task);
//                 return acc;
//             }, {} as Record<string, ITask[]>);

//             // Update stages with tasks
//             const updatedStages = req.body.stages.map((s: IStage) => {
//                 return {
//                     ...s,
//                     tasks: tasksByStageId[s.stageId] || [] // Assign tasks to the stage, or an empty array if no tasks match
//                 };
//             });

//             // Create the updated project object
//             const updatedProject: IProject = {
//                 ...req.body,
//                 stages: updatedStages,
//             };

//             // Update the project in the database
//             const project = await updateProject({ projectId }, updatedProject as FilterQuery<ProjectDocument>);
//             if (!project) {
//                 throw new Error("Failed updating project");
//             }

//             return res.status(200).send(project);
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(400).send({ error: "Failed updating project" });
//     }
// };
export const updateProjectHandler = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        const project = await updateProject({ projectId }, req.body);

        if (!project) {
            throw new Error("Failed updating project");
        }

        return res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: "Failed updating project" });
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
    getPaginatedProjects,
    getAllProjects,
    updateProject,
    deleteTask,
}