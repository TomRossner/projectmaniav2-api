import { Request, Response } from "express";
import { IProjectDoc, Project } from "../models/project.model.js";
import { Stage } from "../models/stage.model.js";
import { Task } from "../models/task.model.js";
import { IStage, ITask } from "../utils/interfaces.js";

const getAllProjects = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {userId} = req.query;

        const projects = await Project.find({
            team: {
                $elemMatch: {
                    userId
                }
            }
        }).select({__v: 0, _id: 0});

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
        console.log(req.body)
        const newProject = await new Project({...req.body}).save();

        const project = await Project.findById(newProject._id).select({__v: 0, _id: 0});
        
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
        const {projectId} = req.body;

        const project = await Project.findOne({projectId});

        if (project) {
            return res.status(200).send(project);
        }

        res.status(400).send({error: 'Failed fetching project'});
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
        
        const {stages} = await Project
            .findOne({projectId})
            .select({
                __v: 0,
                _id: 0,
            }) as Partial<IProjectDoc>;
        
        if (stages?.length) await deleteStages(stages as IStage[]);

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

        const stage = await Stage.findOne({stageId: newStage.stageId}).select({__v: 0, _id: 0});
        
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
            const {taskId, title, priority, dueDate, description} = task;

            await Task.updateOne({taskId}, {
                $set: {
                    title,
                    priority,
                    dueDate,
                    description
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteStages = async (stages: IStage[]): Promise<void> => {
    try {
        for (const stage of stages) {
            const {stageId} = stage;

            const {tasks} = Stage
                .find({stageId})
                .select({
                    __v: 0,
                    _id: 0,
                }) as Partial<IStage>;

            if (tasks?.length) await deleteTasks(tasks as ITask[]);

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

            for (const task of tasks) {
                await Task.findOneAndDelete({taskId});    
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    createStage
}