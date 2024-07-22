import { object, string } from "zod";

export const createStageSchema = object({
    body: object({
        title: string({
            required_error: "Title is required"
        }),
    })
});