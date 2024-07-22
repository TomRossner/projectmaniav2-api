import { Request, Response } from "express";
import { Notification } from "../models/notification.model.js";
import { INotification } from "../utils/interfaces.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "../utils/constants.js";

const getNotifications = async (req: Request, res: Response) => {
    try {
        const {notificationsIds} = req.body;

        if (!notificationsIds?.length) return res.status(200).send([]);

        const notifications: INotification[] = [];

        for (const id of notificationsIds) {
            const notification = await Notification
                .findOne({id})
                .select(DOCUMENT_EXCLUDED_FIELDS);

            if (notification) {
                notifications.push(notification);
            }
        }

        return res.status(200).send(notifications);
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed getting notifications');
    }
}

const updateNotificationIsSeen = async (req: Request, res: Response) => {
    try {
        const {notificationId: id} = req.params;
        const {isSeen} = req.body;

        await Notification.findOneAndUpdate({id}, {$set: {isSeen}});

        return res.status(200).send('Successfully updated notification');
    } catch (error) {
        console.error(error);
        return res.status(400).send('Failed to update notification');
    }
}

const removeNotification = async (req: Request, res: Response) => {
    try {
        const {notificationId: id} = req.params;

        const removed = await Notification.findOneAndDelete({id});

        if (!removed) {
            return res.status(400).send('Failed removing notification');
        } else {
            return res.status(200).send('Successfully removed notification');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed removing notification');
    }
}

export {
    getNotifications,
    updateNotificationIsSeen,
    removeNotification,
}