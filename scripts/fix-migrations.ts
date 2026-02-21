import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function fixMigrations() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/crmdatabase';
  
  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    console.log('Checking migration status...');
    
    // Check if migration 0008 is already applied
    const result = await pool.query(
      `SELECT * FROM drizzle.__drizzle_migrations WHERE hash = (
        SELECT hash FROM (VALUES 
          ('0008_colossal_loners')
        ) AS t(tag)
        WHERE tag = '0008_colossal_loners'
        LIMIT 1
      ) OR id >= 8`
    );
    
    console.log('Current migrations:', result.rows);

    // Check if is_super_admin column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'roles' AND column_name = 'is_super_admin'
    `);

    if (columnCheck.rows.length > 0) {
      console.log('✓ Column is_super_admin already exists in roles table');
      
      // Check if migration 0008 is recorded
      const migration8Check = await pool.query(`
        SELECT * FROM drizzle.__drizzle_migrations 
        WHERE id = 8
      `);

      if (migration8Check.rows.length === 0) {
        console.log('Manually marking migration 0008 as applied...');
        
        // Read the migration file to get its hash
        const migration8Path = path.join(__dirname, '../drizzle/0008_colossal_loners.sql');
        const migration8Content = fs.readFileSync(migration8Path, 'utf-8');
        
        // Insert migration record
        await pool.query(`
          INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
          VALUES (8, $1, $2)
          ON CONFLICT (id) DO NOTHING
        `, [migration8Content, Date.now()]);
        
        console.log('✓ Migration 0008 marked as applied');
      } else {
        console.log('✓ Migration 0008 already recorded');
      }
    }

    // Now apply migration 0009
    console.log('\nApplying migration 0009...');
    const migration9Path = path.join(__dirname, '../drizzle/0009_flowery_invaders.sql');
    const migration9Content = fs.readFileSync(migration9Path, 'utf-8');
    
    // Split by statement breakpoint and execute each statement
    const statements = migration9Content
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 80)}...`);
        await pool.query(statement);
        console.log('✓ Success');
      } catch (error: any) {
        if (error.code === '42P07' || error.code === '42710') {
          console.log('⚠ Already exists, skipping...');
        } else {
          throw error;
        }
      }
    }

    // Record migration 0009
    await pool.query(`
      INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
      VALUES (9, $1, $2)
      ON CONFLICT (id) DO NOTHING
    `, [migration9Content, Date.now()]);

    console.log('\n✓ All migrations applied successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixMigrations()
  .then(() => {
    console.log('\n✓ Migration fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration fix failed:', error);
    process.exit(1);
  });
