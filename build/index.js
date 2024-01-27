var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AuthRouter from "./routes/auth.routes.js";
import UsersRouter from "./routes/users.routes.js";
import { PORT, REQUEST_TIMEOUT, ROUTES } from "./utils/constants.js";
import { connectDB } from "./database/database.config.js";
import ProjectsRouter from "./routes/projects.routes.js";
import { VERIFY_AUTH } from "./middlewares/auth.middleware.js";
config();
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
const { AUTH_ROUTE, USERS_ROUTE, PROJECTS_ROUTE } = ROUTES;
app.use(AUTH_ROUTE, AuthRouter);
app.use(USERS_ROUTE, UsersRouter);
app.use(PROJECTS_ROUTE, VERIFY_AUTH, ProjectsRouter);
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    app
        .listen(PORT, () => console.log(`✅ Listening on port ${PORT}...`))
        .setTimeout(REQUEST_TIMEOUT);
});
init();
