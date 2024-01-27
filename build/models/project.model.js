import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { stageSchema } from "./stage.model.js";
config();
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
}, { collection: 'projects' });
const Project = model('Project', projectSchema);
export { Project };
