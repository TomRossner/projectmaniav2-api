import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AuthRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/users.routes.js";
import { JSON_PAYLOAD_LIMIT, PORT, REQUEST_TIMEOUT, ROUTES } from "./utils/constants.js";
import { connectDB } from "./database/mongodb.config.js";
import ProjectsRouter from "./routes/projects.routes.js";
import { VERIFY_AUTH } from "./middlewares/auth.middleware.js";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import { connectRedisClient } from "./database/redis.config.js";
import { createClient } from "redis";
import { addNotification, createNotification, getSocketId, updateSocketId } from "./utils/utils.js";
import { Invitation } from "./models/invitation.model.js";
import NotificationsRouter from "./routes/notifications.routes.js";
import { NewNotificationData } from "./utils/types.js";

config();

const app = express();

const io = new Server({
    cors: {
        origin: `${process.env.DEV_API_URL}:${PORT}`
    }
});

app.use(json({
    limit: JSON_PAYLOAD_LIMIT
}));
app.use(urlencoded({
    extended: true,
    limit: JSON_PAYLOAD_LIMIT
}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const {
    AUTH_ROUTE,
    USERS_ROUTE,
    PROJECTS_ROUTE,
    NOTIFICATIONS_ROUTE
} = ROUTES;

app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(PROJECTS_ROUTE, VERIFY_AUTH, ProjectsRouter);
app.use(NOTIFICATIONS_ROUTE, VERIFY_AUTH, NotificationsRouter);

const listenToEvents = (ioServer: Server) => {
    const onConnection = (socket: Socket) => {
        const sid = socket.id;

        console.log(`🔌 ${sid} is now connected`);

        const onDisconnect = () => {
            console.log(`❌ ${sid} has disconnected`);
        }

        const onOnline = async (userId: string) => {
            console.log("User id: ", userId);
            socket.broadcast.emit("online", {userId});

            await updateSocketId(userId, sid);
        }

        const onNotification = async (data: NewNotificationData) => {
            // const invitation = await new Invitation(createInvitation(invitationData)).save();
            const subjectSocketId = await getSocketId(data.subject.userId);

            const notification = createNotification(data);
            
            await addNotification(data.subject.userId, notification);

            socket.to(subjectSocketId).emit("notification", notification);
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