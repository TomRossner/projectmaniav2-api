import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { ITask } from "../utils/interfaces.js";
import { taskSchema } from "./task.model.js";

config();

// Define an interface for the Stage document
interface IStageDoc extends Document {
    title: string;
    tasks: ITask[];
    stageId: string;
}

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
}, {collection: 'stages'});

const Stage = model<IStageDoc>('Stage', stageSchema);

export {
    Stage,
    stageSchema
}