var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { comparePasswords, hash } from "../utils/bcrypt.js";
import { User } from "../models/user.model.js";
import { validateUserData } from "../utils/regexp.js";
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User.findOne({ email });
        if (!user)
            return res.status(400).send({ error: 'Invalid email or password' });
        const dbPassword = user.password;
        const isValid = yield comparePasswords(password, dbPassword);
        if (isValid) {
            // Generate auth token
            const token = user.generateAuthToken();
            return res.status(200).send({ token });
        }
        res.status(400).send({ error: 'Invalid email or password' });
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Invalid email or password' });
    }
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const isAlreadyRegistered = yield User.findOne({ email });
        if (isAlreadyRegistered)
            return res.status(400).send({ error: 'User already registered' });
        const newUserData = {
            firstName,
            lastName,
            email,
            password
        };
        const isValid = validateUserData(newUserData);
        if (!isValid)
            return res.status(400).send({ error: 'Invalid data' });
        yield createNewUser(newUserData);
        return res.status(200).send('Successfully created user');
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed signing up' });
    }
});
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
});
const createNewUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new User(Object.assign(Object.assign({}, userData), { password: yield hash(userData.password) })).save();
});
export { login, signUp, googleSignIn };
