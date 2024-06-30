// Types

import { IProjectDoc } from "../models/project.model.js";
import { IUser } from "./interfaces.js";

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

type Subject = Pick<IUser, "userId" | "firstName" | "lastName">;

type NotificationType = 'invitation' | 'message' | 'friendRequest' | 'joinedProject';

type Message = {
    from: Pick<IUser, "userId" | "firstName" | "lastName">;
    to: Pick<IUser, "userId">;
    message: string;
    createdAt: Date;
    isRead: boolean;
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
    subject: Subject;
    data: NotificationData;
}

type NotificationData = Pick<IProjectDoc, "projectId" | "title"> | Pick<Message, "id" | "from" | "createdAt" | "isRead">;

export {
    Priority,
    Tag,
    Model,
    ExcludedFieldKeys,
    SelectedFields,
    ExcludedFields,
    ExcludedFieldValue,
    Sender,
    Subject,
    NewNotificationData,
    INotification,
    Message,
    NotificationData,
}