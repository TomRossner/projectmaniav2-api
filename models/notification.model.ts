import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
import { INotification } from "../utils/types.js";

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: "invitation" || "message" || "friendRequest" || "joinedProject",
        default: '',
    },
    id: {
        type: String,
        default: uuid
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    sender: {
        type: Object,
    },
    subject: {
        type: Object,
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
    },
}, {collection: 'notifications'});

const Notification = model<INotification>('Notification', notificationSchema);

export {
    Notification,
    notificationSchema
}