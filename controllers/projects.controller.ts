import { Request, Response } from "express";
import { ProjectDocument, ProjectModel } from "../models/project.model.js";
import { StageModel } from "../models/stage.model.js";
import { TaskModel } from "../models/task.model.js";
import { IStage, ITask } from "../utils/interfaces.js";
import { processImg } from "../utils/sharp.js";
import { ExcludedFieldKeys, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "../utils/constants.js";
import { createProject, deleteProject, findProject, updateProject } from "../services/project.service.js";
import UserModel from "../models/user.model.js";
import { updateUser } from "./users.controller.js";
import { deleteStage, updateStage, updateStages } from "../services/stage.service.js";
import { deleteTask, updateTask } from "../services/task.service.js";
import _ from "lodash";

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

        if (projects.length) {
            return res.status(200).send(projects);
        }

        res.status(200).send([]);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching projects'});
    }
}

// const createProject = async (req: Request, res: Response) => {
//     try {
//         const newProject = await new ProjectModel({...req.body}).save();

//         const project: SelectedFields<ProjectDocument, ExcludedFieldKeys> = await ProjectModel
//             .findById(newProject._id)
//             .select(DOCUMENT_EXCLUDED_FIELDS);
        
//         if (project) {
//             return res.status(200).send(project);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed creating project'});
//     }
// }

// const getProject = async (req: Request, res: Response) => {
//     try {
//         const {projectId} = req.params;

//         const project: SelectedFields<ProjectDocument, ExcludedFieldKeys> = await ProjectModel
//             .findOne({projectId})
//             .select(DOCUMENT_EXCLUDED_FIELDS);

//         if (!project) {
//             return res.sendStatus(404);
//         }
        
//         return res.status(200).send(project);
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed fetching project'});
//     }
// }

// const updateProject = async (req: Request, res: Response) => {
//     try {
//         const {projectId, stages} = req.body;
//         console.log("body", req.body)
        
//         if (stages.length) await updateStages(stages);

//         // await ProjectModel.updateOne({projectId}, {
//         //     $set: {
//         //         ...req.body
//         //     }
//         // });

//         const updated = await updateProject({projectId}, {...req.body});
//         console.log("Updated: ", updated);

//         res.status(200).send(`Successfully updated project`);
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed updating project'});
//     }
// }

// const deleteProject = async (req: Request, res: Response) => {
//     try {
//         const {projectId} = req.params;
        
//         const project: SelectedFields<ProjectDocument, ExcludedFieldKeys> = await ProjectModel
//             .findOne({projectId})
//             .select(DOCUMENT_EXCLUDED_FIELDS);

//         const user = await UserModel.findOne({userId: project.createdBy});

//         if (user) {
//             const updatedUser = await UserModel.findOneAndUpdate({userId: user.userId}, {mostRecentProject: null}, {new: true});

//             console.log(updatedUser);
//         }
        
//         if (project.stages?.length) await deleteStages(project.stages as IStage[]);

//         const deleted = await ProjectModel.findOneAndDelete({projectId});

//         if (deleted) {
//             return res.status(200).send(`Successfully deleted project`);
//         }

//         return res.status(400).send({error: 'Failed deleting project'});
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed deleting project'});
//     }
// }

// const createStage = async (req: Request, res: Response) => {
//     try {
//         const {projectId} = req.params;
//         const stageData = req.body;

//         const newStage = await new StageModel(stageData).save();

//         const stage: SelectedFields<IStage, ExcludedFieldKeys> = await StageModel
//             .findOne({stageId: newStage.stageId})
//             .select(DOCUMENT_EXCLUDED_FIELDS);
        
//         await ProjectModel.findOneAndUpdate({projectId}, {
//             $push: {
//                 stages: stage
//             }
//         })

//         res.status(200).send(stage);

//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed creating stage'});
//     }
// }

// const createTask = async (req: Request, res: Response) => {
//     try {
//         const taskData = req.body;

//         const newTask = await new TaskModel(taskData).save();

//         const task = await TaskModel
//             .findOne({taskId: newTask.taskId})
//             .select(DOCUMENT_EXCLUDED_FIELDS);

//         await StageModel.findOneAndUpdate({stageId: taskData.currentStage.stageId}, {
//             $push: {
//                 tasks: task
//             }
//         });

//         res.status(200).send(task);

//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error: 'Failed creating stage'});
//     }
// }




const deleteStages = async (stages: IStage[]): Promise<void> => {
    try {
        for (const s of stages) {
            const {stageId} = s;

            const stage = await StageModel
                .findOne({stageId})
                .select(DOCUMENT_EXCLUDED_FIELDS) as IStage;

            if (stage.tasks?.length) await deleteTasks(stage.tasks as ITask[]);

            // await StageModel.findOneAndDelete({stageId});
            await deleteStage(stageId);
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteTasks = async (tasks: ITask[]): Promise<void> => {
    try {
        for (const task of tasks) {
            const {taskId} = task;

            // await TaskModel.findOneAndDelete({taskId});
            await deleteTask(taskId);
        }
    } catch (error) {
        console.error(error);
    }
}

// const deleteTask = async (req: Request, res: Response) => {
//     try {
//         const {taskId} = req.params;
        
//         await TaskModel.findOneAndDelete({taskId});

//         return res.status(200).send('Successfully deleted task');
//     } catch (error) {
//         console.error(error);
//         res.status(400).send('Failed deleting task');
//     }
// }

// const updateStageTitle = async (req: Request, res: Response) => {
//     try {
//         const {title, tasks} = req.body;
//         const {stageId} = req.params;

//         await StageModel.findOneAndUpdate({stageId}, {$set: {title}});

//         const currentStageUpdated = {
//             stageId,
//             title
//         }

//         for (const task of tasks) {
//             await TaskModel.findOneAndUpdate({"currentStage.stageId": stageId}, {currentStage: currentStageUpdated});
//         }

//         res.status(200).send('Successfully updated stage title');
//     } catch (error) {
//         console.error(error);
//         res.status(400).send('Failed updating stage title');
//     }
// }

// const updateProjectTitle = async (req: Request, res: Response) => {
//     try {
//         const {title, stages} = req.body;
//         const {projectId} = req.params;

//         await ProjectModel.findOneAndUpdate({projectId}, {$set: {title}});

//         const currentProjectUpdated = {
//             projectId,
//             title
//         }

//         for (const stage of stages) {
//             await StageModel.findOneAndUpdate({"currentProject.projectId": projectId}, {currentProject: currentProjectUpdated});
//         }

//         res.status(200).send('Successfully updated project title');
//     } catch (error) {
//         console.error(error);
//         res.status(400).send('Failed updating project title');
//     }
// }

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
            return res.status(400).send({error: "Failed creating project"});
        }

        return res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: "Failed creating project"});
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
            return res.sendStatus(400);
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
            return res.status(400).send({error: "Failed deleting project"});
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: "Failed deleting project"});
    }
}

export {
    getAllProjects,
    // createProject,
    // getProject,
    updateProject,
    // deleteProject,
    // createStage,
    deleteTask,
    // createTask,
    // updateStageTitle,
    // updateProjectTitle
}