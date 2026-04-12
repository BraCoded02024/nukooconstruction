const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.com') 
    ? { rejectUnauthorized: false } 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

const initializeDatabase = async () => {
  try {
    // Check if users table exists as a proxy for all tables
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    const { rows } = await pool.query(checkTableQuery);
    const tablesExist = rows[0].exists;

    if (!tablesExist) {
      console.log('Database tables not found. Initializing database...');
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      await pool.query(schemaSql);
      console.log('Database initialized successfully.');
    } else {
      try {
        console.log('Database tables already exist. Checking for missing columns...');
        
        // Ensure 'email' exists in 'leads' table
        await pool.query(`
          DO $$ 
          BEGIN 
            IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='leads' AND column_name='email') THEN
              ALTER TABLE leads ADD COLUMN email VARCHAR(255);
            END IF;
          END $$;
        `);

        // Ensure 'public_id' exists in 'documents' table
      await pool.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='documents' AND column_name='public_id') THEN
            ALTER TABLE documents ADD COLUMN public_id TEXT;
          END IF;
        END $$;
      `);

      // Ensure 'price' is a string (VARCHAR) instead of DECIMAL/NUMERIC
      await pool.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name='properties' 
            AND column_name='price' 
            AND data_type IN ('numeric', 'decimal')
          ) THEN
            ALTER TABLE properties ALTER COLUMN price TYPE VARCHAR(255);
          END IF;
        END $$;
      `);

      // Ensure 'appointments' table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            client_name VARCHAR(255) NOT NULL,
            client_email VARCHAR(255) NOT NULL,
            client_phone VARCHAR(50),
            visit_date DATE NOT NULL,
            visit_time TIME NOT NULL,
            purpose TEXT,
            status VARCHAR(50) DEFAULT 'scheduled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('Database structure verified.');
      } catch (error) {
        console.error('Error during database structure verification:', error.message);
        // We don't exit here because the tables might be fine, just the check failed
      }
    }
    
    console.log('Database verification complete.');
  } catch (error) {
    console.error('CRITICAL: Error initializing database:', error);
    process.exit(1);
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
