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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User
            .find()
            .select({
            password: 0,
            __v: 0,
            _id: 0,
            socketId: 0,
            userId: 0
        });
        res.status(200).send(users);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed fetching users' });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User
            .findOne({
            userId
        })
            .select({
            password: 0,
            __v: 0,
            _id: 0,
            socketId: 0,
            userId: 0
        });
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        res.status(200).send(user);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed fetching user using id' });
    }
});
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield User
            .findOne({
            email
        })
            .select({
            password: 0,
            __v: 0,
            _id: 0,
            socketId: 0,
            userId: 0
        });
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        res.status(200).send(user);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed fetching user using email' });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = req.body;
        const { userId } = req.params;
        yield User.findOneAndUpdate({ userId }, newData);
        res.status(200).send('Successfully updated user');
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed updating user' });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        yield User.findOneAndDelete({ userId });
        res.status(200).send('Successfully deleted user');
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed deleting user' });
    }
});
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, newPassword } = req.body;
        const { userId } = req.params;
        const user = yield User.findOne({ userId });
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        const dbPassword = user === null || user === void 0 ? void 0 : user.password;
        const isAllowed = yield comparePasswords(password, dbPassword);
        if (!isAllowed)
            return res.status(401).send({ error: 'Invalid password' });
        else {
            yield user
                .set({
                password: yield hash(newPassword)
            })
                .save();
            res.status(200).send('Password successfully updated');
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Failed updating password' });
    }
});
export { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser, updateUserPassword };
