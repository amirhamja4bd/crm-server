#!/bin/bash

# Script to fix migration issue and apply the user constraint changes

set -e

echo "================================"
echo "Migration Fix Script"
echo "================================"
echo ""

# Get database URL from environment or use default
DB_URL="${DATABASE_URL:-postgresql://postgres:password123@localhost:5432/crmdatabase}"

echo "Using database: $DB_URL"
echo ""

# Check if we can connect using docker
if command -v docker &> /dev/null; then
    echo "Checking for PostgreSQL container..."
    
    # Try to find postgres container
    CONTAINER_ID=$(docker ps --filter "ancestor=postgres" --format "{{.ID}}" | head -n 1)
    
    if [ ! -z "$CONTAINER_ID" ]; then
        echo "Found PostgreSQL container: $CONTAINER_ID"
        echo ""
        echo "Applying migration fix..."
        
        # Copy SQL file to container
        docker cp scripts/fix-migrations.sql $CONTAINER_ID:/tmp/fix-migrations.sql
        
        # Execute SQL file
        docker exec -i $CONTAINER_ID psql -U postgres -d crmdatabase -f /tmp/fix-migrations.sql
        
        echo ""
        echo "✓ Migration fix applied successfully!"
        exit 0
    fi
fi

# If docker method didn't work, try using node-postgres
echo "Attempting to apply migration using Node.js..."
echo ""

# Create a temporary Node.js script
cat > /tmp/apply-migration.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/crmdatabase';

async function applyFix() {
    const pool = new Pool({ connectionString });
    
    try {
        console.log('Connecting to database...');
        
        // Read SQL file
        const sql = fs.readFileSync('./scripts/fix-migrations.sql', 'utf-8');
        
        console.log('Applying migration fix...');
        await pool.query(sql);
        
        console.log('\n✓ Migration fix applied successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

applyFix();
EOF

# Run the Node.js script
node /tmp/apply-migration.js

# Clean up
rm /tmp/apply-migration.js

echo ""
echo "================================"
echo "Migration fix completed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Restart your application: npm run start:dev"
echo "2. Test user creation with the test file: test-user-creation.http"
echo ""
