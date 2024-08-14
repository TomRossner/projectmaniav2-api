import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AuthRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/users.routes.js";
import { CLIENT_URL, JSON_PAYLOAD_LIMIT, PORT, REQUEST_TIMEOUT, ROUTES } from "./utils/constants.js";
import { connectDB } from "./database/mongodb.config.js";
import ProjectsRouter from "./routes/projects.routes.js";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import { connectRedisClient } from "./database/redis.config.js";
import { createClient } from "redis";
import { addNotificationToUser, getSocketId } from "./utils/utils.js";
import NotificationsRouter from "./routes/notifications.routes.js";
import { INotification, IProject, IStage, ITask } from "./utils/interfaces.js";
import SessionRouter from "./routes/session.routes.js";
import StagesRouter from "./routes/stages.routes.js";
import TasksRouter from "./routes/tasks.routes.js";
import requireUser from "./middlewares/requireUser.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import ActivityRouter from "./routes/activity.routes.js";
import { findProject } from "./services/project.service.js";
import { updateUser } from "./services/user.service.js";
import { regenerateSession } from "./middlewares/regenerateSession.js";
import passport from "passport";
config();

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const app = express();

const io = new Server({
    cors: {
        origin: `${process.env.API_URL}:${PORT}`,
    }
});

app.use(json({
    limit: JSON_PAYLOAD_LIMIT,
}));
app.use(urlencoded({
    extended: true,
    limit: JSON_PAYLOAD_LIMIT
}));
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,    
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(session({
    secret: process.env.PRIVATE_KEY as string,
    saveUninitialized: false,
    resave: false,
    name: 'session',
    cookie: {
        domain: 'localhost',
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE as string),
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', 
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: 'sessions',
    }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(regenerateSession);
const {
    AUTH_ROUTE,
    USERS_ROUTE,
    PROJECTS_ROUTE,
    NOTIFICATIONS_ROUTE,
    SESSIONS_ROUTE,
    STAGES_ROUTE,
    TASKS_ROUTE,
    ACTIVITIES_ROUTE,
} = ROUTES;

app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(SESSIONS_ROUTE, SessionRouter);
app.use(NOTIFICATIONS_ROUTE, requireUser, NotificationsRouter);
app.use(PROJECTS_ROUTE, requireUser, ProjectsRouter);
app.use(STAGES_ROUTE, requireUser, StagesRouter);
app.use(TASKS_ROUTE, requireUser, TasksRouter);
app.use(ACTIVITIES_ROUTE, requireUser, ActivityRouter);

const listenToEvents = (ioServer: Server) => {
    const onConnection = async (socket: Socket) => {
        const sid = socket.id;

        // const queryId = socket.handshake.query.id;
        // socket.join(queryId as string);
        
        // console.log(`Query id: `, queryId);
        console.log(`🔌 ${sid} is now connected`);

        // const clientIp = socket.handshake.address;

        // if (!clientConnections[clientIp]) {
        //     clientConnections[clientIp] = 0;
        // }

        // clientConnections[clientIp] += 1;

        // if (clientConnections[clientIp] > connectionLimit) {
        //     socket.disconnect();
        //     console.log('Connection limit exceeded for client', clientIp);
        // }

        const onDisconnect = async () => {
            console.log(`❌ ${sid} has disconnected`);
            // clientConnections[clientIp] -= 1;
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
            console.log(data)
            // const notification = createNotification(data);
            
            await addNotificationToUser(data.recipient.userId, data);

            socket.to(recipientSocketId).emit("notification", data);
        }

        const onUpdateSocketId = async ({userId, socketId}: {userId: string, socketId: string}) => {
            return await updateUser({userId}, {socketId});
        }

        const onNewTask = async (data: ITask) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('newTask', data);
        }

        const onDeleteTask = async (data: ITask) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('deleteTask', data);
        }

        const onUpdateTask = async (data: ITask) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('updateTask', data);
        }

        const onNewStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('newStage', data);
        }

        const onDeleteStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('deleteStage', data);
        }

        const onUpdateStage = async (data: IStage) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('updateStage', data);
        }
        
        const onUpdateProject = async (data: IProject) => {
            const project = await findProject(data.projectId);

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
            socket.to(socketIds).emit('updateProject', data);
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

const init = async () => {
    await connectDB();
    // await connectRedisClient();
    const server = app
        .listen(PORT, () => console.log(`✅ Listening on port ${PORT}...`))
        .setTimeout(REQUEST_TIMEOUT);
    
    const ioServer = io.listen(server);
    listenToEvents(ioServer);
}

init();