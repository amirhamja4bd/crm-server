import { permissions } from '@/modules/permissions/schemas/schema';
import { roles } from '@/modules/roles/schemas/schema';
import { index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const role_permissions = pgTable(
  'role_permissions',
  {
    ...commonSchemaFieldsWithId,
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('role_permissions_role_id_idx').on(table.roleId),
    index('role_permissions_permission_id_idx').on(table.permissionId),
    uniqueIndex('role_permissions_role_permission_unique').on(table.roleId, table.permissionId),
  ],
);
