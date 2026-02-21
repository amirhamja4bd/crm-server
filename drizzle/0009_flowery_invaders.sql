ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_mobile_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_username_unique" UNIQUE("organization_id","username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_mobile_unique" UNIQUE("organization_id","mobile");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_email_unique" UNIQUE("organization_id","email");