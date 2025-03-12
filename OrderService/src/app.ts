import dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config(); // Load environment variables early

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import orderRoutes from './routes/order.routes';
import { logger } from 'shared';

// Ensure DB connection string exists
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
if (!DB_CONNECTION_URL) {
  throw new Error("DB_CONNECTION_URL is not set in environment variables");
}

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env['LOGGER_MIDDLEWARE_FORMAT'] || 'dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Routes
app.use('/orders', orderRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.send('Order Service API');
});

// Connect to server and DB
const startServer = async () => {
  try {
    logger.info(`Connecting to MongoDB...`);
    await mongoose.connect(DB_CONNECTION_URL);
    logger.info('Connected to MongoDB database successfully');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Order service running on port ${PORT}`);
      });
    } else {
      logger.info('Running in test mode - not starting server');
    }
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

// Run server
startServer().catch(err => logger.error('Failed to start server:', err));

export default app;