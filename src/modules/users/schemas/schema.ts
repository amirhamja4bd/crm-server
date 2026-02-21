import { boolean, index, pgEnum, pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core';
import { USER_STATUS } from 'src/enum/user-status.enum';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

const userStatusEnum = pgEnum('user_status', USER_STATUS);

export const users = pgTable(
  'users',
  {
    ...commonSchemaFieldsWithId,
    name: varchar('name', { length: 255 }).notNull().default(''),
    username: varchar('username', { length: 100 }).notNull(),
    mobile: varchar('mobile', { length: 50 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    avatar: varchar('avatar', { length: 500 }).notNull().default(''),
    isOrganizationOwner: boolean('is_organization_owner').notNull().default(false),
    status: userStatusEnum('status').notNull().default('pending'),
    refreshToken: varchar('refresh_token', { length: 500 }).notNull().default(''),
    lastLoginAt: timestamp('last_login_at').notNull().defaultNow(),
    isVerified: boolean('is_verified').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    is2FAEnabled: boolean('is_2fa_enabled').notNull().default(false),
  },
  (table) => [
    index('users_organization_id_idx').on(table.organizationId),
    index('users_status_idx').on(table.status),
    index('users_is_active_idx').on(table.isActive),
    index('users_organization_active_idx').on(table.organizationId, table.isActive),
    index('users_id_idx').on(table.id),
    unique('users_organization_username_unique').on(table.organizationId, table.username),
    unique('users_organization_mobile_unique').on(table.organizationId, table.mobile),
    unique('users_organization_email_unique').on(table.organizationId, table.email),
  ],
);
