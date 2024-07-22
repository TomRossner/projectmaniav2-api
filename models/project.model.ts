import { config } from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { IStage } from "../utils/interfaces.js";
import { stageSchema } from "./stage.model.js";

config();

// Define an interface for the ProjectModel document
interface ProjectDocument extends mongoose.Document {
    title: string;
    projectId: string;
    stages: IStage[];
    createdAt: Date;
    updatedAt: Date;
    subtitle?: string;
    createdBy: string;
}

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    stages: {
        type: [stageSchema],
        required: true,
        default: []
    },
    projectId: {
        type: String,
        default: uuid,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    team: {
        type: [Object],
        default: [],
        required: true
    },
    createdBy: {
        type: String,
        default: "",
        required: true,
    },
}, {
    collection: 'projects',
    timestamps: true,
});

const ProjectModel = model<ProjectDocument>('ProjectModel', projectSchema);

export {
    ProjectModel,
    ProjectDocument
}