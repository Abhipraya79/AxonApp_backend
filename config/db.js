import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'classicmodels',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected successfully to MySQL Database: ${process.env.DB_NAME || 'classicmodels'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    return false;
  }
};

export default pool;
