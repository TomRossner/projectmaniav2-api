import { Router } from "express";
import { getNotifications, updateNotificationIsSeen, removeNotification } from "../controllers/notifications.controller.js";

const NotificationsRouter = Router();

NotificationsRouter.post('/all', getNotifications);
NotificationsRouter.put('/:notificationId/is-seen', updateNotificationIsSeen);
NotificationsRouter.delete('/:notificationId', removeNotification);

export default NotificationsRouter;