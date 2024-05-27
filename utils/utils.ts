import { Project } from "../models/project.model.js";
import { Stage } from "../models/stage.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { Model } from "./types.js";

const updateFieldName = async (model: Model, currName: string, newName: string) => {
    const renameField = { [currName]: newName };
    try {
        switch (model) {
            case "task":
                return await Task.updateMany({}, {$rename: renameField});
            case "stage":
                return await Stage.updateMany({}, {$rename: renameField});
            case "project":
                return await Project.updateMany({}, {$rename: renameField});
            case "user":
                return await User.updateMany({}, {$rename: renameField});
            default:
                break;
        }
    } catch (error) {
        throw new Error(`Failed updating field ${currName} to ${newName} in ${model} model: ${error}`);
    }
}

export {
    updateFieldName,
}