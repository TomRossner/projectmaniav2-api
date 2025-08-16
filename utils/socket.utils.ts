import { Server, Socket } from "socket.io";
import { updateUser } from "../services/user.service.js";
import { INotification, IProject, IStage, ITask } from "./interfaces.js";
import { addNotificationToUser, getSocketId } from "./utils.js";
import { findProject, updateProject } from "../services/project.service.js";
import _ from "lodash";
import { ProjectDocument } from "../models/project.model.js";

export const listenToEvents = (ioServer: Server) => {
    const onConnection = async (socket: Socket) => {
        const sid = socket.id;
        console.log(`🔌 ${sid} is now connected`);

        const THROTTLE_DURATION_MS: number = 1000;

        const throttleEvent = _.throttle((event: string, socketIds: string, data: {[key: string]: any}) => {
            socket.to(socketIds).emit(event, data);
        }, THROTTLE_DURATION_MS);

        const onDisconnect = async () => {
            console.log(`❌ ${sid} has disconnected`);

            await updateUser({socketId: sid}, {isOnline: false});
        }
        
        const onOnline = async (userId: string) => {
            await updateUser({userId}, {isOnline: true, socketId: sid});

            console.log(`🔌 ${sid} is now connected`);
            console.log("User id: ", userId);
            
            socket.broadcast.emit("online", {userId});
        }

        const onNotification = async (data: INotification) => {
            const recipientSocketId = await getSocketId(data.recipient.userId);
            
            await addNotificationToUser(data.recipient.userId, data);

            socket.to(recipientSocketId).emit("notification", data);
        }

        const onUpdateSocketId = async ({userId, socketId}: {userId: string, socketId: string}) => {
            return await updateUser({userId}, {socketId});
        }

        const onNewTask = async (data: ITask) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = {
                ...project,
                stages: [
                    ...project?.stages.map(s => s.stageId === data.currentStage.stageId
                        ? {
                            ...s,
                            tasks: [...s.tasks, data],
                        } : s
                    ) as IStage[]
                ]
            } as IProject

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("ADD TASK - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('newTask', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        const onDeleteTask = async (data: ITask) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = {
                ...project,
                stages: [
                    ...project?.stages.map(s => s.stageId === data.currentStage.stageId
                        ? {
                            ...s,
                            tasks: s.tasks.filter(t => t.taskId !== data.taskId),
                        } : s
                    ) as IStage[]
                ]
            } as IProject

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("DELETE TASK - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('deleteTask', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        const onUpdateTask = async (data: ITask) => {
            console.log(data.currentStage)
            const project = await findProject(data.projectId);

            const hasMovedTask = (data: ITask , project: ProjectDocument): boolean => {
                const newStageId = data.currentStage.stageId;
                const currentStageId = project.stages.map(s => s.tasks.find(t => t.taskId === data.taskId))[0]?.currentStage.stageId;
                
                return currentStageId !== newStageId;
            }

            let updatedProject: IProject = project as IProject;
            
            if (hasMovedTask(data, project as ProjectDocument)) {
                updatedProject = {
                    ...project,
                    stages: [
                        ...project?.stages.map(s => {
                            const newStageId = data.currentStage.stageId;

                            if (s.stageId === newStageId) {
                                return {
                                    ...s,
                                    tasks: [
                                        ...s.tasks, data
                                    ]
                                }
                            } else if (s.stageId !== newStageId && s.tasks.some(t => t.taskId === data.taskId)) {
                                return {
                                    ...s,
                                    tasks: [
                                        ...s.tasks.filter(t => t.taskId !== data.taskId)
                                    ]
                                }
                            }
                        }
                        ) as IStage[]
                    ]
                } as IProject
            } else {
                updatedProject = {
                    ...project,
                    stages: [
                        ...project?.stages.map(s => s.stageId === data.currentStage.stageId
                            ? {
                                ...s,
                                tasks: 
                                    [
                                        ...s.tasks.map(t => t.taskId === data.taskId ? data : t)
                                    ]
                            } : s
                        ) as IStage[]
                    ]
                } as IProject
            }

            await updateProject({projectId: data.projectId}, updatedProject);
            
            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("UPDATE TASK - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('updateTask', data);

            // socket.to(socketIds).emit('projectUpdated', {
            //     projectId: data.projectId
            // });
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        const onNewStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = {
                ...project,
                stages: [...project?.stages as IStage[], data]
            } as IProject

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("ADD STAGE - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('newStage', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        const onDeleteStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = {
                ...project,
                stages: project?.stages.filter(s => s.stageId !== data.stageId),
            } as IProject

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("DELETE STAGE - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('deleteStage', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        const onUpdateStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = {
                ...project,
                stages: [
                    ...project?.stages.map(s => s.stageId === data.stageId ? data : s) as IStage[]
                ]
            } as IProject

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("UPDATE STAGE - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('updateStage', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }
        
        const onUpdateProject = async (data: IProject) => {
            const project = await findProject(data.projectId);

            const updatedProject: IProject = data;

            await updateProject({projectId: data.projectId}, updatedProject);

            const userIds: string[] = project?.team
                .filter(u => u.userId !== data.lastUpdatedBy)
                .map(u => u.userId)
            ?? [];

            const socketIds: string[] = [];

            for (const id of userIds) {
                const socketId = await getSocketId(id);
                
                if (socketId) {
                    socketIds.push(socketId);
                }
            }

            console.log("UPDATE PROJECT - Socket ids: ", socketIds);
            // socket.to(socketIds).emit('updateProject', data);
            throttleEvent('projectUpdated', socketIds, {projectId: data.projectId});
        }

        socket
            .on("disconnect", onDisconnect)
            .on("online", (data) => onOnline(data.userId))
            .on("notification", onNotification)
            .on('updateSocketId', onUpdateSocketId)
            // Tasks
            .on('newTask', onNewTask)
            .on('deleteTask',onDeleteTask)
            .on('updateTask', onUpdateTask)
            // Stages
            .on('newStage', onNewStage)
            .on('deleteStage', onDeleteStage)
            .on('updateStage', onUpdateStage)
            // Project
            .on('updateProject', onUpdateProject)
    }

    ioServer.on("connection", onConnection);
}