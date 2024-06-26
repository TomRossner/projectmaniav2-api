import { Request, Response } from "express";
import { IProjectDoc, Project } from "../models/project.model.js";
import { Stage } from "../models/stage.model.js";
import { Task } from "../models/task.model.js";
import { IStage, ITask } from "../utils/interfaces.js";
import { processImg } from "../utils/sharp.js";
import { ExcludedFieldKeys, SelectedFields } from "../utils/types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "../utils/constants.js";

const getAllProjects = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {userId} = req.query;

        const projects: SelectedFields<IProjectDoc, ExcludedFieldKeys>[] = await Project.find({
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

const createProject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const newProject = await new Project({...req.body}).save();

        const project: SelectedFields<IProjectDoc, ExcludedFieldKeys> = await Project
            .findById(newProject._id)
            .select(DOCUMENT_EXCLUDED_FIELDS);
        
        if (project) {
            return res.status(200).send(project);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed creating project'});
    }
}

const getProjectById = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {projectId} = req.params;

        const project: SelectedFields<IProjectDoc, ExcludedFieldKeys> = await Project
            .findOne({projectId})
            .select(DOCUMENT_EXCLUDED_FIELDS);

        if (project) {
            return res.status(200).send(project);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed fetching project'});
    }
}

const updateProject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {projectId, stages} = req.body;
        
        if (stages.length) await updateStages(stages);

        await Project.updateOne({projectId}, {
            $set: {
                ...req.body
            }
        });

        res.status(200).send(`Successfully updated project`);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed updating project'});
    }
}

const deleteProject = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {projectId} = req.params;
        
        const project: SelectedFields<IProjectDoc, ExcludedFieldKeys> = await Project
            .findOne({projectId})
            .select(DOCUMENT_EXCLUDED_FIELDS)
        
        if (project.stages?.length) await deleteStages(project.stages as IStage[]);

        await Project.findOneAndDelete({projectId});

        res.status(200).send(`Successfully deleted project`);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed deleting project'});
    }
}

const createStage = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {projectId} = req.params;
        const stageData = req.body;

        const newStage = await new Stage(stageData).save();

        const stage: SelectedFields<IStage, ExcludedFieldKeys> = await Stage
            .findOne({stageId: newStage.stageId})
            .select(DOCUMENT_EXCLUDED_FIELDS);
        
        await Project.findOneAndUpdate({projectId}, {
            $push: {
                stages: stage
            }
        })

        res.status(200).send(stage);

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed creating stage'});
    }
}

const createTask = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const taskData = req.body;

        const newTask = await new Task(taskData).save();

        const task = await Task
            .findOne({taskId: newTask.taskId})
            .select(DOCUMENT_EXCLUDED_FIELDS);
        
        await Stage.findOneAndUpdate({stageId: taskData.currentStage.stageId}, {
            $push: {
                tasks: task
            }
        });

        res.status(200).send(task);

    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed creating stage'});
    }
}

const updateStages = async (stages: IStage[]): Promise<void> => {
    try {
        for (const stage of stages) {
            const {stageId, tasks, title} = stage;

            if (tasks.length) await updateTasks(tasks);

            await Stage.updateOne({stageId}, {
                $set: {
                    title,
                    tasks
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const updateTasks = async (tasks: ITask[]): Promise<void> => {
    try {
        for (const task of tasks) {
            const {
                taskId,
                title,
                priority,
                dueDate,
                description,
                externalLinks,
                tags
            } = task;

            await Task.updateOne({taskId}, {
                $set: {
                    title,
                    priority,
                    dueDate,
                    description,
                    thumbnailSrc: task.thumbnailSrc
                        ? await processImg(task.thumbnailSrc)
                        : null,
                    externalLinks,
                    tags
                },
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteStages = async (stages: IStage[]): Promise<void> => {
    try {
        for (const s of stages) {
            const {stageId} = s;

            const stage = await Stage
                .findOne({stageId})
                .select(DOCUMENT_EXCLUDED_FIELDS) as IStage;

            if (stage.tasks?.length) await deleteTasks(stage.tasks as ITask[]);

            await Stage.findOneAndDelete({stageId});
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteTasks = async (tasks: ITask[]): Promise<void> => {
    try {
        for (const task of tasks) {
            const {taskId} = task;

            await Task.findOneAndDelete({taskId});
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteTask = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {taskId} = req.params;
        
        await Task.findOneAndDelete({taskId});

        return res.status(200).send('Successfully deleted task');
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed deleting task');
    }
}

export {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    createStage,
    deleteTask,
    createTask
}