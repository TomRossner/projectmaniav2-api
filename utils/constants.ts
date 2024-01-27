import { config } from 'dotenv';
config();

const PORT: number = Number(process.env.PORT) || 3001;

const ROUTES = {
    AUTH_ROUTE: '/auth',
    USERS_ROUTE: '/users',
    PROJECTS_ROUTE: '/projects',
}

const MONGODB_URI: string = process.env.MONGODB_URI as string;

const SALT_ROUNDS: number = 10;

const DEFAULT_BG: string = 'https://i.pngimg.me/thumb/f/720/36e5ddc52b194bd6ad71.jpg';

const REQUEST_TIMEOUT: number = 5000; // in ms

export {
    PORT,
    ROUTES,
    MONGODB_URI,
    SALT_ROUNDS,
    DEFAULT_BG,
    REQUEST_TIMEOUT
}