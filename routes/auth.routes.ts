import { NextFunction, Request, Response, Router } from 'express';
import passport from "passport";
import "../strategies/github.strategy.js";
import "../strategies/google.strategy.js";
import { CLIENT_URL } from '../utils/constants.js';
import { updateUser } from '../services/user.service.js';
import requireUser from '../middlewares/requireUser.js';

const AuthRouter = Router();

const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  await updateUser({userId: req.user?.userId}, {isOnline: false});

  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie('session', { 
        path: '/'
      });
      
      res.sendStatus(200);
    });
  });
}

// Logout
AuthRouter.get('/logout', requireUser, logoutHandler);

const LOGIN_FAILURE_REDIRECT: string = `${CLIENT_URL}/login`;
const LOGIN_SUCCESS_REDIRECT: string = `${CLIENT_URL}/auth/callback`;

// Github auth
AuthRouter.get('/login/github', passport.authenticate('github'));
AuthRouter.get('/oauth2/redirect/github', passport.authenticate('github', {
  successReturnToOrRedirect: LOGIN_SUCCESS_REDIRECT,
  failureRedirect: LOGIN_FAILURE_REDIRECT,
}));

// Google auth
AuthRouter.get('/login/google', passport.authenticate('google'));
AuthRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: LOGIN_SUCCESS_REDIRECT,
  failureRedirect: LOGIN_FAILURE_REDIRECT,
}));

export default AuthRouter;