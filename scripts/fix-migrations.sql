-- Fix migration issue: Mark migration 0008 as applied and apply migration 0009
-- This script handles the case where is_super_admin column already exists

BEGIN;

-- Step 1: Check if is_super_admin column exists (informational)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'roles' AND column_name = 'is_super_admin'
    ) THEN
        RAISE NOTICE 'Column is_super_admin already exists in roles table';
    END IF;
END $$;

-- Step 2: Ensure migration 0008 is recorded as applied
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
VALUES (
    8, 
    'ALTER TABLE "roles" ADD COLUMN "is_super_admin" boolean DEFAULT false NOT NULL;',
    EXTRACT(EPOCH FROM NOW()) * 1000
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Apply migration 0009 - Drop old unique constraints
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_unique";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_mobile_unique";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";

-- Step 4: Add new composite unique constraints
ALTER TABLE "users" ADD CONSTRAINT "users_organization_username_unique" 
    UNIQUE("organization_id","username");
ALTER TABLE "users" ADD CONSTRAINT "users_organization_mobile_unique" 
    UNIQUE("organization_id","mobile");
ALTER TABLE "users" ADD CONSTRAINT "users_organization_email_unique" 
    UNIQUE("organization_id","email");

-- Step 5: Record migration 0009 as applied
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
VALUES (
    9,
    E'ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint\nALTER TABLE "users" DROP CONSTRAINT "users_mobile_unique";--> statement-breakpoint\nALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint\nALTER TABLE "users" ADD CONSTRAINT "users_organization_username_unique" UNIQUE("organization_id","username");--> statement-breakpoint\nALTER TABLE "users" ADD CONSTRAINT "users_organization_mobile_unique" UNIQUE("organization_id","mobile");--> statement-breakpoint\nALTER TABLE "users" ADD CONSTRAINT "users_organization_email_unique" UNIQUE("organization_id","email");',
    EXTRACT(EPOCH FROM NOW()) * 1000
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verify migrations
SELECT id, created_at, hash FROM drizzle.__drizzle_migrations ORDER BY id;

-- Verify constraints
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%username%' OR conname LIKE '%mobile%' OR conname LIKE '%email%';
