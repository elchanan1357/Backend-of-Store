import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';

import { generateTestToken } from './generate-test-token'; 

describe('Get User Orders API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.DB_CONNECTION_URL as string);
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await Order.deleteMany({});
  });

  it('should return user orders', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    // Create test orders
    await Order.create({
      userId: testUserId,
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    await Order.create({
      userId: testUserId,
      items: [{ mkt: '30027', name: 'Another Test', price: '₪20', quantity: 2 }],
      totalAmount: 40,
      status: 'completed',
      shippingAddress: { address: 'Another Test Address' }
    });

    const response = await request(app)
      .get('/orders/user/me')
      .set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'User orders retrieved successfully');
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
    expect(response.body.orders.length).toBe(2);
    expect(response.body.orders[0]).toHaveProperty('userId', testUserId);
    expect(response.body.orders[1]).toHaveProperty('userId', testUserId);
  });

  it('should return empty array if user has no orders', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const token = generateTestToken(testUserId);

    const response = await request(app)
      .get('/orders/user/me')
      .set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
    expect(response.body.orders.length).toBe(0);
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
      .get('/orders/user/me');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });
});