import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import requestLogger from './middleware/logger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';

import healthRoutes from './routes/healthRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Middleware
app.use(helmet());

// CORS Configuration for Vite Frontend
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(requestLogger);

// Base API Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AxonApp Sales BI Dashboard API is running!',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server and Test DB Pool
app.listen(PORT, async () => {
  console.log(`=================================`);
  console.log(`🚀 AxonApp Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Client URL: ${CLIENT_URL}`);
  console.log(`=================================`);

  // Verify Database Connection
  await testConnection();
});
