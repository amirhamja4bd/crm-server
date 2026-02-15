import { boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Common fields for database schemas
 */
export const commonSchemaFields = {
  status: boolean('status').notNull().default(true),
  // use snake_case DB column names but keep camelCase property keys for TS ergonomics
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const commonSchemaFieldsWithId = {
  id: uuid('id').primaryKey().defaultRandom(),
  ...commonSchemaFields,
};
