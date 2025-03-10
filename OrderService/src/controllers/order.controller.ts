import { Request, Response } from 'express';
import orderService from '../services/order.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto } from '../dtos/create-order.dto';
import logger from '../utils/logger';
import {
  handleControllerError,
  sendValidationErrorResponse,
  ensureAuthenticated,
  sendSuccessResponse,
  sendErrorResponse,
  verifyParam
} from '../utils/response-handler';

export class OrderController {
  /**
   * Create a new order
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, req.body);

      if (!ensureAuthenticated(req, res, startTime)) {
        return;
      }

      // Use class-validator for validation
      const orderDto = plainToClass(CreateOrderDto, req.body);
      const errors = await validate(orderDto, { whitelist: true, forbidNonWhitelisted: true });

      if (errors.length > 0) {
        sendValidationErrorResponse(req, res, errors, startTime);
        return;
      }

      const { items, shippingAddress } = orderDto;
      logger.info(`Creating order for user ${req.user!.id} with ${items.length} items`);
      
      const result = await orderService.createOrder(req.user!.id, items, shippingAddress);

      if (!result.success) {
        // Handle error from the products server
        const statusCode = result.error?.details?.error?.status || 400;
        sendErrorResponse(
          req, 
          res, 
          statusCode, 
          result.error.message, 
          result.error.details, 
          startTime
        );
        return;
      }

      sendSuccessResponse(
        req, 
        res, 
        201, 
        { order: result.data.order }, 
        'Order created successfully', 
        startTime
      );
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, null);
      
      if (!ensureAuthenticated(req, res, startTime)) {
        return;
      }

      if (!verifyParam(req, res, 'id', 'Order ID is required', startTime)) {
        return;
      }

      const orderId = req.params.id;
      const order = await orderService.getOrderById(orderId);

      if (!order) {
        sendErrorResponse(req, res, 404, 'Order not found', undefined, startTime);
        return;
      }

      // Only admin or the order owner can view it
      if (req.user!.role !== 'admin' && order.userId.toString() !== req.user!.id) {
        sendErrorResponse(req, res, 403, 'Access denied', undefined, startTime);
        return;
      }

      sendSuccessResponse(req, res, 200, order, 'Order retrieved successfully', startTime);
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }

  /**
   * Get orders for the logged-in user
   */
  async getUserOrders(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, null);
      
      if (!ensureAuthenticated(req, res, startTime)) {
        return;
      }

      const orders = await orderService.getOrdersByUserId(req.user!.id);
      
      sendSuccessResponse(req, res, 200, { orders }, 'User orders retrieved successfully', startTime);
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }

  /**
   * Get all orders (for admin)
   */
  async getAllOrders(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, req.query);
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;

      const orders = await orderService.getAllOrders(limit, page);
      
      sendSuccessResponse(req, res, 200, { orders, pagination: { page, limit } }, 'Orders retrieved successfully', startTime);
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, req.body);
      
      if (!ensureAuthenticated(req, res, startTime)) {
        return;
      }

      if (!verifyParam(req, res, 'id', 'Order ID is required', startTime)) {
        return;
      }

      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        sendErrorResponse(
          req, 
          res, 
          400, 
          `Valid status (${validStatuses.join(', ')}) is required`,
          undefined,
          startTime
        );
        return;
      }

      const updatedOrder = await orderService.updateOrderStatus(
        id,
        status as 'pending' | 'processing' | 'completed' | 'cancelled'
      );

      if (!updatedOrder) {
        sendErrorResponse(req, res, 404, 'Order not found', undefined, startTime);
        return;
      }

      sendSuccessResponse(req, res, 200, { order: updatedOrder }, 'Order status updated successfully', startTime);
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }

  /**
   * Internal route to verify order exists (for other services)
   */
  async verifyOrderExists(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    
    try {
      logger.logRequest(req.method, req.path, req.body);
      
      if (!verifyParam(req, res, 'orderId', 'Order ID is required', startTime)) {
        return;
      }

      const { orderId } = req.body;
      const order = await orderService.getOrderById(orderId);
      
      if (!order) {
        sendErrorResponse(req, res, 404, 'Order not found', { exists: false }, startTime);
        return;
      }
      
      sendSuccessResponse(
        req, 
        res, 
        200, 
        { 
          exists: true, 
          orderId: order._id,
          status: order.status
        }, 
        'Order exists', 
        startTime
      );
    } catch (error) {
      handleControllerError(req, res, error, startTime);
    }
  }
}

export default new OrderController();