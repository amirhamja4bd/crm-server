import { modules } from '@/modules/modules';
import { organizations } from '@/modules/organizations';
import { index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const organization_modules = pgTable(
  'organization_modules',
  {
    ...commonSchemaFieldsWithId,
    moduleId: uuid('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('organization_modules_module_id_idx').on(table.moduleId),
    index('organization_modules_organization_id_idx').on(table.organizationId),
    uniqueIndex('organization_modules_org_module_unique').on(table.organizationId, table.moduleId),
  ],
);
