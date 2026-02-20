import { boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import * as path from 'path';

function getOrganizationsId() {
  const schemaPath = path.join(__dirname, '../../modules/organizations/schemas/schema');
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Lazy sync load to avoid circular dependency
  const { organizations } = require(schemaPath);
  return organizations.id;
}

/**
 * Common fields for database schemas.
 * organizationId references organizations.id via lazy callback to avoid circular imports.
 */
export const commonSchemaFields = {
  organizationId: uuid('organization_id')
    .notNull()
    .references(getOrganizationsId, { onDelete: 'cascade' }),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  isOrganizationOwner: boolean('is_organization_owner').notNull().default(false),
};

export const commonSchemaFieldsWithId = {
  id: uuid('id').primaryKey().defaultRandom(),
  ...commonSchemaFields,
};
