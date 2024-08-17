// Types

import { ProjectDocument } from "../models/project.model.js";
import { IStage, ITask, IUser } from "./interfaces.js";

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

type TeamMember = Pick<IUser, "firstName" | "lastName" | "imgSrc" | "isOnline" | "userId" | "email">;

type NewStageData = Pick<IStage, "title" | "tasks">;

type UserCredentials = {
    email: string;
    password: string;
}

enum ActivityType {
    // Tasks

    AddTask = 'task/add',
    UpdateTask = 'task/update',
    DeleteTask = 'task/delete',

    UpdatePriority = 'task_priority_update',

    AddTag = 'task_tag_add',
    UpdateTag = 'task_tag_update',
    DeleteTag = 'task_tag_delete',

    UpdateDueDate = 'task_due_date_update',

    AddDescription = 'task_description_add',
    UpdateDescription = 'task_description_update',
    DeleteDescription = 'task_description_delete',

    AddAssignee = 'task_assignee_add',
    UpdateAssignee = 'task_assignee_update',
    DeleteAssignee = 'task_assignee_delete',

    AddSubtask = 'task_subtask_add',
    UpdateSubtask = 'task_subtask_update',
    DeleteSubtask = 'task_subtask_delete',

    UpdateIsDone = 'task_is_done_update',

    AddExternalLink = 'task_external_link_add',
    UpdateExternalLink = 'task_external_link_update',
    DeleteExternalLink = 'task_external_link_delete',

    UpdateCurrentStage = 'current_stage/update',

    AddDependency = 'task_dependencies_add',
    UpdateDependency = 'task_dependencies_update',
    DeleteDependency = 'task_dependencies_delete',

    AddThumbnail = 'task_thumbnail_add',
    UpdateThumbnail = 'task_thumbnail_update',
    DeleteThumbnail = 'task_thumbnail_delete',

    UpdateTaskTitle = 'task_title_update',


    // Stages

    UpdateStageTitle = 'stage_title_update',

    AddStage = 'stage_add',
    DeleteStage = 'stage_delete',


    // Projects

    CreateProject = 'project_create',
    DeleteProject = 'project_delete',
    JoinProject = 'project_join',
    LeaveProject = 'project_leave',
}

type AuthProvider = "google" | "github" | "local";

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
    TeamMember,
    NewStageData,
    UserCredentials,
    ActivityType,
    AuthProvider,
}