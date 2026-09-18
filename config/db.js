import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const testConnection = async () => {
  try {
    // Jalankan query paling ringan untuk mengetes koneksi
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Connected successfully to PostgreSQL via Prisma ORM`);
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    return false;
  }
};

export default prisma;