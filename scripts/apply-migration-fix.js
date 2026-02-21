const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/crmdatabase';

async function applyMigrationFix() {
    const pool = new Pool({ connectionString });
    
    try {
        console.log('🔄 Connecting to database...');
        console.log('   Database:', connectionString.replace(/:[^:@]+@/, ':****@'));
        console.log('');
        
        // Step 1: Mark migration 0008 as applied
        console.log('📝 Step 1: Recording migration 0008 as applied...');
        await pool.query(`
            INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
            VALUES (
                8, 
                'ALTER TABLE "roles" ADD COLUMN "is_super_admin" boolean DEFAULT false NOT NULL;',
                EXTRACT(EPOCH FROM NOW()) * 1000
            )
            ON CONFLICT (id) DO NOTHING
        `);
        console.log('   ✓ Migration 0008 recorded');
        console.log('');
        
        // Step 2: Drop old unique constraints
        console.log('📝 Step 2: Dropping old global unique constraints...');
        await pool.query('ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_unique"');
        console.log('   ✓ Dropped users_username_unique');
        
        await pool.query('ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_mobile_unique"');
        console.log('   ✓ Dropped users_mobile_unique');
        
        await pool.query('ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique"');
        console.log('   ✓ Dropped users_email_unique');
        console.log('');
        
        // Step 3: Add new composite unique constraints
        console.log('📝 Step 3: Adding new organization-scoped unique constraints...');
        
        try {
            await pool.query(`
                ALTER TABLE "users" 
                ADD CONSTRAINT "users_organization_username_unique" 
                UNIQUE("organization_id","username")
            `);
            console.log('   ✓ Added users_organization_username_unique');
        } catch (e) {
            if (e.code === '42P07') {
                console.log('   ⚠ users_organization_username_unique already exists');
            } else {
                throw e;
            }
        }
        
        try {
            await pool.query(`
                ALTER TABLE "users" 
                ADD CONSTRAINT "users_organization_mobile_unique" 
                UNIQUE("organization_id","mobile")
            `);
            console.log('   ✓ Added users_organization_mobile_unique');
        } catch (e) {
            if (e.code === '42P07') {
                console.log('   ⚠ users_organization_mobile_unique already exists');
            } else {
                throw e;
            }
        }
        
        try {
            await pool.query(`
                ALTER TABLE "users" 
                ADD CONSTRAINT "users_organization_email_unique" 
                UNIQUE("organization_id","email")
            `);
            console.log('   ✓ Added users_organization_email_unique');
        } catch (e) {
            if (e.code === '42P07') {
                console.log('   ⚠ users_organization_email_unique already exists');
            } else {
                throw e;
            }
        }
        console.log('');
        
        // Step 4: Record migration 0009 as applied
        console.log('📝 Step 4: Recording migration 0009 as applied...');
        await pool.query(`
            INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
            VALUES (
                9,
                'ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_mobile_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_username_unique" UNIQUE("organization_id","username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_mobile_unique" UNIQUE("organization_id","mobile");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_email_unique" UNIQUE("organization_id","email");',
                EXTRACT(EPOCH FROM NOW()) * 1000
            )
            ON CONFLICT (id) DO NOTHING
        `);
        console.log('   ✓ Migration 0009 recorded');
        console.log('');
        
        // Verify
        console.log('🔍 Verifying migrations...');
        const result = await pool.query(`
            SELECT id, created_at 
            FROM drizzle.__drizzle_migrations 
            WHERE id IN (8, 9)
            ORDER BY id
        `);
        
        console.log('   Applied migrations:');
        result.rows.forEach(row => {
            const date = new Date(parseInt(row.created_at));
            console.log(`   - Migration ${row.id}: ${date.toISOString()}`);
        });
        console.log('');
        
        console.log('✅ Migration fix completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Restart your application: npm run start:dev');
        console.log('2. Test user creation with different organizations');
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error applying migration fix:');
        console.error('   ', error.message);
        console.error('');
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

console.log('');
console.log('═══════════════════════════════════════');
console.log('  Migration Fix Script');
console.log('═══════════════════════════════════════');
console.log('');

applyMigrationFix();
