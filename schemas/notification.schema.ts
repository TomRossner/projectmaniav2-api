import { boolean, date, object, string } from "zod";

export const createNotificationSchema = object({
    body: object({
        type: string({
            required_error: "Email is required"
        }),
        sender: object({
            userId: string(),
            firstName: string(),
            lastName: string(),
        }),
        recipient: object({
            userId: string(),
            firstName: string(),
            lastName: string(),
        }),
        data: object({
            projectId: string(),
            title: string(),
        }).or(object({
            id: string(),
            from: string(),
            createdAt: date(),
            isRead: boolean(),
        }))
    })
});