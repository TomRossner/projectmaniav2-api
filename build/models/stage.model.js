import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { taskSchema } from "./task.model.js";
config();
const stageSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    stageId: {
        type: String,
        default: uuid,
    },
    tasks: {
        type: [taskSchema],
        require: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'stages' });
const Stage = model('Stage', stageSchema);
export { Stage, stageSchema };
