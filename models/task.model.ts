import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { TPriority } from "../utils/types.js";

config();

// Define an interface for the Stage document
interface ITaskDoc extends Document {
    title: string;
    description?: string;
    taskId: string;
    imgSrc?: string;
    isDone: boolean;
    createdAt: Date;
    priority: TPriority;
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
        default: 'low'
    },
    imgSrc: {
        type: String
    }
}, {collection: 'tasks'});

const Task = model<ITaskDoc>('Task', taskSchema);

export {
    Task,
    taskSchema
}