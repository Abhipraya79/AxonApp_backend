import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import requestLogger from './middleware/logger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';

import healthRoutes from './routes/healthRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import officeRoutes from './routes/officeRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';

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
    version: '2.0.0',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/performance', performanceRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server and Test DB Connection
app.listen(PORT, async () => {
  console.log(`=================================`);
  console.log(`🚀 AxonApp Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Client URL: ${CLIENT_URL}`);
  console.log(`📊 API Version: 2.0.0`);
  console.log(`=================================`);

  // Verify Database Connection
  await testConnection();
});
