-- Migration script to update user unique constraints
-- This script will:
-- 1. Check for duplicate users within organizations
-- 2. Drop old unique constraints
-- 3. Add new composite unique constraints

-- Step 1: Check for duplicates (informational query)
-- Uncomment to see if there are any duplicates
-- SELECT organization_id, email, COUNT(*) 
-- FROM users 
-- WHERE is_deleted = false 
-- GROUP BY organization_id, email 
-- HAVING COUNT(*) > 1;

-- SELECT organization_id, username, COUNT(*) 
-- FROM users 
-- WHERE is_deleted = false 
-- GROUP BY organization_id, username 
-- HAVING COUNT(*) > 1;

-- SELECT organization_id, mobile, COUNT(*) 
-- FROM users 
-- WHERE is_deleted = false 
-- GROUP BY organization_id, mobile 
-- HAVING COUNT(*) > 1;

-- Step 2: Apply the migration
BEGIN;

-- Drop old unique constraints
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_unique";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_mobile_unique";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";

-- Add new composite unique constraints (organization_id + field)
ALTER TABLE "users" ADD CONSTRAINT "users_organization_username_unique" UNIQUE("organization_id","username");
ALTER TABLE "users" ADD CONSTRAINT "users_organization_mobile_unique" UNIQUE("organization_id","mobile");
ALTER TABLE "users" ADD CONSTRAINT "users_organization_email_unique" UNIQUE("organization_id","email");

COMMIT;
