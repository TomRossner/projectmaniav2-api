import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";
import { v4 as uuid } from 'uuid';
import { DEFAULT_BG } from "../utils/constants.js";
config();
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
    socketId: String,
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
    }
}, { collection: 'users' });
userSchema.method('generateAuthToken', function () {
    const token = jwt.sign({
        userId: this.userId,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        isOnline: this.isOnline,
        imgSrc: this.imgSrc,
        createdAt: this.createdAt,
    }, process.env.JWT_SECRET);
    return token;
});
const User = model('User', userSchema);
export { User, userSchema };
