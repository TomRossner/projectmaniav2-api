// Types

import { ProjectDocument } from "../models/project.model.js";
import { ITask, IUser } from "./interfaces.js";

type Priority = 'low' | 'medium' | 'high';

type Tag = 'bug' | 'ui' | 'feature' | 'hotfix' | 'backend';

type Model = "task" | "stage" | "project" | "user";

type SelectedFields<T extends {[key: string]: any}, E extends ExcludedFieldKeys> = Omit<T, E>;

type ExcludedFieldKeys = "_id" | "__v" | "password" | "socketId" | "userId";

type ExcludedFieldValue = 0;

type ExcludedFields = {
    [key in ExcludedFieldKeys]: ExcludedFieldValue;
};

type Sender = Pick<IUser, "userId" | "firstName" | "lastName">;

type Recipient = Pick<IUser, "userId" | "firstName" | "lastName">;

type NotificationType = 'invitation' | 'message' | 'friendRequest' | 'assignment' | 'default';

type Message = {
    from: Pick<IUser, "userId" | "firstName" | "lastName">;
    to: Pick<IUser, "userId">;
    message: string;
    createdAt: Date;
    isRead: boolean;
    id: string;
}

type NotificationData = Pick<ProjectDocument, "projectId" | "title"> | Pick<Message, "id" | "from" | "createdAt" | "isRead">;

type SubTask = Pick<ITask, "isDone" | "title"> & {subtaskId: string};

export {
    Priority,
    Tag,
    Model,
    ExcludedFieldKeys,
    SelectedFields,
    ExcludedFields,
    ExcludedFieldValue,
    Sender,
    Recipient,
    Message,
    NotificationData,
    NotificationType,
    SubTask,
}