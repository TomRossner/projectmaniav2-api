import { array, boolean, object, string } from "zod";
import { createStageSchema } from "./stage.schema.js";
import _ from "lodash";

export const createProjectSchema = object({
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        createdBy: string({
            required_error: "createdBy is required"
        }),
        team: array(object({
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
        })),
        lastUpdatedBy: string({
            required_error: "lastUpdatedBy is required"
        }),
        stages: array(object({
            ..._.omit(_.get(createStageSchema, "body"), ['lastUpdatedBy', 'projectId'])
        })),
    })
});