import { Router } from "express";
import { createNotificationHandler, updateNotificationHandler, getNotificationsHandler, deleteNotificationHandler } from "../controllers/notifications.controller.js";
import validateResource from "../middlewares/validateResource.js";
import { createNotificationSchema } from "../schemas/notification.schema.js";

const NotificationsRouter = Router();

NotificationsRouter.get('/', getNotificationsHandler);
NotificationsRouter.post('/', validateResource(createNotificationSchema), createNotificationHandler);
NotificationsRouter.put('/:notificationId', updateNotificationHandler);
NotificationsRouter.delete('/:notificationId', deleteNotificationHandler);

export default NotificationsRouter;