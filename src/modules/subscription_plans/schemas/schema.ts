import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const subscription_plans = pgTable(
  'subscription_plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    isDeleted: boolean('is_deleted').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: varchar('description', { length: 1000 }).notNull().default(''),
    price: real('price').notNull().default(0),
    currency: varchar('currency', { length: 10 }).notNull().default('USD'),
    billingCycle: varchar('billing_cycle', { length: 50 }).notNull().default('monthly'),
    maxUsers: integer('max_users').notNull().default(0),
    trialPeriodDays: integer('trial_period_days').notNull().default(0),
    features: jsonb('features').notNull().default([]),
    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    trialExpiresAt: timestamp('trial_expires_at'),
  },
  (table) => [
    index('subscription_plans_id_idx').on(table.id),
    index('subscription_plans_is_active_idx').on(table.isActive),
  ],
);
