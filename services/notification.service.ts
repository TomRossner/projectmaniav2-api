import { FilterQuery } from "mongoose";
import { NotificationDocument, NotificationModel } from "../models/notification.model.js";
import { NewNotificationData } from "../utils/interfaces.js";
import { UpdateFilter } from "mongodb";

export const createNotification = async (newNotificationData: NewNotificationData) => {
    try {
        return (await NotificationModel.create(newNotificationData)).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const findNotifications = async (userId: string) => {
    return await NotificationModel.find({"recipient.userId": userId});
}

export const updateNotification = async (query: FilterQuery<NotificationDocument>, update: UpdateFilter<NotificationDocument>) => {
    return await NotificationModel.findOneAndUpdate(query, update, {new: true}).lean();
}

export const deleteNotification = async (notificationId: string) => {
    return await NotificationModel.findOneAndDelete({notificationId});
}