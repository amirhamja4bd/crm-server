import { boolean, index, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { feature_flags } from 'src/modules/feature_flags/schemas/schema';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const organization_feature_flags = pgTable(
  'organization_feature_flags',
  {
    ...commonSchemaFieldsWithId,
    featureId: uuid('feature_id')
      .notNull()
      .references(() => feature_flags.id, { onDelete: 'cascade' }),
    enabled: boolean('enabled').notNull().default(false),
  },
  (table) => [
    index('organization_feature_flags_feature_id_idx').on(table.featureId),
    index('organization_feature_flags_organization_id_idx').on(table.organizationId),
    uniqueIndex('organization_feature_flags_feature_org_unique').on(
      table.featureId,
      table.organizationId,
    ),
  ],
);
