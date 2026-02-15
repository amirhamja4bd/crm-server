import { IBaseEntity } from '@/shared/types/types';

/**
 * Represents a user row as returned from the database (includes password).
 * Use this type for internal DB calls. When returning to clients, omit the
 * `password` field.
 */
export interface IUser extends IBaseEntity {
  id: string;
  status: boolean;
  email: string;
  password: string;
  name: string;
}
