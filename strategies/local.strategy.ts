import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { updateUser, validatePassword } from "../services/user.service.js";

export default passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await validatePassword({email, password});

        if (!user) {
            throw 'Invalid email or password';
        }

        const updatedUser = await updateUser({email}, {isOnline: true, authProvider: "local"});

        if (!updatedUser) {
            throw 'User update failed';
        }

        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error, undefined);
    }
}));