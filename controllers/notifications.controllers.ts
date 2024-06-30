import { Request, Response } from "express";
import { Notification } from "../models/notification.model.js";
import { INotification } from "../utils/types.js";

const getNotifications = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {notificationsIds} = req.body;
        console.log(notificationsIds)

        if (!notificationsIds?.length) return res.status(200).send([]);

        const notifications: INotification[] = [];

        for (const id of notificationsIds) {
            const notification = await Notification.findOne({id}).select({__v: 0, _id: 0});
            console.log(notification)
            if (notification) {
                notifications.push(notification);
            }
        }

        console.log(notifications);
        return res.status(200).send(notifications);
    } catch (error) {
        console.error(error);
        res.status(400).send('Failed getting notifications');
    }
}

const updateNotificationIsSeen = async (req: Request, res: Response): Promise<Response | void> => {
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

export {
    getNotifications,
    updateNotificationIsSeen
}