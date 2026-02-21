import { boolean, index, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const roles = pgTable(
  'roles',
  {
    ...commonSchemaFieldsWithId,
    name: varchar('name', { length: 100 }).notNull(),
    isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  },
  (table) => [
    index('roles_name_idx').on(table.name),
    uniqueIndex('roles_name_unique').on(table.name),
  ],
);
