import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
import { NotificationData, NotificationType, Recipient, Sender } from "../utils/types.js";

export interface NotificationDocument extends mongoose.Document {
    type: NotificationType;
    notificationId: string;
    createdAt: Date;
    updatedAt: Date;
    sender: Sender;
    recipient: Recipient;
    isSeen: boolean;
    data: NotificationData;
}

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: "invitation" || "message" || "friendRequest" || "default" || "assignment",
        default: 'default',
    },
    notificationId: {
        type: String,
        default: uuid,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    sender: {
        type: Object,
        required: true
    },
    recipient: {
        type: Object,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
    },
}, {
    collection: 'notifications',
    timestamps: true,
});

const NotificationModel = model<NotificationDocument>('NotificationModel', notificationSchema);

export {
    NotificationModel,
    notificationSchema
}