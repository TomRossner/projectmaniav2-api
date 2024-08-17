import { ProjectDocument } from "../models/project.model.js";
import { Sender, Recipient, Priority, Tag, NotificationType, NotificationData, SubTask, TeamMember, ActivityType, AuthProvider } from "./types.js";

interface IBaseUser {
    email: string;
    password: string;
}

interface NewUserData extends IBaseUser {
    firstName: string;
    lastName: string;
    authProvider: AuthProvider;
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
    createdBy: string;
    projectId: string;
    lastUpdatedBy: string;
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
    projectId: string;
    lastUpdatedBy: string;
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
    notificationId: string;
    createdAt: Date;
    isSeen: boolean;
}

interface NewNotificationData {
    type: NotificationType;
    sender: Sender;
    recipient: Recipient;
    data: NotificationData;
}

interface IProject extends NewProjectData {
    stages: IStage[];
    projectId: string;
    subtitle?: string;
    team: TeamMember[];
    activities: Activity[];
}

interface NewProjectData {
    title: string,
    team: TeamMember[];
    createdBy: string;
    stages: IStage[];
    lastUpdatedBy: string;
}

interface NewActivityData {
    user: TeamMember;
    type: ActivityType;
    data: ITask | IStage | IProject | TeamMember;
    projectId: string;
}

interface Activity extends NewActivityData {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    activityId: string;
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
    INotification,
    IProject,
    NewActivityData,
    Activity,
}