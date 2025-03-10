import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_CONNECTION_URL || '',
  sessionSecret: process.env.SESSION_SECRET || 'supersecret',
  internalAccessToken: process.env.INTERNAL_ACCESS_TOKEN || 'default-internal-token',
  authTokenKey: process.env.AUTH_TOKEN_KEY || 'auth-token',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
};