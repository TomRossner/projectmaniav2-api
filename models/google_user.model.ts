import jwt from "jsonwebtoken";
import mongoose, { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { DEFAULT_BG } from "../utils/constants.js";
import { ProjectDocument } from "./project.model.js";
import bcrypt from 'bcrypt';

// Define an interface for the UserModel document
export interface GoogleUserDocument extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    socketId?: string;
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;
    isOnline: boolean;
    userId: string;
    imgSrc: string;
    mostRecentProject: Pick<ProjectDocument, "projectId" | "title"> | null;
    notifications: string[];

    generateAuthToken: () => string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const googleUserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        default: "",
    },
    lastSeen: Date,
    isOnline: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        default: uuid,
        unique: true,
    },
    imgSrc: {
        type: String,
        default: DEFAULT_BG
    },
    mostRecentProject: {
        type: Object,
        default: null
    },
    notifications: {
        type: [String],
        default: [],
    }
}, {
    collection: 'google_users',
    timestamps: true,
});

googleUserSchema.method('generateAuthToken', function() {
        const token: string = jwt.sign({
            userId: this.userId,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            isOnline: this.isOnline,
            imgSrc: this.imgSrc,
            createdAt: this.createdAt,
            mostRecentProject: this.mostRecentProject,
            notifications: this.notifications
        }, process.env.JWT_SECRET as string);
    
        return token;
    }
)

googleUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean>{
    return await bcrypt.compare(candidatePassword, this.password).catch(err => false);
}

const GoogleUserModel = model<GoogleUserDocument>('GoogleUserModel', googleUserSchema);

export default GoogleUserModel;