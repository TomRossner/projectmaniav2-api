import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AuthRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/users.routes.js";
import { JSON_PAYLOAD_LIMIT, PORT, REQUEST_TIMEOUT, ROUTES } from "./utils/constants.js";
import { connectDB } from "./database/database.config.js";
import ProjectsRouter from "./routes/projects.routes.js";
import { VERIFY_AUTH } from "./middlewares/auth.middleware.js";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import { IUser } from "./utils/interfaces.js";


config();

const app = express();

const IO_PORT: number = 3002
const io = new Server({cors: {origin: "http://localhost:3001"}});

app.use(json({limit: JSON_PAYLOAD_LIMIT}));
app.use(urlencoded({extended: true, limit: JSON_PAYLOAD_LIMIT}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const {
    AUTH_ROUTE,
    USERS_ROUTE,
    PROJECTS_ROUTE
} = ROUTES;

app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(PROJECTS_ROUTE, VERIFY_AUTH, ProjectsRouter);

const listenToEvents = (ioServer: Server) => {
    ioServer
        .on("connection", (socket) => {
            console.log(`🔌 ${socket.id} is now connected`);

            socket.on("disconnect", () => {
                console.log(`❌ ${socket.id} has disconnected`);
            })
            .on("online", ({userId}: {userId: string} | Partial<IUser>) => {
                console.log(userId);
                socket.broadcast.emit("online", {userId});
            })
        })
}

const init = async (): Promise<void> => {
    await connectDB();
    const server = app
        .listen(PORT, () => console.log(`✅ Listening on port ${PORT}...`))
        .setTimeout(REQUEST_TIMEOUT);
    
    const ioServer = io.listen(server);
    listenToEvents(ioServer);
}

init();