var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Project } from "../models/project.model.js";
import { Stage } from "../models/stage.model.js";
import { Task } from "../models/task.model.js";
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const projects = yield Project.find({
            team: {
                $elemMatch: {
                    userId
                }
            }
        }).select({ __v: 0, _id: 0 });
        if (projects.length) {
            return res.status(200).send(projects);
        }
        res.status(200).send([]);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed fetching projects' });
    }
});
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const newProject = yield new Project(Object.assign({}, req.body)).save();
        const project = yield Project.findById(newProject._id).select({ __v: 0, _id: 0 });
        if (project) {
            return res.status(200).send(project);
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed creating project' });
    }
});
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        const project = yield Project.findOne({ projectId });
        if (project) {
            return res.status(200).send(project);
        }
        res.status(400).send({ error: 'Failed fetching project' });
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed fetching project' });
    }
});
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, stages } = req.body;
        if (stages.length)
            yield updateStages(stages);
        yield Project.updateOne({ projectId }, {
            $set: Object.assign({}, req.body)
        });
        res.status(200).send(`Successfully updated project`);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed updating project' });
    }
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { stages } = yield Project
            .findOne({ projectId })
            .select({
            __v: 0,
            _id: 0,
        });
        console.log(stages);
        if (stages === null || stages === void 0 ? void 0 : stages.length)
            yield deleteStages(stages);
        yield Project.findOneAndDelete({ projectId });
        res.status(200).send(`Successfully deleted project`);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed deleting project' });
    }
});
const createStage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const stageData = req.body;
        const newStage = yield new Stage(stageData).save();
        const stage = yield Stage.findOne({ stageId: newStage.stageId }).select({ __v: 0, _id: 0 });
        yield Project.findOneAndUpdate({ projectId }, {
            $push: {
                stages: stage
            }
        });
        res.status(200).send(stage);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed creating stage' });
    }
});
const updateStages = (stages) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const stage of stages) {
            const { stageId, tasks, title } = stage;
            if (tasks.length)
                yield updateTasks(tasks);
            yield Stage.updateOne({ stageId }, {
                $set: {
                    title,
                    tasks
                }
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
const updateTasks = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const task of tasks) {
            const { taskId, title, priority, dueDate, description } = task;
            yield Task.updateOne({ taskId }, {
                $set: {
                    title,
                    priority,
                    dueDate,
                    description
                }
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
const deleteStages = (stages) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const stage of stages) {
            const { stageId } = stage;
            const { tasks } = Stage
                .find({ stageId })
                .select({
                __v: 0,
                _id: 0,
            });
            if (tasks === null || tasks === void 0 ? void 0 : tasks.length)
                yield deleteTasks(tasks);
            yield Stage.findOneAndDelete({ stageId });
        }
    }
    catch (error) {
        console.error(error);
    }
});
const deleteTasks = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const task of tasks) {
            const { taskId } = task;
            for (const task of tasks) {
                yield Task.findOneAndDelete({ taskId });
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
export { getAllProjects, createProject, getProjectById, updateProject, deleteProject, createStage };
