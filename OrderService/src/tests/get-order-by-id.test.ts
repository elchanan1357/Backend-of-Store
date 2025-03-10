import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';

import { generateTestToken } from './generate-test-token'; 

describe('Get Order By ID API Tests', () => {
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

  it('should return a specific order for admin', async () => {
    // Create test order
    const testUserId = new mongoose.Types.ObjectId().toString();
    const adminId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminId, 'admin');

    const order = await Order.create({
      userId: testUserId,
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .get(`/orders/${order.id}`)
      .set('auth-token', adminToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Order retrieved successfully');
    
    // Checking _doc to handle Mongoose object in response
    if (response.body._doc) {
      expect(response.body._doc).toHaveProperty('_id', order.id.toString());
      expect(response.body._doc).toHaveProperty('userId', testUserId);
    } else {
      // Fallback to direct properties if _doc is not present
      const orderData = response.body._id ? response.body : response.body.order;
      expect(orderData).toHaveProperty('_id', order.id.toString());
      expect(orderData).toHaveProperty('userId', testUserId);
    }
  });

  it('should return a specific order for the owner', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const userToken = generateTestToken(testUserId);

    const order = await Order.create({
      userId: testUserId,
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .get(`/orders/${order.id}`)
      .set('auth-token', userToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Order retrieved successfully');
    
    // Checking _doc to handle Mongoose object in response
    if (response.body._doc) {
      expect(response.body._doc).toHaveProperty('_id', order.id.toString());
    } else {
      // Fallback to direct properties if _doc is not present
      const orderData = response.body._id ? response.body : response.body.order;
      expect(orderData).toHaveProperty('_id', order.id.toString());
    }
  });

  it('should return 403 for non-owner and non-admin users', async () => {
    const orderOwnerId = new mongoose.Types.ObjectId().toString();
    const otherUserId = new mongoose.Types.ObjectId().toString();
    const otherUserToken = generateTestToken(otherUserId);

    const order = await Order.create({
      userId: orderOwnerId,
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .get(`/orders/${order.id}`)
      .set('auth-token', otherUserToken);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied');
  });

  it('should return 404 when order does not exist', async () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const userToken = generateTestToken(testUserId);
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get(`/orders/${nonExistentId}`)
      .set('auth-token', userToken);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  it('should return 401 if user is not authenticated', async () => {
    const orderId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get(`/orders/${orderId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });
});