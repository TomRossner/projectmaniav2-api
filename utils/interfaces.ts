import { IProjectDoc } from "../models/project.model.js";
import { Priority, Tag } from "./types.js";

interface IBaseUser {
    email: string;
    password: string;
}

interface INewUser extends IBaseUser {
    firstName: string;
    lastName: string;
}

interface IUser extends INewUser {
    createdAt: Date;
    lastSeen: Date;
    isOnline: boolean;
    imgSrc: string;
    userId: string;
    socketId: string;
    mostRecentProject?: Pick<IProjectDoc, "projectId" | "title"> | null;
}

interface IStage {
    stageId: string;
    tasks: ITask[];
    title: string;
}

interface ITask {
    taskId: string;
    dueDate: Date;
    description?: string;
    thumbnailSrc?: string;
    priority: Priority;
    isDone: boolean;
    title: string;
    externalLinks?: string[];
    tags: Tag[];
    currentStage: Pick<IStage, "stageId" | "title">,
}

export {
    IBaseUser,
    INewUser,
    IUser,
    ITask,
    IStage
}