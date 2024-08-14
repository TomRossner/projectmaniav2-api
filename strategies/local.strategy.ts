import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { validatePassword } from "../services/user.service.js";

export default passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await validatePassword({email, password});

        console.log("Valid: ", user);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        done(null, user);
    } catch (error) {
        done(error, undefined);
    }
}));