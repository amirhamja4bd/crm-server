ALTER TABLE "organizations" DROP CONSTRAINT "organizations_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "subscription_plans" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "subscription_plans" DROP COLUMN "is_organization_owner";