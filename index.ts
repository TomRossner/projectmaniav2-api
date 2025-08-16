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
import passport from "passport";
import ImagesRouter from "./routes/images.routes.js";
import { listenToEvents } from "./utils/socket.utils.js";

config();

declare global {
    namespace Express {
        interface User {
            userId?: string; 
        }
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
        maxAge: 1000 * 60 * 60 * 24,
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

app.use((req, res, next) => {
    if (req.user) {
        req.session.touch();
    }
    
    next();
});

// Serialize user into the sessions
passport.serializeUser(async (user, done) => {
    console.log("Serializing...")
    console.log("Serialized user: ", user)

    if (!user) {
        return done('Failed serializing user', null);
    }

    done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser(async (user: Express.User, done) => {
    done(null, user);
});

const {
    AUTH_ROUTE,
    USERS_ROUTE,
    PROJECTS_ROUTE,
    NOTIFICATIONS_ROUTE,
    SESSIONS_ROUTE,
    STAGES_ROUTE,
    TASKS_ROUTE,
    ACTIVITIES_ROUTE,
    IMAGES_ROUTE,
} = ROUTES;

app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(SESSIONS_ROUTE, SessionRouter);
app.use(NOTIFICATIONS_ROUTE, requireUser, NotificationsRouter);
app.use(PROJECTS_ROUTE, requireUser, ProjectsRouter);
app.use(STAGES_ROUTE, requireUser, StagesRouter);
app.use(TASKS_ROUTE, requireUser, TasksRouter);
app.use(ACTIVITIES_ROUTE, requireUser, ActivityRouter);
app.use(IMAGES_ROUTE, requireUser, ImagesRouter);

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