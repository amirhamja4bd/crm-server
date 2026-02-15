-- Ensure pgcrypto (for gen_random_uuid) is available so we can generate uuids
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop any existing default (serial sequence) so we can change the column type safely
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;

-- Convert existing integer ids to UUIDs using a generated UUID per row, then set default
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();