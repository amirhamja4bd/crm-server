DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'permissions'
  ) THEN
    CREATE TABLE "permissions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "is_deleted" boolean DEFAULT false NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      "resource" varchar(100) NOT NULL,
      "action" varchar(50) NOT NULL
    );
    CREATE INDEX "permissions_resource_idx" ON "permissions" USING btree ("resource");
    CREATE INDEX "permissions_action_idx" ON "permissions" USING btree ("action");
    CREATE UNIQUE INDEX "permissions_resource_action_unique"
      ON "permissions" USING btree ("resource","action");
  ELSE
    ALTER TABLE "permissions" DROP CONSTRAINT IF EXISTS "permissions_organization_id_organizations_id_fk";
    DROP INDEX IF EXISTS "permissions_organization_id_idx";
    DROP INDEX IF EXISTS "permissions_org_resource_action_unique";
    DELETE FROM "permissions" a
    USING "permissions" b
    WHERE a.resource = b.resource AND a.action = b.action AND a.id > b.id;
    ALTER TABLE "permissions" DROP COLUMN IF EXISTS "organization_id";
    ALTER TABLE "permissions" DROP COLUMN IF EXISTS "is_organization_owner";
    CREATE UNIQUE INDEX IF NOT EXISTS "permissions_resource_action_unique"
      ON "permissions" USING btree ("resource","action");
  END IF;
END $$;
