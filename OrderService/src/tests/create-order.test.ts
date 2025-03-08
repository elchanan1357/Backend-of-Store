import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';
import axios from 'axios';
import { generateTestToken } from './generate-test-token'; 

// Mock for axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('Create Order API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.DB_CONNECTION_URL as string);
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear mocks and database before each test
    jest.clearAllMocks();
    await Order.deleteMany({});
  });

  it('should create a new order when valid data is provided', async () => {
    // Mock stock update response
    mockedAxios.put.mockResolvedValueOnce({
      status: 200,
      data: { success: true }
    });

    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    const orderData = {
      items: [
        {
          mkt: '30026',
          name: 'Headphones QuietComfort',
          price: '₪899',
          quantity: 1
        }
      ],
      shippingAddress: {
        address: 'Igal Alon 94, Tel Aviv, Israel'
      }
    };

    const response = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .send(orderData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Order created successfully');
    expect(response.body).toHaveProperty('order');
    expect(response.body.order).toHaveProperty('userId', testUserId);
    expect(response.body.order).toHaveProperty('status', 'pending');
    expect(response.body.order.items).toHaveLength(1);
    expect(response.body.order.totalAmount).toBe(899); // 899 * 1

    // Verify that product service was called correctly
    expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/internal/products/stocks'),
      { updateDetails: [{ mkt: '30026', quantity: 1 }] },
      expect.any(Object)
    );
  });

  it('should return 400 when product service returns error', async () => {
    // Mock stock update failure
    mockedAxios.put.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          success: false,
          error: {
            message: 'Products not in stock',
            status: 400
          },
          data: {
            WrongMkts: ['30026']
          }
        }
      }
    });

    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    const orderData = {
      items: [
        {
          mkt: '30026',
          name: 'Headphones QuietComfort',
          price: '₪899',
          quantity: 1
        }
      ],
      shippingAddress: {
        address: 'Igal Alon 94, Tel Aviv, Israel'
      }
    };

    const response = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .send(orderData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Failed to update product stock');
    expect(response.body.details).toBeDefined();
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
        shippingAddress: { address: 'Test Address' }
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });

  it('should return 400 if required fields are missing', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    // Missing shipping address
    const response = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .send({
        items: [
          {
            mkt: '30026',
            name: 'Headphones QuietComfort',
            price: '₪899',
            quantity: 1
          }
        ]
        // Missing shippingAddress
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should return 400 if item price format is invalid', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    const response = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .send({
        items: [
          {
            mkt: '30026',
            name: 'Headphones QuietComfort',
            price: '899', // Invalid price format (missing ₪)
            quantity: 1
          }
        ],
        shippingAddress: {
          address: 'Igal Alon 94, Tel Aviv, Israel'
        }
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body.errors).toBeDefined();
    // Should contain validation error for price format
    expect(response.body.errors.some((error: any) => 
      error.property.includes('price') && 
      error.constraints && 
      error.constraints.matches
    )).toBe(true);
  });
});