import { ProjectDocument } from "../models/project.model.js";
import { Sender, Recipient, Priority, Tag, NotificationType, NotificationData, SubTask } from "./types.js";

interface IBaseUser {
    email: string;
    password: string;
}

interface NewUserData extends IBaseUser {
    firstName: string;
    lastName: string;
}

interface IUser extends NewUserData {
    createdAt: Date;
    lastSeen: Date;
    isOnline: boolean;
    imgSrc: string;
    userId: string;
    socketId: string;
    mostRecentProject?: Pick<ProjectDocument, "projectId" | "title"> | null;
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
    externalLinks: string[];
    tags: Tag[];
    currentStage: Pick<IStage, "stageId" | "title">,
    createdBy: string;
    assignees: string[];
    subtasks: SubTask[];
    dependencies: string[];
}

interface IInvitationData {
    projectData: Pick<ProjectDocument, "projectId" | "title">;
    sender: Sender;
    recipient: Recipient;
}

interface IInvitation extends IInvitationData {
    isPending: boolean;
    createdAt: Date;
    id: string;
}

interface INotification extends NewNotificationData {
    id: string;
    createdAt: Date;
    isSeen: boolean;
}

interface NewNotificationData {
    type: NotificationType;
    sender: Sender;
    recipient: Recipient;
    data: NotificationData;
}

export {
    IBaseUser,
    NewUserData,
    IUser,
    ITask,
    IStage,
    IInvitation,
    IInvitationData,
    NewNotificationData,
    INotification
}