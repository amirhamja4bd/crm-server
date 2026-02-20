import { index, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const permissions = pgTable(
  'permissions',
  {
    ...commonSchemaFieldsWithId,
    resource: varchar('resource', { length: 100 }).notNull(),
    action: varchar('action', { length: 50 }).notNull(),
  },
  (table) => [
    index('permissions_organization_id_idx').on(table.organizationId),
    index('permissions_resource_idx').on(table.resource),
    index('permissions_action_idx').on(table.action),
    uniqueIndex('permissions_org_resource_action_unique').on(
      table.organizationId,
      table.resource,
      table.action,
    ),
  ],
);
