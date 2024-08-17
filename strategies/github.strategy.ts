import passport from 'passport';
import { Profile, Strategy as GithubStrategy } from 'passport-github2';
import _ from "lodash";
import { createUser, findUser, updateUser } from '../services/user.service.js';
import { PORT } from '../utils/constants.js';
import { config } from 'dotenv';
import { NewUserData } from '../utils/interfaces.js';

config();

export default passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: `${process.env.API_URL as string}:${PORT}/api/auth/oauth2/redirect/github`,
    scope: ['user:email'],
},
  async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
    console.log("Access token: ", accessToken);
    const imgSrc = profile?.photos?.length ? profile.photos[0].value : '';
    const email = profile.emails?.length ? profile.emails[0].value : '';
    console.log(email)
    
    if (!email) {
      // Find user with another query
      throw new Error("Github authentication failed");
    }

    const user = await findUser({email});

    if (!user) {
      try {
        const newUser = await createUser({
          firstName: profile.displayName?.split(" ")[0] as string,
          lastName: profile.displayName?.split(" ")[1] as string,
          email,
          authProvider: "github",
        } as NewUserData);

        if (!newUser) {
          throw new Error('Failed creating Github user');
        }
  
        const updatedNewUser = await updateUser({email}, {imgSrc, isOnline: true});
        
        if (!updatedNewUser) {
          throw new Error('Github user update failed');
        }
  
        return done(null, _.omit(updatedNewUser, [
          "_id",
          "__v",
        ]));
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }

    const updatedNewUser = await updateUser({email}, {imgSrc, isOnline: true});
        
    if (!updatedNewUser) {
      return done('Github user update failed', null);
    }

    return done(null, _.omit(updatedNewUser, [
      "_id",
      "__v",
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
