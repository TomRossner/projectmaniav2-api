import { FilterQuery, UpdateQuery } from "mongoose";
import { ProjectModel, ProjectDocument } from "../models/project.model.js";

export const findProject = async (projectId: string) => {
    return await ProjectModel.findOne({projectId}).lean();
}

export const createProject = async (newProjectData: Pick<ProjectDocument, "title" | "stages" | "createdBy">) => {
    try {
        return (await new ProjectModel(newProjectData).save()).toObject();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateProject = async (query: FilterQuery<ProjectDocument>, update: UpdateQuery<ProjectDocument>) => {
    return await ProjectModel.findOneAndUpdate(query, update, {new: true});
}

export const deleteProject = async (projectId: string) => {
    return await ProjectModel.findOneAndDelete({projectId});
}