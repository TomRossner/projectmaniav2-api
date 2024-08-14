import { config } from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { Priority, SubTask } from "../utils/types.js";
import { IStage } from "../utils/interfaces.js";
import { DEFAULT_PRIORITY } from "../utils/constants.js";

config();

// Define an interface for the TaskModel document
export interface TaskDocument extends mongoose.Document {
    title: string;
    description?: string;
    taskId: string;
    thumbnailSrc?: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: Priority;
    dueDate: Date;
    externalLinks: string[];
    tags: string[];
    currentStage: Pick<IStage, "stageId" | "title">;
    assignees: string[];
    subtasks: SubTask[];
    createdBy: string;
    dependencies: string[];
    projectId: string;
    lastUpdatedBy: string;
}

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
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
    },
    updatedAt: {
        type: Date,
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
    },
    assignees: {
        type: [String],
        default: []
    },
    subtasks: {
       type: [Object],
       default: [] 
    },
    createdBy: {
        type: String,
        required: true,
    },
    dependencies: {
        type: [String],
        default: []
    },
    projectId: {
        type: String,
        required: true,
    },
    lastUpdatedBy: {
        type: String,
        required: true,
    }
}, {
    collection: 'tasks',
    timestamps: true,
});

const TaskModel = model<TaskDocument>('TaskModel', taskSchema);

export {
    TaskModel,
    taskSchema
}