import { config } from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { ITask } from "../utils/interfaces.js";
import { taskSchema } from "./task.model.js";

config();

// Define an interface for the StageModel document
export interface StageDocument extends mongoose.Document {
    title: string;
    tasks: ITask[];
    stageId: string;
    createdAt: Date;
    updatedAt: Date;
    parentProjectId: string;
    createdBy: string;
    projectId: string;
    lastUpdatedBy: string;
}

const stageSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    stageId: {
        type: String,
        default: uuid,
    },
    tasks: {
        type: [taskSchema],
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    createdBy: {
        type: String,
        required: true,
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
    collection: 'stages',
    timestamps: true,
});

const StageModel = model<StageDocument>('StageModel', stageSchema);

export {
    StageModel,
    stageSchema
}