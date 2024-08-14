import { FilterQuery, UpdateQuery } from "mongoose";
import { ProjectModel, ProjectDocument } from "../models/project.model.js";
import { createStage, deleteStage } from "./stage.service.js";
import { DEFAULT_STAGE } from "../utils/constants.js";

export const findProject = async (projectId: string) => {
    return await ProjectModel.findOne({projectId}).lean();
}

export const createProject = async (newProjectData: Pick<ProjectDocument, "title" | "stages" | "createdBy" | "team">) => {
    try {
        const newProject = (await new ProjectModel(newProjectData).save()).toObject();

        const defaultStage = await createStage({
            ...DEFAULT_STAGE,
            createdBy: newProjectData.createdBy,
            projectId: newProject.projectId,
            lastUpdatedBy: newProject.lastUpdatedBy,
        });

        return await updateProject(
            {projectId: newProject.projectId},
            {stages: [defaultStage]}
        );
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateProject = async (query: FilterQuery<ProjectDocument>, update: UpdateQuery<ProjectDocument>) => {
    return await ProjectModel.findOneAndUpdate(query, update, {new: true}).lean();
}

export const deleteProject = async (projectId: string) => {
    const project = await findProject(projectId);

    if (project?.stages.length) {
        for (const stage of project.stages) {
            await deleteStage(stage.stageId);
        }
    }

    return await ProjectModel.findOneAndDelete({projectId});
}