import { array, object, string } from "zod";
import { createTaskSchema } from "./task.schema.js";
import _ from "lodash";

export const createStageSchema = object({
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        tasks: array(object({
            ..._.get(createTaskSchema, "body")
        }).optional()),
        createdBy: string({
            required_error: "createdBy is required"
        }),
        projectId: string({
            required_error: "projectId is required"
        }),
        lastUpdatedBy: string({
            required_error: "lastUpdatedBy is required"
        })
    })
});