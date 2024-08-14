import { boolean, object, string } from "zod";

export const createActivitySchema = object({
    body: object({
        type: string({
            required_error: "Type is required"
        }),
        user: object({
            firstName: string({
                required_error: "firstName is required"
            }),
            lastName: string({
                required_error: "lastName is required"
            }),
            userId: string({
                required_error: "userId is required"
            }),
            imgSrc: string().optional(),
            isOnline: boolean({
                required_error: "isOnline is required"
            }),
            email: string({
                required_error: "Email is required"
            }),
        }),
        data: object({
            title: string().optional(),
        }),
    })
});