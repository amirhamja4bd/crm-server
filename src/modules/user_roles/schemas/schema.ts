import { roles } from '@/modules/roles/schemas/schema';
import { users } from '@/modules/users/schemas/schema';
import { index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const user_roles = pgTable(
  'user_roles',
  {
    ...commonSchemaFieldsWithId,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('user_roles_user_id_idx').on(table.userId),
    index('user_roles_role_id_idx').on(table.roleId),
    uniqueIndex('user_roles_user_role_unique').on(table.userId, table.roleId),
  ],
);
