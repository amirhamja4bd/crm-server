import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/schema';

export type DrizzleDB = NodePgDatabase<typeof schema>;
export type DatabaseTransaction = Parameters<Parameters<DrizzleDB['transaction']>[0]>[0];
