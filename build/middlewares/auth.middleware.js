import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();
const VERIFY_AUTH = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send({ error: 'Access denied. Invalid token' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(400).send('Failed verifying token');
    }
};
export { VERIFY_AUTH };
