// import logger from './logger';
import { logger } from 'shared';
/**
 * Standard error response format for services
 */
export interface ServiceErrorResponse {
  success: false;
  error: {
    message: string;
    details?: any;
  };
}

/**
 * Standard success response format for services
 */
export interface ServiceSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Generic service response type
 */
export type ServiceResponse<T> = ServiceSuccessResponse<T> | ServiceErrorResponse;

/**
 * Handle service-level errors in a consistent way
 */
export const handleServiceError = (error: any, serviceName: string, operation: string): ServiceErrorResponse => {
  if (error instanceof Error) {
    logger.error(`Error in ${serviceName}.${operation}: ${error.message}`, { error });
    
    if (error.stack) {
      logger.debug(error.stack);
    }
    
    return { 
      success: false, 
      error: { message: error.message }
    };
  } else {
    logger.error(`Unknown error in ${serviceName}.${operation}:`, { error });
    
    return { 
      success: false, 
      error: { message: `Unknown error in ${operation}` }
    };
  }
};

/**
 * Create a success response
 */
export const createServiceSuccessResponse = <T>(data: T): ServiceSuccessResponse<T> => {
  return {
    success: true,
    data
  };
};

/**
 * Create an error response
 */
export const createServiceErrorResponse = (message: string, details?: any): ServiceErrorResponse => {
  return {
    success: false,
    error: {
      message,
      ...(details && { details })
    }
  };
};