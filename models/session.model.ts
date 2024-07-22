import { Schema, model } from "mongoose";
import { UserDocument } from "./user.model.js";
import mongoose from "mongoose";

// Define an interface for the UserModel document
export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    valid: boolean;
    createdAt: Date;
    updatedAt: Date;
    userAgent: string;
}

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    valid: {
        type: Boolean,
        default: true,
    },
    userAgent: {
        type: String,
    }
}, {
    collection: 'sessions',
    timestamps: true,
});

const SessionModel = model<SessionDocument>('SessionModel', sessionSchema);

export default SessionModel;