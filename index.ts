import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AuthRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/users.routes.js";
import { JSON_PAYLOAD_LIMIT, MONGODB_URI, PORT, REQUEST_TIMEOUT, ROUTES } from "./utils/constants.js";
import { connectDB } from "./database/mongodb.config.js";
import ProjectsRouter from "./routes/projects.routes.js";
import { VERIFY_AUTH } from "./middlewares/auth.middleware.js";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import { connectRedisClient } from "./database/redis.config.js";
import { createClient } from "redis";
import { addNotification, createNotification, getSocketId, updateIsOnline, updateSocketId } from "./utils/utils.js";
import NotificationsRouter from "./routes/notifications.routes.js";
import { NewNotificationData } from "./utils/interfaces.js";
import SessionRouter from "./routes/session.routes.js";
import deserializeUser from "./middlewares/deserializeUser.js";
import StagesRouter from "./routes/stages.routes.js";
import TasksRouter from "./routes/tasks.routes.js";
import requireUser from "./middlewares/requireUser.js";
// import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
config();

const app = express();

const io = new Server({
    cors: {
        origin: `${process.env.DEV_API_URL}:${PORT}`
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
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(session({
    secret: process.env.PRIVATE_KEY as string,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: 'sessions',
    }),
    name: 'sessionAccessToken',
    cookie: {
        domain: 'localhost',
        httpOnly: true,
        maxAge: 900000,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', 
    },

}));
// app.use(cookieParser());

const {
    AUTH_ROUTE,
    USERS_ROUTE,
    PROJECTS_ROUTE,
    NOTIFICATIONS_ROUTE,
    SESSIONS_ROUTE,
    STAGES_ROUTE,
    TASKS_ROUTE
} = ROUTES;

app.use(deserializeUser);
app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(SESSIONS_ROUTE, SessionRouter);
app.use(NOTIFICATIONS_ROUTE, requireUser, NotificationsRouter);
app.use(PROJECTS_ROUTE, requireUser, ProjectsRouter);
app.use(STAGES_ROUTE, requireUser, StagesRouter);
app.use(TASKS_ROUTE, requireUser, TasksRouter);

const listenToEvents = (ioServer: Server) => {
    const onConnection = (socket: Socket) => {
        const sid = socket.id;
        console.log(`🔌 ${sid} is now connected`);

        const onDisconnect = async () => {
            console.log(`❌ ${sid} has disconnected`);
            await updateIsOnline(sid, false);
        }
        
        const onOnline = async (userId: string) => {
            await updateSocketId(userId, sid);
            await updateIsOnline(sid, true);

            console.log(`🔌 ${sid} is now connected`);
            console.log("UserModel id: ", userId);
            
            socket.broadcast.emit("online", {userId});
        }

        const onNotification = async (data: NewNotificationData) => {
            const recipientSocketId = await getSocketId(data.recipient.userId);

            const notification = createNotification(data);
            
            await addNotification(data.recipient.userId, notification);

            socket.to(recipientSocketId).emit("notification", notification);
        }

        socket
            .on("disconnect", onDisconnect)
            .on("online", (data) => onOnline(data.userId))
            .on("notification", (data) => onNotification(data))
    }

    ioServer.on("connection", onConnection);
}

const init = async (): Promise<void> => {
    await connectDB();
    // await connectRedisClient();
    const server = app
        .listen(PORT, () => console.log(`✅ Listening on port ${PORT}...`))
        .setTimeout(REQUEST_TIMEOUT);
    
    const ioServer = io.listen(server);
    listenToEvents(ioServer);
}

init();