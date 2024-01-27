import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants.js';

const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

const comparePasswords = async (password: string, dbPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, dbPassword);
}

export { 
    hash,
    comparePasswords
}