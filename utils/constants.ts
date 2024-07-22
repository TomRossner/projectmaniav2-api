import { config } from 'dotenv';
import { ExcludedFields, ExcludedFieldKeys, Priority } from './types.js';
config();

const PORT: number = Number(process.env.PORT) || 3001;

const ROUTES = {
    AUTH_ROUTE: '/api/auth',
    USERS_ROUTE: '/api/users',
    SESSIONS_ROUTE: '/api/sessions',
    NOTIFICATIONS_ROUTE: '/api/notifications',
    PROJECTS_ROUTE: '/api/projects',
    STAGES_ROUTE: '/api/stages',
    TASKS_ROUTE: '/api/tasks',
}

const MONGODB_URI: string = process.env.MONGODB_URI as string;

const SALT_ROUNDS: number = 10;

const DEFAULT_BG: string = 'https://i.pngimg.me/thumb/f/720/36e5ddc52b194bd6ad71.jpg';

const REQUEST_TIMEOUT: number = 10000; // in ms

const JSON_PAYLOAD_LIMIT: string = '5mb';

const DOCUMENT_EXCLUDED_FIELDS: Pick<ExcludedFields, "__v" | "_id"> = {
    __v: 0,
    _id: 0,
}

const USER_EXCLUDED_FIELDS: ExcludedFields = {
    ...DOCUMENT_EXCLUDED_FIELDS,
    password: 0,
    socketId: 0,
    userId: 0
}

const DEFAULT_PRIORITY: Priority = 'low';

const ACCESS_TOKEN_TTL: string = '15m';
const REFRESH_TOKEN_TTL: string = '1y';

export {
    PORT,
    ROUTES,
    MONGODB_URI,
    SALT_ROUNDS,
    DEFAULT_BG,
    REQUEST_TIMEOUT,
    JSON_PAYLOAD_LIMIT,
    DOCUMENT_EXCLUDED_FIELDS,
    USER_EXCLUDED_FIELDS,
    DEFAULT_PRIORITY,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
}