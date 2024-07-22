import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
import { INotification } from "../utils/interfaces.js";

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: "invitation" || "message" || "friendRequest" || "default" || "assignment",
        default: 'default',
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
    recipient: {
        type: Object,
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

const Notification = model<INotification>('Notification', notificationSchema);

export {
    Notification,
    notificationSchema
}