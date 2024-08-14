import passport from 'passport';
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import _ from "lodash";
import { findUser, updateUser } from '../services/user.service.js';
import { createGoogleUser, NewGoogleUserData, updateGoogleUser } from '../services/google_user.service.js';
import { PORT } from '../utils/constants.js';
import { config } from 'dotenv';

config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.API_URL as string}:${PORT}/api/auth/oauth2/redirect/google`,
    scope: ['profile', 'email'],
    passReqToCallback: true,
},
  async function(req, accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    const imgSrc = profile._json.picture;
    const email = profile.emails?.length ? profile.emails[0].value : '';
    
    if (!email) {
      // Find user with another query
    }

    const user = await findUser({email});

    if (!user) {
      try {
        const newUser = await createGoogleUser({
          firstName: profile._json.given_name as string,
          lastName: profile._json.family_name as string,
          email,
        } as NewGoogleUserData);

        if (!newUser) {
          throw new Error('Failed creating Google user');
        }
  
        const updatedNewUser = await updateGoogleUser({email}, {imgSrc, isOnline: true});
        
        if (!updatedNewUser) {
          return done('Google user update failed', null);
        }
  
        req.user = updatedNewUser;
  
        return done(null, _.omit(updatedNewUser, [
          "_id",
          "__v",
        ]));
      } catch (error) {
        console.error(error);
        return done('Login failed', null);
      }
    }

    const updatedUser = await updateUser({email}, {imgSrc, isOnline: true});

    if (!updatedUser) {
      return done('User update failed', null);
    }

    req.user = updatedUser;

    done(null, _.omit(updatedUser, [
      "_id",
      "__v",
      "password",
    ]));
  }
));

// Serialize user into the sessions
passport.serializeUser(async (user, done) => {
  done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser(async (user: Express.User, done) => {
  done(null, user);
});
