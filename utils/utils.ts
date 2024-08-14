import { v4 as uuid } from "uuid";
import { ProjectModel } from "../models/project.model.js";
import { StageModel } from "../models/stage.model.js";
import { TaskModel } from "../models/task.model.js";
import UserModel from "../models/user.model.js";
import { IInvitation, IInvitationData, INotification, NewNotificationData } from "./interfaces.js";
import { Model } from "./types.js";
import { DOCUMENT_EXCLUDED_FIELDS } from "./constants.js";
import { NotificationModel } from "../models/notification.model.js";
import { updateStage } from "../services/stage.service.js";
import { updateUser } from "../services/user.service.js";

const updateFieldName = async (model: Model, currName: string, newName: string) => {
    const renameField = { [currName]: newName };
    try {
        switch (model) {
            case "task":
                return await TaskModel.updateMany({}, {$rename: renameField});
            case "stage":
                return await StageModel.updateMany({}, {$rename: renameField});
            case "project":
                return await ProjectModel.updateMany({}, {$rename: renameField});
            case "user":
                return await UserModel.updateMany({}, {$rename: renameField});
            default:
                break;
        }
    } catch (error) {
        throw new Error(`Failed updating field ${currName} to ${newName} in ${model} model: ${error}`);
    }
}

const createInvitation = (invitationData: IInvitationData): IInvitation => {
    return {
        ...invitationData,
        id: uuid(),
        createdAt: new Date(Date.now()),
        isPending: true,
    }
}

const updateSocketId = async (userId: string, socketId: string) => {
    try {
        return await UserModel.updateOne(
            {userId},
            {$set: {socketId: socketId.toString()}},
        );
    } catch (error) {
        console.error(error);
    }
}

const updateIsOnline = async (socketId: string, bool: boolean) => {
    try {
        const update = await updateUser({socketId}, {isOnline: bool});

        return update;
    } catch (error) {
        console.error(error);
    }
}

const getSocketId = async (userId: string): Promise<string> => {
    try {
        const user = await UserModel
            .findOne({userId})
            .select(DOCUMENT_EXCLUDED_FIELDS);

        return user?.socketId || "";
    } catch (error) {
        console.error(error);
        return "";
    }
}

const addNotificationToUser = async (recipientId: string, notification: INotification) => {
    try {
        return await UserModel.findOneAndUpdate({userId: recipientId}, {$push: {notifications: notification.notificationId}});
    } catch (error) {
        console.error(error);
    }
}

const deleteNotification = async (userId: string, notificationId: string) => {
    try {
        await NotificationModel.findOneAndDelete({id: notificationId});
        return await UserModel.findOneAndUpdate({userId}, {$pull: {notifications: notificationId}});
    } catch (error) {
        console.error(error);
    }
}

const logUnidentifiedStages = async (userId: string) => {
    const stages = await StageModel.find({createdBy: userId});
    // console.log(stages.map(s => ({title: s.title, stageId: s.stageId})))

    
    const unidentifiedStages: string[] = [];
    
    for (const stage of stages) {
        const stageParentProject = await ProjectModel.findOne({projectId: stage.parentProjectId});
        // const stagesWithoutCreatedBy = await StageModel.find({parentProjectId: stage.parentProjectId, createdBy: {$exists: false}});
        // console.log(stagesWithoutCreatedBy)

        // for (const s of stagesWithoutCreatedBy) {
        //     await updateStage({stageId: s.stageId}, {createdBy: stages[0].createdBy});
        // }

        // console.log(stageParentProject?.stages.filter(s => !s.createdBy))
        
        if (!stageParentProject) {
            unidentifiedStages.push(stage.stageId);

            // const deleteUnidentified = async (stageId: string) => {
            //     return await StageModel.findOneAndDelete({stageId});
            // }
            
            // /!\ DELETE UNIDENTIFIED - CAREFUL /!\
            // await deleteUnidentified(stage.stageId);
        }

    }

    // console.log("Unidentified stages: ", unidentifiedStages);
    // console.log(`Total stages created by user ${userId}: `, stages.length);
}

export {
    updateFieldName,
    createInvitation,
    updateSocketId,
    getSocketId,
    addNotificationToUser,
    deleteNotification,
    updateIsOnline,
    logUnidentifiedStages,
}