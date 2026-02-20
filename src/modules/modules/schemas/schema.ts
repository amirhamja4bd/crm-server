import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const modules = pgTable('modules', {
  ...commonSchemaFieldsWithId,
  name: varchar('name', { length: 255 }).notNull().default(''),
  description: varchar('description', { length: 500 }).notNull().default(''),
  icon: varchar('icon', { length: 255 }).notNull().default(''),
});
