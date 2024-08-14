import { config } from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { IProject, IStage, ITask, IUser } from "../utils/interfaces.js";
import { TaskModel, taskSchema } from "./task.model.js";
import { ProjectDocument, ProjectModel } from "./project.model.js";
import { ActivityType, TeamMember } from "../utils/types.js";
import { StageModel } from "./stage.model.js";
import UserModel from "./user.model.js";

config();

// Define an interface for the ActivityModel document
export interface ActivityDocument extends mongoose.Document {
    type: ActivityType;
    user: IUser;
    data: ITask | IStage | IProject | TeamMember;
    createdBy: string;
    activityId: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
}

const activitySchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    activityId: {
        type: String,
        default: uuid,
    },
    user: {
        type: Object,
        required: true,
    },
    data: {
        type: Object,
        required: true,
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
    }
}, {
    collection: 'activities',
    timestamps: true,
});

const ActivityModel = model<ActivityDocument>('ActivityModel', activitySchema);

export {
    ActivityModel,
    activitySchema
}