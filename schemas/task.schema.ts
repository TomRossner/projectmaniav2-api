import { array, boolean, date, object, string } from "zod";

export const createTaskSchema = object({
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        priority: string({
            required_error: 'Priority is required'
        }),
        dueDate: string().optional(),
        description: string().optional(),
        thumbnailSrc: string().optional(),
        isDone: boolean().default(false),
        createdBy: string({
            required_error: 'CreatedBy is required'
        }),
        currentStage: object({
            title: string({
                required_error: "currentStage title is required"
            }),
            stageId: string({
                required_error: "stageId is required"
            })
        }),
        externalLinks: array(string()).optional(),
        tags: array(string()).optional(),
        assignees: array(string()).optional(),
        dependencies: array(string()).optional(),
        subtasks: array(object({
            isDone: boolean(),
            title: string(),
            subtaskId: string()
        })).optional(),
        projectId: string({
            required_error: "projectId is required"
        }),
        lastUpdatedBy: string({
            required_error: "lastUpdatedBy is required"
        })
    })
});