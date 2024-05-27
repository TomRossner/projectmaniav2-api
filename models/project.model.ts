import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { IStage } from "../utils/interfaces.js";
import { stageSchema } from "./stage.model.js";

config();

// Define an interface for the Project document
interface IProjectDoc extends Document {
    title: string;
    projectId: string;
    stages: IStage[];
    createdAt: Date;
    subtitle?: string;
}

const projectSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    subtitle: {
        type: String,
    },
    stages: {
        type: [stageSchema],
        require: true,
        default: []
    },
    projectId: {
        type: String,
        default: uuid
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    team: {
        type: [Object],
        default: [],
        require: true
    },
}, {collection: 'projects'});

const Project = model<IProjectDoc>('Project', projectSchema);

export {
    Project,
    IProjectDoc
}