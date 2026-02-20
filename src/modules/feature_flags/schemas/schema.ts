import { boolean, index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const feature_flags = pgTable(
  'feature_flags',
  {
    ...commonSchemaFieldsWithId,
    name: varchar('name', { length: 255 }).notNull().default(''),
    description: varchar('description', { length: 500 }).notNull().default(''),
    enabled: boolean('enabled').notNull().default(false),
    allowedPlanIds: uuid('allowed_plan_ids').array().notNull().default([]),
    releasedAt: timestamp('released_at'),
  },
  (table) => [
    index('feature_flags_name_idx').on(table.name),
    index('feature_flags_released_at_idx').on(table.releasedAt),
  ],
);
