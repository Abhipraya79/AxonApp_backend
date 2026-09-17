import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'axon_sales_try',
  port: Number(process.env.DB_PORT) || 5432,
  max: 10 // Mirip dengan connectionLimit di MySQL
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Connected successfully to PostgreSQL Database: ${process.env.DB_NAME}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    return false;
  }
};

export default pool;