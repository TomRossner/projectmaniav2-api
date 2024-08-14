import { config } from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { Activity, IStage } from "../utils/interfaces.js";
import { stageSchema } from "./stage.model.js";
import { TeamMember } from "../utils/types.js";

config();

// Define an interface for the ProjectModel document
interface ProjectDocument extends mongoose.Document {
    title: string;
    projectId: string;
    stages: IStage[];
    team: TeamMember[];
    createdAt: Date;
    updatedAt: Date;
    subtitle?: string;
    createdBy: string;
    activities: Activity[];
    lastUpdatedBy: string;
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
        required: true,
    },
    activities: {
        type: [Object],
        default: [],
    },
    lastUpdatedBy: {
        type: String,
        required: true,
    }
}, {
    collection: 'projects',
    timestamps: true,
});

const ProjectModel = model<ProjectDocument>('ProjectModel', projectSchema);

export {
    ProjectModel,
    ProjectDocument
}