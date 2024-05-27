import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { Priority } from "../utils/types.js";
import { IStage } from "../utils/interfaces.js";
import { DEFAULT_PRIORITY } from "../utils/constants.js";

config();

// Define an interface for the Task document
interface ITaskDoc extends Document {
    title: string;
    description?: string;
    taskId: string;
    imgSrc?: string;
    isDone: boolean;
    createdAt: Date;
    priority: Priority;
    dueDate: Date;
    externalLinks?: string[];
    tags: string[];
    currentStage: Pick<IStage, "stageId" | "title">;
}

const taskSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    taskId: {
        type: String,
        default: uuid,
    },
    isDone: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        default: DEFAULT_PRIORITY
    },
    thumbnailSrc: {
        type: String
    },
    dueDate: {
        type: Date
    },
    currentStage: {
        stageId: String,
        title: String
    },
    description: {
        type: String
    },
    externalLinks: {
        type: [Object],
        default: []
    },
    tags: {
        type: [String],
        default: []
    }
}, {collection: 'tasks'});

const Task = model<ITaskDoc>('Task', taskSchema);

export {
    Task,
    taskSchema
}