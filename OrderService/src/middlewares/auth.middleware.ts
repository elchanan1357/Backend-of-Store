import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserPayload } from '../types/user';
import logger from '../utils/logger';
import { sendErrorResponse } from '../utils/response-handler';

dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

/**
 * Middleware to verify user is authenticated
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies['auth-token'] || req.header('auth-token');

  if (!token) {
    sendErrorResponse(req, res, 401, 'Access denied. No token provided.');
    return;
  }

  try {
    const verified = jwt.verify(token, SESSION_SECRET) as UserPayload;
    req.user = verified;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    sendErrorResponse(req, res, 400, 'Invalid token.');
    return;
  }
};

/**
 * Middleware to verify user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    sendErrorResponse(req, res, 401, 'Not authenticated');
    return;
  }

  if (req.user.role !== 'admin') {
    sendErrorResponse(req, res, 403, 'Access denied. Admin role required.');
    return;
  }

  next();
};

/**
 * Middleware to verify internal service token
 */
export const validateInternalToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('internal-access-token');
  const expectedToken = process.env.INTERNAL_ACCESS_TOKEN || 'test-internal-token';

  // Debug log
  logger.debug('Validating internal token', {
    receivedToken: token ? 'has token' : 'no token',
    expectedEnvToken: process.env.INTERNAL_ACCESS_TOKEN ? 'has env token' : 'no env token',
    environment: process.env.NODE_ENV || 'undefined'
  });

  if (!token || token !== expectedToken) {
    sendErrorResponse(req, res, 403, 'Access denied. Invalid internal token.');
    return;
  }

  next();
};