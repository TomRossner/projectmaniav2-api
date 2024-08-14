import { Request, Response } from "express";
import { createActivity, deleteActivity, getActivities, updateActivity } from "../services/activity.service.js";

export const getActivitiesHandler = async (req: Request, res: Response) => {
    try {
        const {projectId} = req.query;

        const activities = await getActivities(projectId as string);

        return res.status(200).send(activities);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: ' Failed fetching activity log'});
    }
}

export const createActivityHandler = async (req: Request, res: Response) => {
    try { 
        const activity = await createActivity(req.body);

        if (!activity) {
            throw new Error('Failed creating activity');
        }

        return res.status(201).send(activity);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed creating activity'});
    }
}

export const updateActivityHandler = async (req: Request, res: Response) => {
    try {
        const activity = await updateActivity({activityId: req.body.activityId}, req.body);

        if (!activity) {
            throw new Error('Failed updating activity');
        }

        return res.status(200).send(activity);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed updating activity'});
    }
}

export const deleteActivityHandler = async (req: Request, res: Response) => {
    try {
        const activity = await deleteActivity(req.body);

        if (!activity) {
            throw new Error('Failed deleting activity');
        }

        return res.status(200).send(activity);
    } catch (error) {
        console.error(error);
        res.status(400).send({error: 'Failed deleting activity'});
    }
}