import Order, { IOrder, OrderItem } from '../models/order.model';
import productService from './product.service';
// import logger from '../utils/logger';
import { logger } from 'shared';

import { 
  handleServiceError, 
  createServiceSuccessResponse,
  createServiceErrorResponse,
  ServiceResponse
} from '../utils/service-error-handler';

export class OrderService {
  /**
   * Extract numeric price from string price format
   */
  private extractNumericPrice(priceString: string, itemName: string): number {
    const numericPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));
    if (isNaN(numericPrice)) {
      throw new Error(`Invalid price format for item ${itemName}: ${priceString}`);
    }
    return numericPrice;
  }
  
  /**
   * Calculate total amount from items with pricing
   */
  private calculateTotalAmount(items: Array<OrderItem & { numericPrice: number }>): number {
    const total = items.reduce(
      (sum, item) => sum + item.numericPrice * item.quantity,
      0
    );
    
    if (isNaN(total)) {
      throw new Error('Failed to calculate total amount - check item prices');
    }
    
    return total;
  }
  
  /**
   * Convert order items to product update format
   */
  private createProductUpdatePayload(items: OrderItem[]): Record<string, number> {
    return items.reduce((acc, item) => {
      acc[item.mkt] = item.quantity;
      return acc;
    }, {} as Record<string, number>);
  }
  
  /**
   * Create a new order
   */
  async createOrder(
    userId: string,
    items: OrderItem[],
    shippingAddress: {
      address: string;
    }
  ): Promise<ServiceResponse<{ order: IOrder }>> {
    try {
      logger.info(`Creating order for user ${userId} with ${items.length} items`);
      
      // Process item prices
      const itemsWithNumericPrices = items.map(item => ({
        ...item,
        numericPrice: this.extractNumericPrice(item.price, item.name)
      }));
      
      // Calculate total
      const totalAmount = this.calculateTotalAmount(itemsWithNumericPrices);
      logger.info(`Total order amount: ${totalAmount}`);

      // Create product update payload
      const productsToUpdate = this.createProductUpdatePayload(items);
      logger.info(`Products to update stock: ${JSON.stringify(productsToUpdate)}`);

      // Update product stock
      const stockUpdateResult = await productService.updateProductsStock(productsToUpdate);
      
      if (!stockUpdateResult.success) {
        logger.error('Stock update failed:', stockUpdateResult.error);
        return createServiceErrorResponse(
          'Failed to update product stock',
          stockUpdateResult.error
        );
      }
      
      logger.info('Stock update successful, creating order record');

      // Create and save order
      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        shippingAddress,
        status: 'pending',
      });

      const savedOrder = await newOrder.save();
      logger.info(`Order created successfully with ID: ${savedOrder._id}`);
      
      return createServiceSuccessResponse({ order: savedOrder });
    } catch (error) {
      return handleServiceError(error, 'OrderService', 'createOrder');
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<IOrder | null> {
    try {
      return await Order.findById(orderId);
    } catch (error) {
      logger.error('Error getting order:', error);
      return null;
    }
  }

  /**
   * Get all orders for a user
   */
  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ userId });
    } catch (error) {
      logger.error('Error getting user orders:', error);
      return [];
    }
  }

  /**
   * Get all orders (for admin)
   */
  async getAllOrders(limit = 50, page = 1): Promise<IOrder[]> {
    try {
      const skip = (page - 1) * limit;
      return await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      logger.error('Error getting all orders:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
  ): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating order status:', error);
      return null;
    }
  }
}

export default new OrderService();