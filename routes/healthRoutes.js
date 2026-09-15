import express from 'express';
import { testConnection } from '../config/db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbConnected = await testConnection();

  res.status(dbConnected ? 200 : 500).json({
    success: dbConnected,
    status: dbConnected ? 'UP' : 'DOWN',
    message: dbConnected
      ? 'AxonApp Backend & Database Connection are Healthy'
      : 'Backend is running but Database Connection Failed',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
