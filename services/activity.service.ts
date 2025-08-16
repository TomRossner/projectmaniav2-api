import { FilterQuery } from "mongoose";
import { ActivityDocument, ActivityModel } from "../models/activity.model.js";
import { Activity, NewActivityData } from "../utils/interfaces.js";
import { UpdateFilter } from "mongodb";
import _ from "lodash";
import { getPaginated } from "../utils/utils.js";

export const getActivities = async (query: FilterQuery<ActivityDocument>) => {
    try {
        return await ActivityModel.find(query).lean();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const getPaginatedActivities = async (query: FilterQuery<ActivityDocument>, page: number, limit: number) => {
    try {
        return await getPaginated(ActivityModel, query, page, limit);
    } catch (error: any) {
        throw new Error(error);
    }
}

export const createActivity = async (newActivityData: NewActivityData) => {
    try {
        const newActivity: Omit<Activity, "createdAt" | "updatedAt" | "_id" | "__v" | "activityId"> = {
            ...newActivityData,
            createdBy: newActivityData.user.userId,
        }

        return (await new ActivityModel(newActivity).save()).toObject(); 
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateActivity = async (query: FilterQuery<ActivityDocument>, update: UpdateFilter<ActivityDocument>) => {
    return await ActivityModel.findOneAndUpdate(query, _.omit(update, "_id"), {new: true}).lean();
}

export const deleteActivity = async (activityId: string) => {
    return await ActivityModel.findOneAndDelete({activityId});
}