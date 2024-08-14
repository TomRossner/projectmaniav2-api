import { Router } from 'express';
import passport from "passport";
import "../strategies/google.strategy.js";
import { CLIENT_URL } from '../utils/constants.js';

const AuthRouter = Router();

AuthRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.sendStatus(200); // Redirect to the login page after logout
    });
  });
});

AuthRouter.get('/login/google', passport.authenticate('google'));
AuthRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: `${CLIENT_URL}`,
  failureRedirect: `${CLIENT_URL}/sign-in`,
}));

export default AuthRouter;