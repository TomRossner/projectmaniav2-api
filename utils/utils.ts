import { v4 as uuid } from "uuid";
import { ProjectModel } from "../models/project.model.js";
import { StageModel } from "../models/stage.model.js";
import { TaskModel } from "../models/task.model.js";
import UserModel from "../models/user.model.js";
import { IInvitation, IInvitationData, INotification, NewNotificationData } from "./interfaces.js";
import { Model } from "./types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "./constants.js";
import { Notification } from "../models/notification.model.js";

const updateFieldName = async (model: Model, currName: string, newName: string) => {
    const renameField = { [currName]: newName };
    try {
        switch (model) {
            case "task":
                return await TaskModel.updateMany({}, {$rename: renameField});
            case "stage":
                return await StageModel.updateMany({}, {$rename: renameField});
            case "project":
                return await ProjectModel.updateMany({}, {$rename: renameField});
            case "user":
                return await UserModel.updateMany({}, {$rename: renameField});
            default:
                break;
        }
    } catch (error) {
        throw new Error(`Failed updating field ${currName} to ${newName} in ${model} model: ${error}`);
    }
}

const createInvitation = (invitationData: IInvitationData): IInvitation => {
    return {
        ...invitationData,
        id: uuid(),
        createdAt: new Date(Date.now()),
        isPending: true,
    }
}

const updateSocketId = async (userId: string, socketId: string) => {
    try {
        return await UserModel.updateOne(
            {userId},
            {$set: {socketId: socketId.toString()}},
        );
    } catch (error) {
        console.error(error);
    }
}

const updateIsOnline = async (socketId: string, bool: boolean) => {
    try {
        return await UserModel.updateOne(
            {socketId},
            {$set: {isOnline: bool}},
        );
    } catch (error) {
        console.error(error);
    }
}

const getSocketId = async (userId: string): Promise<string> => {
    try {
        const user = await UserModel
            .findOne({userId})
            .select(DOCUMENT_EXCLUDED_FIELDS);

        return user?.socketId || "";
    } catch (error) {
        console.error(error);
        return "";
    }
}

const addNotification = async (recipientId: string, notification: INotification) => {
    try {
        const newNotification = await new Notification(notification).save();
        
        return await UserModel.findOneAndUpdate({userId: recipientId}, {$push: {notifications: notification.id}});
    } catch (error) {
        console.error(error);
    }
}

const deleteNotification = async (userId: string, notificationId: string) => {
    try {
        await Notification.findOneAndDelete({id: notificationId});
        return await UserModel.findOneAndUpdate({userId}, {$pull: {notifications: notificationId}});
    } catch (error) {
        console.error(error);
    }
}

const createNotification = (notificationData: NewNotificationData): INotification => {
    return {
        ...notificationData,
        isSeen: false,
        id: uuid(),
        createdAt: new Date(Date.now())
    }
}

export {
    updateFieldName,
    createInvitation,
    updateSocketId,
    getSocketId,
    addNotification,
    deleteNotification,
    createNotification,
    updateIsOnline
}