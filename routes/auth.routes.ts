import { Router } from 'express';
import { googleSignIn, login, signUp } from '../controllers/auth.controllers.js';

const AuthRouter = Router();

AuthRouter.post('/log-in', login);
AuthRouter.post('/sign-up', signUp);
AuthRouter.post('/sign-in/google', googleSignIn);

export default AuthRouter;