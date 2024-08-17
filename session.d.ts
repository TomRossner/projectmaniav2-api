import 'express-session';
import { IUser } from './utils/interfaces.ts';
import { UserDocument } from './models/user.model.ts';

declare module 'express-session' {
  interface SessionData {
    user?: UserDocument;
  }
}