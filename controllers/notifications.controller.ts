import { Request, Response } from "express";
import { NotificationModel } from "../models/notification.model.js";
import { createNotification, deleteNotification, findNotifications, updateNotification } from "../services/notification.service.js";

export const getNotificationsHandler = async (req: Request, res: Response) => {
    try {
        const {userId} = req.query;

        const notifications = await findNotifications(userId as string) ?? [];

        return res.status(200).send(notifications);
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed getting notifications');
    }
}

export const createNotificationHandler = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const newNotificationData = req.body;

        const notification = await createNotification(newNotificationData);

        if (!notification) { 
            return res.sendStatus(400);
        }

        return res.status(201).send(notification);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}

export const updateNotificationHandler = async (req: Request, res: Response) => {
    try {
        const {notificationId} = req.params;

        const notification = await updateNotification({notificationId}, req.body);

        if (!notification) {
            throw new Error("Failed to update notification");
        }

        return res.status(200).send(notification);
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed to update notification');
    }
}

export const deleteNotificationHandler = async (req: Request, res: Response) => {
    try {
        const {notificationId} = req.params;

        const notification = await deleteNotification(notificationId); 

        if (!notification) {
            throw new Error('Failed removing notification');
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed removing notification');
    }
}