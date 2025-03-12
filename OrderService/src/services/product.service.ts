import axios from 'axios';
import dotenv from 'dotenv';
// import logger from '../utils/logger';
import { logger } from 'shared';

dotenv.config();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000';
const INTERNAL_ACCESS_TOKEN = process.env.INTERNAL_ACCESS_TOKEN;

interface ProductStockCheckItem {
  [mkt: string]: number;
}

export class ProductService {
  /**
   * Update product stock after creating an order
   */
  async updateProductsStock(products: ProductStockCheckItem): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      // Create UpdateDetail[] array according to DTO structure
      const updateDetails = Object.entries(products).map(([mkt, quantity]) => ({
        mkt,
        quantity, // Quantity to reduce from stock
      }));

      logger.logServiceCall('Product Service', 'PUT', '/internal/products/stocks', { updateDetails });

      const startTime = Date.now();
      const response = await axios.put(
        `${PRODUCT_SERVICE_URL}/internal/products/stocks`,
        { updateDetails },
        {
          headers: {
            'internal-access-token': INTERNAL_ACCESS_TOKEN,
            'Authorization': `Bearer ${INTERNAL_ACCESS_TOKEN}`
          }
        }
      );
      const duration = Date.now() - startTime;
      
      logger.logServiceResponse('Product Service', 'PUT', '/internal/products/stocks', response.status, response.data, duration);
      
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        logger.error(`Failed to update product stock`, {
          status: error.response.status,
          message: error.message,
          responseData: error.response.data
        });
        
        // Return error data from the products server
        return { 
          success: false, 
          error: error.response.data
        };
      } else {
        logger.error('Unknown error updating product stock', { error });
        return { 
          success: false, 
          error: { message: 'Internal server error when updating stock' }
        };
      }
    }
  }
}

export default new ProductService();