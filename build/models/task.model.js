import { config } from "dotenv";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
config();
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
}, { collection: 'tasks' });
const Task = model('Task', taskSchema);
export { Task, taskSchema };
