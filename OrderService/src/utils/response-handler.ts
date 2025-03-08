import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import logger from './logger';

/**
 * Extract validation errors into a flat, readable format
 */
export const extractValidationErrors = (errors: ValidationError[]): any[] => {
  const result: any[] = [];
  
  const processError = (error: ValidationError, parentPath = ''): void => {
    // Add direct constraints if they exist
    if (error.constraints) {
      result.push({
        property: parentPath ? `${parentPath}.${error.property}` : error.property,
        value: error.value,
        constraints: error.constraints
      });
    }
    
    // Process children recursively
    if (error.children && error.children.length > 0) {
      for (const child of error.children) {
        let newPath: string;
        
        // For array items (numeric property names)
        if (!isNaN(Number(child.property))) {
          newPath = parentPath ? `${parentPath}[${child.property}]` : `${error.property}[${child.property}]`;
        } else {
          // For object properties
          newPath = parentPath ? `${parentPath}.${error.property}.${child.property}` : `${error.property}.${child.property}`;
        }
        
        processError(child, newPath);
      }
    }
  };
  
  // Process each top-level error
  for (const error of errors) {
    processError(error);
  }
  
  return result;
};

/**
 * Send a validation error response
 */
export const sendValidationErrorResponse = (req: Request, res: Response, errors: ValidationError[], startTime: number): void => {
  const formattedErrors = extractValidationErrors(errors);
  const response = {
    success: false,
    message: 'Validation failed',
    errors: formattedErrors
  };
  
  res.status(400).json(response);
  logger.logResponse(req.method, req.path, 400, response, Date.now() - startTime);
};

/**
 * Ensure user is authenticated and return false if not
 */
export const ensureAuthenticated = (req: Request, res: Response, startTime: number): boolean => {
  if (!req.user) {
    const response = { message: 'User not authenticated' };
    res.status(401).json(response);
    logger.logResponse(req.method, req.path, 401, response, Date.now() - startTime);
    return false;
  }
  return true;
};

/**
 * Handle controller errors in a consistent way
 */
export const handleControllerError = (req: Request, res: Response, error: any, startTime: number): void => {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  logger.error(`Error in ${req.method} ${req.path}:`, { error });
  
  const response = { 
    success: false,
    message: errorMessage 
  };
  
  res.status(500).json(response);
  logger.logResponse(req.method, req.path, 500, response, Date.now() - startTime);
};

/**
 * Send a success response with standardized format
 */
export const sendSuccessResponse = (
  req: Request, 
  res: Response, 
  statusCode: number, 
  data: any, 
  message: string,
  startTime: number
): void => {
  const response = {
    success: true,
    message,
    ...data
  };
  
  res.status(statusCode).json(response);
  logger.logResponse(req.method, req.path, statusCode, response, Date.now() - startTime);
};

/**
 * Send an error response with standardized format
 */
export const sendErrorResponse = (
  req: Request, 
  res: Response, 
  statusCode: number, 
  message: string,
  details?: any,
  startTime?: number
): void => {
  const endTime = startTime ? Date.now() - startTime : undefined;
  
  const response = {
    success: false,
    message,
    ...(details && { details })
  };
  
  res.status(statusCode).json(response);
  logger.logResponse(req.method, req.path, statusCode, response, endTime);
};

/**
 * Verify request parameters
 */
export const verifyParam = (
  req: Request, 
  res: Response, 
  param: string, 
  errorMessage: string,
  startTime: number
): boolean => {
  const value = req.params[param] || req.body[param];
  
  if (!value) {
    sendErrorResponse(req, res, 400, errorMessage, undefined, startTime);
    return false;
  }
  
  return true;
};