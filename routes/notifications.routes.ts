import { Router } from "express";
import { getNotifications, updateNotificationIsSeen } from "../controllers/notifications.controllers.js";

const NotificationsRouter = Router();

NotificationsRouter.post('/all', getNotifications);
NotificationsRouter.put('/:notificationId/is-seen', updateNotificationIsSeen);

export default NotificationsRouter;