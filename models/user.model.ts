import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { DEFAULT_BG } from "../utils/constants.js";
import { IProjectDoc } from "./project.model.js";

config();

// Define an interface for the User document
interface IUserDoc extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    socketId?: string;
    lastSeen?: Date;
    createdAt?: Date;
    isOnline?: boolean;
    userId: string;
    imgSrc?: string;
    mostRecentProject?: Pick<IProjectDoc, "projectId" | "title">;
    notifications: string[];
    
    // Add the generateAuthToken method to the interface
    generateAuthToken(): string;
}

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    socketId: {
        type: String,
        default: "",
    },
    lastSeen: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        default: uuid,
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
}, {collection: 'users'});

userSchema.method('generateAuthToken', function() {
    
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

const User = model<IUserDoc>('User', userSchema);

export {
    User,
    IUserDoc,
    userSchema
}