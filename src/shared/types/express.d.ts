import { UserRequestType } from '@/database/schema';

declare global {
  namespace Express {
    interface Request {
      user: UserRequestType;
    }
  }
}
