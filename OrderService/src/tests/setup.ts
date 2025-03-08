import dotenv from 'dotenv';
// Load test env
dotenv.config({ path: '.env.test' });

process.env.PORT = process.env.PORT || '3002';
process.env.DB_CONNECTION_URL = process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/orderServiceTest';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret';
process.env.INTERNAL_ACCESS_TOKEN = process.env.INTERNAL_ACCESS_TOKEN || 'test-internal-token';
process.env.PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000';
process.env.USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
