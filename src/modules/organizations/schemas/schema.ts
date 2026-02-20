import { SUBSCRIPTION_PLAN_STATUS_ENUM } from '@/enum/subscription-plan-status.enum';
import { subscription_plans } from '../../subscription_plans/schemas/schema';
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

const subscriptionPlanStatusEnum = pgEnum(
  'subscription_plan_status',
  SUBSCRIPTION_PLAN_STATUS_ENUM,
);

export const organizations = pgTable(
  'organizations',
  {
    ...commonSchemaFieldsWithId,
    name: varchar('name', { length: 255 }).notNull().default(''),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 50 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    domain: varchar('domain', { length: 255 }).notNull().unique(),
    logo: varchar('logo', { length: 500 }).notNull().default(''),
    website: varchar('website', { length: 500 }).notNull().default(''),
    isPublic: boolean('is_public').notNull().default(false),
    isVerified: boolean('is_verified').notNull().default(false),
    isTrial: boolean('is_trial').notNull().default(true),
    trialExpiresAt: timestamp('trial_expires_at').notNull().defaultNow(),
    timezone: varchar('timezone', { length: 100 }).notNull().default(''),
    currency: varchar('currency', { length: 10 }).notNull().default(''),
    subscriptionPlanId: uuid('subscription_plan_id')
      .notNull()
      .references(() => subscription_plans.id, { onDelete: 'cascade' }),
    subscriptionPlanStatus: subscriptionPlanStatusEnum('subscription_plan_status')
      .notNull()
      .default(SUBSCRIPTION_PLAN_STATUS_ENUM[0]),
    organizationDetails: jsonb('organization_details').notNull().default({
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      latitude: 0,
      longitude: 0,
    }),
    socialMedia: jsonb('social_media').notNull().default({
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
    }),
  },
  (table) => [
    index('organizations_id_idx').on(table.id),
    index('organizations_subscription_plan_id_idx').on(table.subscriptionPlanId),
    index('organizations_subscription_plan_status_idx').on(table.subscriptionPlanStatus),
    index('organizations_is_public_idx').on(table.isPublic),
    index('organizations_slug_idx').on(table.slug),
    index('organizations_domain_idx').on(table.domain),
  ],
);
