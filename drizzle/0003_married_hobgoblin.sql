CREATE TYPE "subscription_plan_status" AS ENUM (
	'trial',
	'active',
	'inactive',
	'pending',
	'blocked'
);
--> statement-breakpoint
CREATE TYPE "user_status" AS ENUM (
	'active',
	'inactive',
	'pending',
	'blocked'
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"description" varchar(500) DEFAULT '' NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"allowed_plan_ids" uuid[] DEFAULT '{}' NOT NULL,
	"released_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"description" varchar(500) DEFAULT '' NOT NULL,
	"icon" varchar(255) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"feature_id" uuid NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"module_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"logo" varchar(500) DEFAULT '' NOT NULL,
	"website" varchar(500) DEFAULT '' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_trial" boolean DEFAULT true NOT NULL,
	"trial_expires_at" timestamp DEFAULT now() NOT NULL,
	"timezone" varchar(100) DEFAULT '' NOT NULL,
	"currency" varchar(10) DEFAULT '' NOT NULL,
	"subscription_plan_id" uuid NOT NULL,
	"subscription_plan_status" "subscription_plan_status" DEFAULT 'trial' NOT NULL,
	"organization_details" jsonb DEFAULT '{"address":"","city":"","state":"","zip":"","country":"","latitude":0,"longitude":0}'::jsonb NOT NULL,
	"social_media" jsonb DEFAULT '{"facebookUrl":"","instagramUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":"","tiktokUrl":""}'::jsonb NOT NULL,
	CONSTRAINT "organizations_email_unique" UNIQUE("email"),
	CONSTRAINT "organizations_phone_unique" UNIQUE("phone"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organizations_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"resource" varchar(100) NOT NULL,
	"action" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000) DEFAULT '' NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"billing_cycle" varchar(50) DEFAULT 'monthly' NOT NULL,
	"max_users" integer DEFAULT 0 NOT NULL,
	"trial_period_days" integer DEFAULT 0 NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"trial_expires_at" timestamp,
	CONSTRAINT "subscription_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_organization_owner" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING (CASE WHEN status = true THEN 'active'::user_status ELSE 'inactive'::user_status END);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_deleted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
UPDATE "users" SET "organization_id" = (SELECT "id" FROM "organizations" LIMIT 1) WHERE "organization_id" IS NULL;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM "users" WHERE "organization_id" IS NULL) THEN ALTER TABLE "users" ALTER COLUMN "organization_id" SET NOT NULL; END IF; END $$;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_organization_owner" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(100) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile" varchar(50) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_2fa_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_feature_flags" ADD CONSTRAINT "organization_feature_flags_feature_id_feature_flags_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."feature_flags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_modules" ADD CONSTRAINT "organization_modules_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_modules" ADD CONSTRAINT "organization_modules_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_subscription_plan_id_subscription_plans_id_fk" FOREIGN KEY ("subscription_plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feature_flags_name_idx" ON "feature_flags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "feature_flags_released_at_idx" ON "feature_flags" USING btree ("released_at");--> statement-breakpoint
CREATE INDEX "organization_feature_flags_feature_id_idx" ON "organization_feature_flags" USING btree ("feature_id");--> statement-breakpoint
CREATE INDEX "organization_feature_flags_organization_id_idx" ON "organization_feature_flags" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_feature_flags_feature_org_unique" ON "organization_feature_flags" USING btree ("feature_id","organization_id");--> statement-breakpoint
CREATE INDEX "organization_modules_module_id_idx" ON "organization_modules" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "organization_modules_organization_id_idx" ON "organization_modules" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_modules_org_module_unique" ON "organization_modules" USING btree ("organization_id","module_id");--> statement-breakpoint
CREATE INDEX "organizations_id_idx" ON "organizations" USING btree ("id");--> statement-breakpoint
CREATE INDEX "organizations_subscription_plan_id_idx" ON "organizations" USING btree ("subscription_plan_id");--> statement-breakpoint
CREATE INDEX "organizations_subscription_plan_status_idx" ON "organizations" USING btree ("subscription_plan_status");--> statement-breakpoint
CREATE INDEX "organizations_is_public_idx" ON "organizations" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "organizations_domain_idx" ON "organizations" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "permissions_organization_id_idx" ON "permissions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "permissions_resource_idx" ON "permissions" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "permissions_action_idx" ON "permissions" USING btree ("action");--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_org_resource_action_unique" ON "permissions" USING btree ("organization_id","resource","action");--> statement-breakpoint
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "role_permissions_role_permission_unique" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE INDEX "roles_name_idx" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_name_unique" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE INDEX "subscription_plans_id_idx" ON "subscription_plans" USING btree ("id");--> statement-breakpoint
CREATE INDEX "subscription_plans_is_active_idx" ON "subscription_plans" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_id_idx" ON "user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_unique" ON "user_roles" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "users_organization_id_idx" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_organization_active_idx" ON "users" USING btree ("organization_id","is_active");--> statement-breakpoint
CREATE INDEX "users_id_idx" ON "users" USING btree ("id");--> statement-breakpoint
UPDATE "users" SET "username" = 'user_' || REPLACE("id"::text, '-', '') WHERE "username" = '';--> statement-breakpoint
UPDATE "users" SET "mobile" = 'mobile_' || REPLACE("id"::text, '-', '') WHERE "mobile" = '';--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_mobile_unique" UNIQUE("mobile");