import passport from 'passport';
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import _ from "lodash";
import { createUser, findUser, updateUser } from '../services/user.service.js';
import { DEFAULT_BG, PORT } from '../utils/constants.js';
import { NewUserData } from '../utils/interfaces.js';
import { config } from "dotenv";

config();

export default passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.API_URL as string}:${PORT}/api/auth/oauth2/redirect/google`,
    scope: ['profile', 'email'],
    // passReqToCallback: true,
},
  async function(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    const imgSrc = profile._json.picture;
    const email = profile.emails?.length ? profile.emails[0].value : '';
    console.log("Access token ", accessToken);
    console.log("Refresh token ", refreshToken);
    // if (!refreshToken) {
    //   return done("Google authentication failed - refresh token not present", null);
    // }

    if (!email) {
      throw new Error("Google authentication failed");
    }

    console.log("Authenticating with Google...")
    const user = await findUser({email});

    console.log("User found: ", !!user);

    if (!user) {
      try {
        const newUser = await createUser({
          firstName: profile._json.given_name as string,
          lastName: profile._json.family_name as string,
          email,
          authProvider: "google",
        } as NewUserData);

        if (!newUser) {
          throw new Error('Failed creating Google user');
        }
  
        const updatedNewUser = await updateUser({email}, {imgSrc, authProvider: "google"});
        
        if (!updatedNewUser) {
          throw new Error('Google user update failed');
        }
  
        return done(null, _.omit(updatedNewUser, [
          "_id",
          "__v",
          "password"
        ]));
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }

    const updatedUser = await updateUser({email}, {
      imgSrc: !!user.imgSrc && (user.imgSrc !== DEFAULT_BG) ? user.imgSrc : imgSrc,
      isOnline: true,
      authProvider: "google",
    });

    if (!updatedUser) {
      return done('User update failed', null);
    }

    return done(null, _.omit(updatedUser, [
      "_id",
      "__v",
      "password",
    ]));
  }
));
